import { test } from "node:test";
import assert from "node:assert/strict";
import { seed, upgradeDemoCatalog } from "../lib/demo";
import { searchOpportunities, validateOpportunity } from "../lib/model";
import { expandedCatalog, catalogIndustries } from "../lib/catalog";

test("catalog spans 20 fields with unique jobs and distinct actionable challenge briefs", () => {
  const s = seed();
  assert.equal(s.opportunities.length, 88);
  assert.equal(new Set(s.opportunities.map((o) => o.id)).size, 88);
  assert.equal(new Set(s.opportunities.map((o) => o.industry)).size, 20);
  assert.equal(new Set(expandedCatalog().map((o) => o.challenge)).size, 80);
  for (const industry of catalogIndustries)
    assert.ok(
      s.opportunities.filter((o) => o.industry === industry).length >= 4,
      industry,
    );
  for (const o of expandedCatalog()) {
    assert.ok(o.majors!.length >= 2);
    assert.ok(o.instructions.length > 200);
    assert.ok(o.deliverables.length >= 2);
    assert.equal(o.demo, true);
    assert.deepEqual(validateOpportunity(o), {});
  }
});
test("natural-language role and major searches return relevant jobs across disciplines", () => {
  const jobs = seed().opportunities;
  for (const q of [
    "software roles",
    "business jobs",
    "art internships",
    "engineering positions",
    "psychology jobs",
    "HR roles",
    "healthcare internships",
    "computer science internships",
    "education opportunities",
    "music roles",
    "law internships",
    "hospitality jobs",
  ])
    assert.ok(searchOpportunities(jobs, q).length > 0, q);
  assert.ok(
    searchOpportunities(jobs, "software roles").every(
      (o) => o.industry === "Software & AI",
    ),
  );
  assert.ok(
    searchOpportunities(jobs, "art internships").some(
      (o) => o.industry === "Arts & Culture",
    ),
  );
  assert.ok(
    searchOpportunities(jobs, "software roles near Toronto").every(
      (o) => o.location === "Toronto",
    ),
  );
  assert.equal(searchOpportunities(jobs, "cartographer on Jupiter").length, 0);
});
test("search does not match AI as an incidental fragment inside words", () => {
  const base = seed().opportunities[0];
  const unrelated = {
    ...base,
    title: "Editorial Assistant",
    industry: "Media",
    challenge: "Explain a story",
    company: "Demo Studio",
    majors: ["English"],
    tags: [],
  };
  assert.equal(searchOpportunities([unrelated], "AI roles").length, 0);
});
test("catalog upgrade preserves existing applications, saved choices, edited listings, and custom opportunities", () => {
  const original = seed();
  original.opportunities = original.opportunities.slice(0, 8);
  original.opportunities[0] = {
    ...original.opportunities[0],
    title: "My edited demo role",
  };
  original.opportunities.push({
    ...original.opportunities[1],
    id: "employer-custom",
    title: "Custom draft",
    status: "Draft",
  });
  original.saved = ["ai-developer"];
  original.applications[0].notes = "Keep private note";
  original.applications[0].stage = "Shortlisted";
  const upgraded = upgradeDemoCatalog(original);
  assert.equal(upgraded.opportunities.length, 89);
  assert.equal(upgraded.opportunities[0].title, "My edited demo role");
  assert.ok(upgraded.opportunities.some((o) => o.id === "employer-custom"));
  assert.deepEqual(upgraded.saved, original.saved);
  assert.deepEqual(upgraded.applications, original.applications);
  assert.equal(upgradeDemoCatalog(upgraded).opportunities.length, 89);
});
test("paid, unpaid, part-time effort, arrangement and role variety is represented consistently", () => {
  const jobs = expandedCatalog();
  assert.ok(jobs.some((o) => !o.paid && o.pay === 0));
  assert.ok(jobs.some((o) => o.paid && o.pay > 0));
  assert.equal(new Set(jobs.map((o) => o.arrangement)).size, 3);
  assert.equal(new Set(jobs.map((o) => o.type)).size, 2);
  assert.ok(jobs.some((o) => o.effort === 1.5));
  assert.ok(jobs.every((o) => o.reviewDays > 0 && o.effort <= 3));
});
