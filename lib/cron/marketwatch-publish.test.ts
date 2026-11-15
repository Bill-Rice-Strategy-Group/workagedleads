import { test } from "node:test";
import assert from "node:assert/strict";
import { upsertPriceBenchmarks, getExistingBenchmarks } from "./marketwatch-publish";

// The benchmark write path was retired on purpose (BACKLOG 2026-08-13). A call
// without the explicit opt-in must refuse before it touches Sanity.
test("upsertPriceBenchmarks refuses without the explicit opt-in", async () => {
  await assert.rejects(() => upsertPriceBenchmarks([], "2026-11"), /retired/);
});

test("getExistingBenchmarks refuses without the explicit opt-in", async () => {
  await assert.rejects(() => getExistingBenchmarks(), /retired/);
});
