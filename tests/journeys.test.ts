import { test } from "node:test";
import assert from "node:assert/strict";
import { seed, student, employer } from "../lib/demo";
import {
  searchOpportunities,
  submitApplication,
  changeStage,
  deadlineInfo,
  validateOpportunity,
  studentView,
} from "../lib/model";
test("seed provides 88 listings, four student applications, at least five candidates, integrity and overdue scenarios", () => {
  const s = seed();
  assert.equal(s.opportunities.length, 88);
  assert.equal(s.applications.filter((a) => a.studentId === "alex").length, 4);
  assert.ok(s.applications.filter((a) => a.stage !== "Draft").length >= 5);
  assert.ok(
    s.applications.some(
      (a) => a.integrity === "Demo: human review recommended",
    ),
  );
  assert.ok(s.applications.some((a) => deadlineInfo(a).overdue));
});
test("landing natural-language query and each category return relevant matches", () => {
  const s = seed();
  assert.ok(
    searchOpportunities(
      s.opportunities,
      "I am looking for AI internships near Toronto",
    ).length > 0,
  );
  assert.ok(
    searchOpportunities(
      s.opportunities,
      "I'm looking for AI internships near Toronto",
    ).every((o) => o.location === "Toronto" && o.industry === "Software & AI"),
  );
  for (const q of [
    "AI internships",
    "Business challenges",
    "Engineering projects",
    "Marketing opportunities",
  ])
    assert.ok(searchOpportunities(s.opportunities, q).length > 0);
  assert.equal(searchOpportunities(s.opportunities, "nonexistent").length, 0);
});
test("draft → submission → employer shortlist → student view persists linked statuses and deadline snapshot", () => {
  const s = seed();
  s.user = student;
  const draft = s.applications.find((a) => a.stage === "Draft")!;
  const now = new Date();
  let current = submitApplication(s, draft.id, now);
  const app = current.applications.find((a) => a.id === draft.id)!;
  assert.equal(app.stage, "Submitted");
  assert.equal(app.integrity, "Not checked");
  assert.equal(
    new Date(app.reviewDue!).getTime(),
    now.getTime() + 7 * 86400000,
  );
  current.opportunities = current.opportunities.map((o) => ({
    ...o,
    reviewDays: 30,
  }));
  assert.equal(
    current.applications.find((a) => a.id === app.id)!.reviewDue,
    app.reviewDue,
  );
  current.user = employer;
  current = changeStage(current, app.id, "Shortlisted");
  const updated = current.applications.find((a) => a.id === app.id)!;
  assert.equal(studentView(updated).stage, "Shortlisted");
  assert.equal(deadlineInfo(updated).label, "Review recorded");
  assert.equal(updated.history.at(-1)!.stage, "Shortlisted");
  assert.equal(
    JSON.parse(JSON.stringify(current)).applications.find(
      (a: { id: string }) => a.id === app.id,
    ).stage,
    "Shortlisted",
  );
});
test("missing submission permissions and unauthorized users cannot submit or decide", () => {
  const s = seed();
  s.user = student;
  const a = s.applications.find((a) => a.stage === "Draft")!;
  a.eligibility.acknowledgment = false;
  assert.throws(() => submitApplication(s, a.id), /permission/);
  assert.throws(() => changeStage(s, a.id, "Shortlisted"), /Employer/);
  s.user = employer;
  assert.throws(() => submitApplication(s, a.id), /student/);
  assert.throws(() => changeStage(s, a.id, "Shortlisted"), /unavailable/);
});
test("withdrawn application cannot be silently reactivated", () => {
  const s = seed();
  s.user = employer;
  s.applications[0].stage = "Withdrawn";
  assert.throws(
    () => changeStage(s, s.applications[0].id, "Shortlisted"),
    /unavailable/,
  );
});
test("private notes are omitted from student projection; flags never change hiring status", () => {
  const s = seed();
  const a = s.applications.find(
    (a) => a.integrity === "Demo: human review recommended",
  )!;
  a.notes = "Private reviewer note";
  assert.ok(!("notes" in studentView(a)));
  assert.ok(!("followUp" in studentView(a)));
  assert.equal(a.stage, "Submitted");
});
test("opportunity publishing validation enforces review commitment, future deadline, bounded effort", () => {
  const o = seed().opportunities[0];
  assert.deepEqual(validateOpportunity(o), {});
  assert.ok(validateOpportunity({ ...o, reviewDays: 0 }).reviewDays);
  assert.ok(validateOpportunity({ ...o, effort: 99 }).effort);
  assert.ok(validateOpportunity({ ...o, deadline: "2020-01-01" }).deadline);
  assert.ok(validateOpportunity({ ...o, company: "" }).company);
});
test("deadlines use calendar-day durations and exclude drafts, withdrawn, completed reviews", () => {
  const s = seed();
  const a = s.applications[0];
  a.reviewDue = "2026-11-10T12:00:00Z";
  assert.deepEqual(
    deadlineInfo(a, new Date("2026-11-12T12:00:00Z").getTime()),
    { label: "2 days overdue", overdue: true },
  );
  assert.equal(deadlineInfo({ ...a, stage: "Draft" }).overdue, false);
  assert.equal(deadlineInfo({ ...a, stage: "Withdrawn" }).overdue, false);
  assert.equal(
    deadlineInfo({ ...a, reviewedAt: "2026-11-09T12:00:00Z" }).overdue,
    false,
  );
});
