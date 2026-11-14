import { NextResponse } from "next/server";
import { EDITORIAL_CALENDAR } from "@/data/editorial-calendar";
import { GLOSSARY_TERMS } from "@/data/glossary-terms";
import { analyzeAndPlan, writeArticle } from "@/lib/cron/ai-content";
import {
  getExistingPosts,
  getGlossaryTermSlugs,
  getLeadTypeSlugs,
  publishArticle,
} from "@/lib/cron/sanity-publish";
import { generateAndAttachFeaturedImage } from "@/lib/cron/featured-image";
import { dedupeBriefs, fetchOpenPrTitles } from "@/lib/cron/content-dedupe";
import { commitFilesToGitHub } from "@/lib/cron/git-commit";
import { recordCronRun } from "@/lib/cron/heartbeat";
import { sendWeeklyReport } from "@/lib/cron/notify";
import type {
  WeeklyReport,
  GeneratedArticle,
  PublishedArticle,
  SkippedArticle,
  FailedArticle,
  ImageOutcomeReport,
  SEOAnalysis,
  WeeklyBrief,
} from "@/lib/cron/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const REPORT_EMAIL = "bill@billricestrategy.com";

function getWeekDates(): {
  monday: string;
  wednesday: string;
  friday: string;
  weekLabel: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);

  const wednesday = new Date(monday);
  wednesday.setDate(monday.getDate() + 2);

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  return {
    monday: fmt(monday),
    wednesday: fmt(wednesday),
    friday: fmt(friday),
    weekLabel: fmt(monday),
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Auto-publishing DISABLED 2026-06-23 by owner directive — no cron auto-publishing
  // on BRSG sites. Also unscheduled in vercel.json. To re-enable, set
  // CRON_PUBLISH_DISABLED="false" in the environment AND restore the vercel.json cron.
  if (process.env.CRON_PUBLISH_DISABLED !== "false") {
    return NextResponse.json({
      disabled: true,
      reason: "weekly-content auto-publishing disabled by owner directive (2026-06-23)",
    });
  }

  const startTime = Date.now();
  const errors: string[] = [];
  const weekDates = getWeekDates();
  const articlesCreated: PublishedArticle[] = [];
  const articlesSkipped: SkippedArticle[] = [];
  const articlesFailed: FailedArticle[] = [];
  const imageOutcomes: ImageOutcomeReport[] = [];
  const seenPhotoIds = new Set<string>();
  let analysis: SEOAnalysis | null = null;
  let briefs: WeeklyBrief[] = [];
  let nextWeekPlan = "";
  let fatalError: string | undefined;

  console.log(
    `[Weekly Content] Starting run for week of ${weekDates.weekLabel}`
  );

  try {
    let existingPosts = await getExistingPosts();
    let [glossaryTermSlugs, leadTypeSlugs] = await Promise.all([
      getGlossaryTermSlugs(),
      getLeadTypeSlugs(),
    ]);
    if (glossaryTermSlugs.length === 0) {
      glossaryTermSlugs = GLOSSARY_TERMS.map((t) => t.slug);
    }

    console.log(
      `[State] ${existingPosts.length} posts, ${glossaryTermSlugs.length} glossary terms, ${leadTypeSlugs.length} lead types`
    );

    try {
      console.log("[Planning] Analyzing SEO strategy and creating content plan...");
      const plan = await analyzeAndPlan(
        existingPosts,
        EDITORIAL_CALENDAR,
        glossaryTermSlugs,
        leadTypeSlugs,
        weekDates
      );
      analysis = plan.analysis;
      const dayToDate: Record<string, string> = {
        Mon: weekDates.monday,
        Wed: weekDates.wednesday,
        Fri: weekDates.friday,
      };
      briefs = plan.briefs.map((b) => ({
        ...b,
        publishDate: dayToDate[b.day] ?? b.publishDate,
      }));
      nextWeekPlan = plan.calendarNotes;
      console.log(`[Planning] Created plan with ${briefs.length} briefs`);
    } catch (err) {
      fatalError = `Content planning failed: ${err instanceof Error ? err.message : String(err)}`;
      console.error(fatalError);
    }

    // Dedupe gate — BEFORE anything is written. Fails closed: if open PRs
    // cannot be read, nothing is drafted this run. See lib/cron/content-dedupe.ts.
    if (briefs.length > 0) {
      try {
        const openPrTitles = await fetchOpenPrTitles();
        const { kept, rejected } = dedupeBriefs(briefs, existingPosts, openPrTitles);
        for (const r of rejected) {
          articlesSkipped.push({
            title: r.brief.title,
            slug: r.brief.slug,
            reason: `Dedupe gate: ${r.reason}`,
          });
          console.warn(`[Dedupe] Rejected "${r.brief.title}": ${r.reason}`);
        }
        briefs = kept;
      } catch (err) {
        fatalError = `Dedupe gate could not run: ${err instanceof Error ? err.message : String(err)}`;
        console.error(fatalError);
        briefs = [];
      }
    }

    if (briefs.length > 0) {
      console.log("[Writing] Generating articles in parallel...");
      const writeResults = await Promise.allSettled(
        briefs.map((brief) =>
          writeArticle(brief, glossaryTermSlugs, leadTypeSlugs)
        )
      );

      const articles: GeneratedArticle[] = [];
      for (let i = 0; i < writeResults.length; i++) {
        const result = writeResults[i];
        if (result.status === "fulfilled") {
          articles.push(result.value);
          console.log(`[Writing] Completed: ${briefs[i].title}`);
        } else {
          articlesFailed.push({
            title: briefs[i].title,
            reason: `Write failed: ${result.reason}`,
          });
          console.error(`[Writing] Failed: ${briefs[i].title}`, result.reason);
        }
      }

      for (const article of articles) {
        try {
          const outcome = await publishArticle(article, existingPosts);
          if (outcome.status === "created") {
            articlesCreated.push({
              title: article.brief.title,
              slug: outcome.slug,
              publishDate: article.brief.publishDate,
              primaryKeyword: article.brief.primaryKeyword,
              pillar: article.brief.pillar,
            });
            existingPosts.push({
              id: outcome.id,
              slug: outcome.slug,
              title: article.brief.title,
            });
            console.log(`[Publish] Created: ${article.brief.title}`);

            try {
              const imgOutcome = await generateAndAttachFeaturedImage(
                outcome.id,
                article.brief.title,
                { excludePhotoIds: seenPhotoIds }
              );
              if (imgOutcome.status === "created") {
                seenPhotoIds.add(imgOutcome.photoId);
                imageOutcomes.push({
                  title: article.brief.title,
                  status: "created",
                  photographer: imgOutcome.photographer,
                });
                console.log(
                  `[Image] Attached to ${article.brief.title} (photo by ${imgOutcome.photographer})`
                );
              } else {
                imageOutcomes.push({
                  title: article.brief.title,
                  status: imgOutcome.reason,
                  detail: imgOutcome.detail,
                });
                console.warn(
                  `[Image] Skipped for ${article.brief.title}: ${imgOutcome.reason}${imgOutcome.detail ? ` (${imgOutcome.detail})` : ""}`
                );
              }
            } catch (imgErr) {
              const detail = imgErr instanceof Error ? imgErr.message : String(imgErr);
              imageOutcomes.push({
                title: article.brief.title,
                status: "upload-failed",
                detail,
              });
              console.error(
                `[Image] Failed for ${article.brief.title}:`,
                imgErr
              );
            }
          } else {
            articlesSkipped.push({
              title: article.brief.title,
              slug: outcome.slug,
              reason: outcome.reason,
            });
            console.warn(
              `[Publish] Skipped "${article.brief.title}": ${outcome.reason}`
            );
          }
        } catch (err) {
          articlesFailed.push({
            title: article.brief.title,
            reason: `Publish failed: ${err instanceof Error ? err.message : String(err)}`,
          });
          console.error(`[Publish] Failed: ${article.brief.title}`, err);
        }
      }
    }
  } catch (err) {
    fatalError = `Run failed before planning: ${err instanceof Error ? err.message : String(err)}`;
    console.error(fatalError);
  }

  const report: WeeklyReport = {
    runDate: new Date().toISOString(),
    weekStartDate: weekDates.weekLabel,
    analysis,
    articlesCreated,
    articlesSkipped,
    articlesFailed,
    imageOutcomes,
    newBriefs: briefs,
    nextWeekPlan,
    errors,
    fatalError,
  };

  if (articlesCreated.length > 0) {
    try {
      const reportFilename = `data/weekly-reports/${weekDates.weekLabel}.json`;
      const strategyUpdate = {
        lastRun: report.runDate,
        weekOf: weekDates.weekLabel,
        analysis,
        articlesCreated,
        articlesSkipped,
        articlesFailed,
        briefsForNextWeek: nextWeekPlan,
      };
      await commitFilesToGitHub(
        [
          { path: reportFilename, content: JSON.stringify(report, null, 2) },
          {
            path: "data/seo-strategy-latest.json",
            content: JSON.stringify(strategyUpdate, null, 2),
          },
        ],
        `chore(content): weekly content run — ${weekDates.weekLabel}\n\nCreated ${articlesCreated.length} articles:\n${articlesCreated.map((a) => `- ${a.title}`).join("\n")}`
      );
      console.log("[Git] Committed weekly report and strategy update");
    } catch (err) {
      const msg = `GitHub commit failed: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      errors.push(msg);
      report.errors = errors;
    }
  }

  try {
    await sendWeeklyReport(report, REPORT_EMAIL);
    console.log(`[Email] Report sent to ${REPORT_EMAIL}`);
  } catch (err) {
    console.error(
      "[Email] Report send failed:",
      err instanceof Error ? err.message : err
    );
  }

  const duration = Date.now() - startTime;
  console.log(
    `[Weekly Content] Completed in ${(duration / 1000).toFixed(1)}s — created=${articlesCreated.length} skipped=${articlesSkipped.length} failed=${articlesFailed.length}`
  );

  await recordCronRun({
    name: "weekly-content",
    status: fatalError
      ? "failed"
      : articlesFailed.length > 0 || articlesCreated.length === 0
        ? "partial"
        : "ok",
    detail: fatalError
      ? fatalError
      : `created=${articlesCreated.length} skipped=${articlesSkipped.length} failed=${articlesFailed.length}`,
    durationMs: duration,
  });

  const success =
    !fatalError && articlesFailed.length === 0 && articlesCreated.length > 0;

  return NextResponse.json({
    success,
    duration,
    weekOf: weekDates.weekLabel,
    articlesCreated: articlesCreated.length,
    articlesSkipped: articlesSkipped.length,
    articlesFailed: articlesFailed.length,
    fatalError,
    errors,
  });
}
