import { test } from "node:test";
import assert from "node:assert/strict";
import { dedupeBriefs } from "./content-dedupe";

const posts = [
  { slug: "how-to-work-aged-life-insurance-leads", title: "How to Work Aged Life Insurance Leads" },
  { slug: "aged-final-expense-leads-guide", title: "Aged Final Expense Leads: The Complete Guide" },
];

const brief = (slug: string, title: string, primaryKeyword: string) => ({
  slug,
  title,
  primaryKeyword,
});

test("rejects the keyword the old routine re-picked 20 times", () => {
  const { kept, rejected } = dedupeBriefs(
    [brief("aged-life-insurance-leads-2026", "Aged Life Insurance Leads in 2026: What Works", "aged life insurance leads")],
    posts,
    []
  );
  assert.equal(kept.length, 0);
  assert.match(rejected[0].reason, /already targeted/);
});

test("rejects a brief already sitting in an open PR", () => {
  const { kept, rejected } = dedupeBriefs(
    [brief("door-knocking-solar", "Door Knocking Aged Solar Leads", "door knocking solar leads")],
    [],
    ["seo-draft: Door Knocking Aged Solar Leads"]
  );
  assert.equal(kept.length, 0);
  assert.match(rejected[0].reason, /open PR/);
});

test("rejects a reused slug and a repeated keyword within one batch", () => {
  const { kept, rejected } = dedupeBriefs(
    [
      brief("how-to-work-aged-life-insurance-leads", "Something New", "voicemail scripts"),
      brief("roofing-voicemail-scripts", "Roofing Voicemail Scripts", "roofing voicemail scripts"),
      brief("roofing-voicemail-scripts-2", "Voicemail Scripts for Roofers", "roofing voicemail scripts"),
    ],
    posts,
    []
  );
  assert.deepEqual(kept.map((b) => b.slug), ["roofing-voicemail-scripts"]);
  assert.match(rejected[0].reason, /slug already used/);
  assert.match(rejected[1].reason, /in this batch/);
});

test("keeps a genuinely new angle on a covered vertical", () => {
  const { kept } = dedupeBriefs(
    [brief("life-insurance-lead-voicemail-scripts", "Voicemail Scripts for Life Insurance Leads", "life insurance voicemail scripts")],
    posts,
    []
  );
  assert.equal(kept.length, 1);
});
