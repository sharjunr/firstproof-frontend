import type { Store, Opportunity, Application, Stage } from "./types";
export function searchOpportunities(items: Opportunity[], query: string) {
  const stop = new Set([
    "i",
    "am",
    "m",
    "im",
    "i’m",
    "looking",
    "for",
    "near",
    "me",
    "a",
    "an",
    "the",
    "in",
    "opportunities",
    "opportunity",
    "challenges",
    "challenge",
    "projects",
    "project",
    "please",
    "want",
    "internships",
    "internship",
    "jobs",
    "job",
  ]);
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9 +]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !stop.has(t));
  return items.filter(
    (o) =>
      o.status === "Published" &&
      tokens.every((t) =>
        `${o.title} ${o.company} ${o.industry} ${o.location} ${o.arrangement} ${o.challenge}`
          .toLowerCase()
          .includes(t),
      ),
  );
}
export function deadlineInfo(a: Application, now = Date.now()) {
  if (!a.reviewDue || a.stage === "Draft")
    return { label: "Starts after submission", overdue: false };
  if (a.stage === "Withdrawn") return { label: "Withdrawn", overdue: false };
  if (a.reviewedAt) return { label: "Review recorded", overdue: false };
  const days = Math.ceil((new Date(a.reviewDue).getTime() - now) / 86400000);
  return {
    label:
      days < 0
        ? `${Math.abs(days)} days overdue`
        : days === 0
          ? "Due today"
          : `${days} days remaining`,
    overdue: days < 0,
  };
}
export function validateOpportunity(o: Opportunity) {
  const errors: Record<string, string> = {};
  for (const key of [
    "title",
    "company",
    "description",
    "location",
    "challenge",
    "instructions",
    "qualifications",
    "criteria",
    "tools",
    "eligibility",
  ] as const)
    if (o[key].trim().length < 3)
      errors[key] = "Please enter at least 3 characters.";
  if (!o.deliverables.length || o.deliverables.some((d) => !d.trim()))
    errors.deliverables = "Add at least one required deliverable.";
  if (!Number.isFinite(o.reviewDays) || o.reviewDays < 1 || o.reviewDays > 30)
    errors.reviewDays = "Choose 1–30 calendar days.";
  if (!Number.isFinite(o.effort) || o.effort < 0.5 || o.effort > 8)
    errors.effort = "Scope the challenge to 0.5–8 hours.";
  if (!Number.isFinite(o.duration) || o.duration < 1 || o.duration > 24)
    errors.duration = "Choose 1–24 months.";
  if (o.pay < 0 || !Number.isFinite(o.pay))
    errors.pay = "Pay cannot be negative.";
  if (!o.deadline || new Date(o.deadline + "T23:59:59Z").getTime() < Date.now())
    errors.deadline = "Choose a future application deadline.";
  return errors;
}
export function submitApplication(
  s: Store,
  id: string,
  now = new Date(),
): Store {
  const a = s.applications.find((a) => a.id === id),
    o = s.opportunities.find((o) => o.id === a?.opportunityId);
  if (!a || !o || s.user?.id !== a.studentId || s.user.role !== "student")
    throw new Error("Sign in as the student who owns this draft.");
  if (a.stage !== "Draft")
    throw new Error("This application has already been submitted.");
  if (new Date(o.deadline + "T23:59:59Z") < now || o.status !== "Published")
    throw new Error("This opportunity is no longer accepting applications.");
  if (!Object.values(a.eligibility).every(Boolean))
    throw new Error(
      "Confirm all eligibility declarations and the acknowledgment.",
    );
  if (a.text.trim().length < 30)
    throw new Error("Add an explanation of at least 30 characters.");
  if (!a.links.length && !a.files.length && a.text.trim().length < 80)
    throw new Error(
      "Add a link, file, or at least 80 characters of project content.",
    );
  if (a.files.some((f) => !f.stored))
    throw new Error("Some files were not saved. Remove or reselect them.");
  return {
    ...s,
    applications: s.applications.map((x) =>
      x.id === id
        ? {
            ...x,
            stage: "Submitted",
            submittedAt: now.toISOString(),
            reviewDue: new Date(
              now.getTime() + o.reviewDays * 86400000,
            ).toISOString(),
            integrity: "Not checked",
            history: [
              ...x.history,
              {
                stage: "Submitted",
                at: now.toISOString(),
                message:
                  "Saved in the local demo. No server upload or similarity analysis occurred.",
              },
            ],
          }
        : x,
    ),
  };
}
export function changeStage(s: Store, id: string, stage: Stage): Store {
  const a = s.applications.find((x) => x.id === id),
    o = s.opportunities.find((x) => x.id === a?.opportunityId);
  if (!a || s.user?.role !== "employer" || o?.owner !== s.user.id)
    throw new Error("Employer demo access required.");
  if (
    ["Draft", "Withdrawn"].includes(a.stage) ||
    ![
      "Under Employer Review",
      "Shortlisted",
      "Declined",
      "Invited to Next Stage",
    ].includes(stage)
  )
    throw new Error("This status transition is unavailable.");
  const at = new Date().toISOString();
  return {
    ...s,
    applications: s.applications.map((x) =>
      x.id === id
        ? {
            ...x,
            stage,
            reviewedAt: [
              "Shortlisted",
              "Declined",
              "Invited to Next Stage",
            ].includes(stage)
              ? at
              : x.reviewedAt,
            history: [
              ...x.history,
              {
                stage,
                at,
                message: "Demo employer updated the recruitment stage.",
              },
            ],
          }
        : x,
    ),
  };
}
export function studentView(a: Application) {
  const { notes, followUp, ...visible } = a;
  void notes;
  void followUp;
  return visible;
}
