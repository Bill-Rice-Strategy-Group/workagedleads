import { createClient } from "next-sanity";
import type { BenchmarkEstimate } from "./marketwatch-ai";

function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN"
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-03-14",
    token,
    useCdn: false,
  });
}

/**
 * Get all provider slugs and their lastVerified dates from Sanity.
 */
export async function getProviderProfiles(): Promise<
  {
    slug: string;
    name: string;
    website: string;
    lastVerified: string;
    pricingModel: string;
    leadTypes: string[];
    verticals: string[];
    returnPolicy: string;
  }[]
> {
  const client = getSanityWriteClient();
  return client.fetch(
    `*[_type == "leadProvider"] {
      "slug": slug.current,
      name,
      website,
      lastVerified,
      pricingModel,
      leadTypes,
      "verticals": verticals[]->slug.current,
      returnPolicy
    }`
  );
}

/**
 * Retired write path. The Lead Price Index is a hand-published quarterly study
 * (`npm run price-index:import`), and marketwatch stopped synthesizing
 * benchmarks in 2026-06 because single-provider LLM estimates were polluting the
 * public index. Nothing calls this or `getExistingBenchmarks`. They are kept, not
 * deleted, because removing the only automated benchmark writer is Bill's call
 * (BACKLOG 2026-08-13). The guard makes a careless re-wire fail loudly instead of
 * quietly republishing the estimates that were removed on purpose.
 */
const RETIRED_BENCHMARK_PATH =
  "marketwatch benchmark synthesis is retired: the Lead Price Index is hand-published " +
  "(npm run price-index:import). Re-enabling this path needs Bill's sign-off; see BACKLOG.md 2026-08-13.";

/**
 * Upsert price benchmark documents into Sanity.
 * Creates new documents for the current month.
 *
 * @deprecated Retired. Throws unless `allowRetiredPath` is set deliberately.
 */
export async function upsertPriceBenchmarks(
  benchmarks: BenchmarkEstimate[],
  month: string,
  { allowRetiredPath = false }: { allowRetiredPath?: boolean } = {}
): Promise<number> {
  if (!allowRetiredPath) throw new Error(RETIRED_BENCHMARK_PATH);
  if (benchmarks.length === 0) return 0;

  const client = getSanityWriteClient();
  let created = 0;

  // Quality guard: never publish single-provider estimates. The LLM synthesis
  // step occasionally emits a benchmark from one provider that collapses to a
  // meaningless flat range (e.g. $1–$1). Those pollute the public index and
  // are filtered out of display anyway (isTrustworthyBenchmark), so we drop
  // them at the source rather than carry the junk forward.
  const publishable = benchmarks.filter((b) => (b.providersSampled ?? 0) >= 2);
  const skipped = benchmarks.length - publishable.length;
  if (skipped > 0) {
    console.log(
      `Skipping ${skipped} single-provider benchmark(s) below the 2-provider quality bar`
    );
  }
  if (publishable.length === 0) return 0;

  // First, get vertical IDs by slug
  const verticals: { _id: string; slug: string }[] = await client.fetch(
    `*[_type == "vertical"] { _id, "slug": slug.current }`
  );

  const verticalMap = new Map(verticals.map((v) => [v.slug, v._id]));

  for (const benchmark of publishable) {
    const verticalId = verticalMap.get(benchmark.vertical);
    if (!verticalId) {
      console.warn(
        `Skipping benchmark: no vertical found for slug "${benchmark.vertical}"`
      );
      continue;
    }

    // Create a deterministic ID for upsert
    const docId = `benchmark-${benchmark.vertical}-${benchmark.leadAgeBracket}-${benchmark.exclusivity}-${benchmark.leadType}-${month}`;

    try {
      await client.createOrReplace({
        _id: docId,
        _type: "priceBenchmark",
        vertical: { _type: "reference", _ref: verticalId },
        leadAgeBracket: benchmark.leadAgeBracket,
        exclusivity: benchmark.exclusivity,
        leadType: benchmark.leadType,
        month,
        priceLow: benchmark.priceLow,
        priceMedian: benchmark.priceMedian,
        priceHigh: benchmark.priceHigh,
        providersSampled: benchmark.providersSampled,
        confidence: benchmark.confidence,
        notes: benchmark.notes,
      });
      created++;
    } catch (err) {
      console.error(`Failed to upsert benchmark ${docId}:`, err);
    }
  }

  return created;
}

/**
 * Find providers whose lastVerified date is older than the given threshold.
 */
export async function findStaleProviders(
  daysThreshold: number = 30
): Promise<string[]> {
  const client = getSanityWriteClient();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);
  const cutoff = cutoffDate.toISOString().split("T")[0];

  const stale: { name: string; lastVerified: string }[] = await client.fetch(
    `*[_type == "leadProvider" && lastVerified < $cutoff] {
      name,
      lastVerified
    }`,
    { cutoff }
  );

  return stale.map(
    (p) => `${p.name} (last verified: ${p.lastVerified})`
  );
}

/**
 * Update a provider's lastVerified date.
 */
export async function updateProviderVerifiedDate(
  slug: string
): Promise<void> {
  const client = getSanityWriteClient();
  const today = new Date().toISOString().split("T")[0];

  const provider = await client.fetch(
    `*[_type == "leadProvider" && slug.current == $slug][0]._id`,
    { slug }
  );

  if (provider) {
    // `lastScanned`, NOT `lastVerified`.
    //
    // This used to stamp lastVerified, with a comment reasoning that "a
    // successful scan is a verification event. Without this, the 'Verified'
    // freshness indicator on the public site never advances." The indicator
    // advancing was the bug, not the goal: it meant all fifteen providers
    // displayed a recent verification date while their human review dates were
    // 138-160 days old.
    //
    // This scan reads pricing and policy pages. It reported zero changes for
    // LeadsData across the weeks in which that company stopped selling aged
    // leads and became a behavior-analytics SaaS, because its PRICES did not
    // move in a way the extractor noticed. A check that cannot see a company
    // change business model is not a verification, and on a directory selling
    // independent verification, saying otherwise is the costly kind of wrong.
    //
    // If the indicator now goes stale, that is the system telling the truth
    // about when someone last actually looked.
    await client.patch(provider).set({ lastScanned: today }).commit();
  }
}

/**
 * Get existing benchmark data for comparison.
 *
 * @deprecated Retired with `upsertPriceBenchmarks`; it only existed to feed it.
 */
export async function getExistingBenchmarks({
  allowRetiredPath = false,
}: { allowRetiredPath?: boolean } = {}): Promise<BenchmarkEstimate[]> {
  if (!allowRetiredPath) throw new Error(RETIRED_BENCHMARK_PATH);
  const client = getSanityWriteClient();

  const data: {
    vertical: string;
    leadAgeBracket: string;
    exclusivity: string;
    leadType: string;
    priceLow: number;
    priceMedian: number;
    priceHigh: number;
    providersSampled: number;
    confidence: string;
    notes: string;
  }[] = await client.fetch(
    `*[_type == "priceBenchmark"] | order(month desc) {
      "vertical": vertical->slug.current,
      leadAgeBracket,
      exclusivity,
      leadType,
      priceLow,
      priceMedian,
      priceHigh,
      providersSampled,
      confidence,
      notes
    }`
  );

  return data.map((d) => ({
    ...d,
    confidence: (d.confidence as "high" | "medium" | "low") || "medium",
  }));
}
