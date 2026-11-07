import type { Store, Opportunity, Application, Stage } from "./types";

export function searchOpportunities(items: Opportunity[], query: string) {
  const stop = new Set([
    "i",
    "am",
    "m",
    "im",
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
    "role",
    "roles",
    "positions",
    "position",
    "work",
    "find",
    "show",
    "some",
    "my",
    "major",
    "majors",
  ]);
  const aliases: Record<string, string[]> = {
    arts: ["art", "arts", "illustration", "theatre", "music"],
    art: ["art", "arts", "illustration", "graphic"],
    hr: ["human resources", "people operations"],
    healthcare: ["health", "clinical", "nursing", "public health"],
    tech: ["software", "technology", "computer science"],
    coding: ["developer", "software", "programming"],
    engineer: ["engineer", "engineering"],
    engineers: ["engineer", "engineering"],
    designer: ["design", "designer"],
    designers: ["design", "designer"],
    finance: ["finance", "financial", "investment", "accounting"],
    ai: ["ai", "artificial intelligence", "machine learning"],
    remote: ["remote"],
    business: ["business", "operations", "finance", "sales"],
    psych: ["psychology", "behavioral"],
  };
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9+#]+/g, " ")
      .trim();
  const tokens = normalize(query)
    .split(/\s+/)
    .filter((t) => t && !stop.has(t));
  return items.filter((o) => {
    if (o.status !== "Published") return false;
    const hay =
      " " +
      normalize(
        [
          o.title,
          o.company,
          o.industry,
          o.location,
          o.arrangement,
          o.type,
          ...(o.majors || []),
          ...(o.tags || []),
        ].join(" "),
      ) +
      " ";
    return tokens.every((t) =>
      (aliases[t] || [t, t.endsWith("s") ? t.slice(0, -1) : t + "s"]).some(
        (term) => hay.includes(" " + term + " "),
      ),
    );
  });
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
  if (
    o.challengeDays !== undefined &&
    (!Number.isInteger(o.challengeDays) ||
      o.challengeDays < 1 ||
      o.challengeDays > 60)
  )
    errors.challengeDays = "Choose 1–60 whole days.";
  if (o.rubric) {
    const rubricError = rubricErrors(o.rubric);
    if (rubricError) errors.rubric = rubricError;
  }
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
  if (
    a.joinedAt &&
    o.challengeDays &&
    new Date(a.joinedAt).getTime() + o.challengeDays * 86400000 < now.getTime()
  )
    throw new Error("Your joined challenge window has ended.");
  if (a.stage !== "Draft")
    throw new Error("This application has already been submitted.");
  if (new Date(o.deadline + "T23:59:59Z") < now || o.status !== "Published")
    throw new Error("This opportunity is no longer accepting applications.");
  if (!a.eligibility.availability || !a.eligibility.acknowledgment)
    throw new Error(
      "Confirm availability and your permission to submit this work.",
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

// An explicit projection: legacy educational fields never reach initial review.
export function employerApplicationView(a: Application) {
  const {
    university,
    program,
    resume,
    backgroundRequest,
    eligibility,
    ...initial
  } = a;
  void university;
  void program;
  void resume;
  void eligibility;
  const mayShare =
    ["Shortlisted", "Invited to Next Stage"].includes(a.stage) &&
    backgroundRequest?.status === "shared";
  return {
    ...initial,
    backgroundRequest: backgroundRequest
      ? {
          status: backgroundRequest.status,
          message: backgroundRequest.message,
          requestedAt: backgroundRequest.requestedAt,
          ...(mayShare
            ? {
                resume: backgroundRequest.resume,
                resumeFile: backgroundRequest.resumeFile,
                education: backgroundRequest.education,
                sharedAt: backgroundRequest.sharedAt,
              }
            : {}),
        }
      : undefined,
  };
}
export function requestBackground(
  s: Store,
  id: string,
  message: string,
): Store {
  const a = s.applications.find((x) => x.id === id);
  const o = s.opportunities.find((o) => o.id === a?.opportunityId);
  if (!a || s.user?.role !== "employer" || o?.owner !== s.user.id)
    throw new Error("Only the responsible employer can request details.");
  if (!["Shortlisted", "Invited to Next Stage"].includes(a.stage))
    throw new Error(
      "Advance this applicant before requesting background details.",
    );
  if (a.backgroundRequest?.status === "shared")
    throw new Error("The applicant has already shared a response.");
  if (message.trim().length < 10)
    throw new Error("Explain which information you are requesting and why.");
  return {
    ...s,
    applications: s.applications.map((x) =>
      x.id === id
        ? {
            ...x,
            backgroundRequest: {
              status: "requested",
              message: message.trim(),
              requestedAt: new Date().toISOString(),
            },
          }
        : x,
    ),
  };
}
export function respondToBackground(
  s: Store,
  id: string,
  share: boolean,
  resume = "",
  education = "",
  resumeFile?: import("./types").LocalFile,
): Store {
  const a = s.applications.find((x) => x.id === id);
  if (!a || s.user?.role !== "student" || s.user.id !== a.studentId)
    throw new Error("Only this applicant can respond.");
  if (
    !["Shortlisted", "Invited to Next Stage"].includes(a.stage) ||
    a.backgroundRequest?.status !== "requested"
  )
    throw new Error("No active next-stage request exists.");
  if (share && resumeFile && (a.stage !== "Invited to Next Stage" || !/\.(pdf|doc|docx)$/i.test(resumeFile.name) || resumeFile.size <= 0 || resumeFile.size > 5 * 1024 * 1024))
    throw new Error("Resume files require a next-stage invitation and a PDF or Word document up to 5 MB.");
  if (share && !resume.trim() && !education.trim() && !resumeFile)
    throw new Error(
      "Add the information you choose to share, or decline the request.",
    );
  return {
    ...s,
    applications: s.applications.map((x) =>
      x.id === id
        ? {
            ...x,
            backgroundRequest: {
              ...a.backgroundRequest!,
              status: share ? "shared" : "declined",
              ...(share
                ? {
                    resume: resume.trim(),
                    ...(resumeFile ? {resumeFile} : {}),
                    education: education.trim(),
                    sharedAt: new Date().toISOString(),
                  }
                : {}),
            },
          }
        : x,
    ),
  };
}
export function publicOpportunityView(o: Opportunity) {
  const { referenceSolution, privateEvaluationFiles, ...publicFields } = o;
  void referenceSolution;
  void privateEvaluationFiles;
  return publicFields;
}
export function rubricErrors(rubric: Opportunity["rubric"]) {
  if (!rubric?.length) return "Add at least one rubric criterion.";
  if (
    rubric.some(
      (c) =>
        !c.label.trim() ||
        !c.description.trim() ||
        !Number.isFinite(c.weight) ||
        c.weight <= 0,
    )
  )
    return "Each criterion needs a name, description, and positive weight.";
  if (Math.abs(rubric.reduce((n, c) => n + c.weight, 0) - 100) > 0.001)
    return "Rubric weights must total 100%.";
  return "";
}
