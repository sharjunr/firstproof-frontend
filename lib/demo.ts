import { developRole } from "./role-content";
import { expandedCatalog } from "./catalog";
import type { Store, Opportunity, Application, Eligibility } from "./types";
export const emptyEligibility: Eligibility = {
  academic: false,
  authorization: false,
  availability: false,
  qualifications: false,
  acknowledgment: false,
};
export const student = {
  id: "alex",
  name: "Alex Morgan",
  email: "alex@example.test",
  role: "student" as const,
  university: "",
  program: "",
  resume: "",
};
export const employer = {
  id: "employer-demo",
  name: "Jamie Chen",
  email: "jamie@example.test",
  role: "employer" as const,
  university: "",
  program: "Hiring team · Northstar Labs (fictional)",
  resume: "",
};
const rows = [
  [
    "ai-developer",
    "AI Developer Intern",
    "Northstar Labs",
    "Software & AI",
    "Toronto",
    "Hybrid",
    28,
    4,
    3,
    "Customer feedback classifier",
    "Build a small classifier using the supplied fictional feedback. Include your approach, validation examples, and limitations.",
  ],
  [
    "frontend-developer",
    "Frontend Developer Intern",
    "Violet Systems",
    "Software & AI",
    "Toronto",
    "Remote",
    25,
    4,
    2,
    "An analytics dashboard",
    "Build a responsive dashboard from a small synthetic dataset. Explain your design and accessibility choices.",
  ],
  [
    "business-analyst",
    "Business Analyst Intern",
    "Fieldwork Advisory",
    "Business & Finance",
    "Toronto",
    "Hybrid",
    24,
    4,
    2,
    "Find the revenue story",
    "Analyze a fictional sales dataset and explain three actionable observations with supporting calculations.",
  ],
  [
    "electrical-engineer",
    "Electrical Engineering Intern",
    "Signal Works",
    "Engineering",
    "Waterloo",
    "Onsite",
    27,
    4,
    3,
    "Diagnose a circuit",
    "Use the provided synthetic voltage and current readings to identify a circuit fault. Explain your assumptions.",
  ],
  [
    "marketing",
    "Marketing Intern",
    "Orbit Creative",
    "Marketing",
    "Toronto",
    "Remote",
    22,
    3,
    2,
    "Launch something worth noticing",
    "Create a short launch plan for a fictional reusable bottle. Identify your audience, message, channels, and measurement plan.",
  ],
  [
    "data-analyst",
    "Data Analyst Intern",
    "Northstar Labs",
    "Software & AI",
    "Ottawa",
    "Remote",
    26,
    4,
    3,
    "Make messy data useful",
    "Clean a fictional customer dataset, summarize important patterns, and communicate data limitations.",
  ],
  [
    "product-design",
    "Product Design Intern",
    "Forma Collective",
    "Design",
    "Vancouver",
    "Hybrid",
    24,
    4,
    2,
    "A better first five minutes",
    "Design an onboarding flow for a fictional campus service. Explain the problem, design choices, and accessibility.",
  ],
  [
    "operations",
    "Operations Analyst Intern",
    "Common Ground",
    "Business & Finance",
    "Montreal",
    "Onsite",
    23,
    6,
    2,
    "Simplify a workflow",
    "Map a fictional order fulfillment process and recommend two improvements, with measurable success criteria.",
  ],
] as const;
const baseMajors = [
  ["Computer Science", "Computer Engineering", "Mathematics"],
  ["Computer Science", "Software Engineering"],
  ["Business Administration", "Economics", "Finance"],
  ["Electrical Engineering", "Computer Engineering"],
  ["Marketing", "Communications"],
  ["Data Science", "Statistics", "Computer Science"],
  ["Interaction Design", "Industrial Design"],
  [
    "Business Administration",
    "Supply Chain Management",
    "Industrial Engineering",
  ],
];
export function seed(now = new Date()): Store {
  const date = (days: number) =>
    new Date(now.getTime() + days * 86400000).toISOString();
  const opportunities: Opportunity[] = rows.map((r, i) => ({
    id: r[0],
    title: r[1],
    company: r[2],
    industry: r[3],
    majors: baseMajors[i],
    location: r[4],
    arrangement: r[5],
    type: i === 7 ? "Entry-level" : "Internship",
    paid: true,
    pay: r[6],
    duration: r[7],
    effort: r[8],
    deadline: date(18 + i * 3).slice(0, 10),
    reviewDays: i % 3 === 0 ? 7 : 5,
    description: `Join the fictional ${r[2]} team for a focused ${r[7]}-month opportunity. Contribute to scoped projects, communicate your reasoning, and learn through practical work. This listing is demonstration data, not an active vacancy.`,
    qualifications:
      i === 3
        ? "Current engineering student; circuit analysis fundamentals."
        : `Current student or recent graduate with relevant ${r[3].toLowerCase()} project experience.`,
    challenge: r[9],
    instructions: r[10],
    deliverables: [
      "Project work (file, link, or pasted content)",
      "Short explanation of your approach",
    ],
    tools:
      "Use tools you normally work with. AI assistance is permitted if disclosed in your explanation. Be prepared to explain your choices. Do not use confidential information.",
    criteria:
      "Human reviewers consider relevance, clarity, reasoning, and how you explain limitations. No automated quality or hiring score.",
    eligibility:
      "Currently enrolled or recently graduated; self-declared permission to work in the role location; available during the stated term.",
    status: "Published",
    owner: "employer-demo",
    demo: true,
  }));
  opportunities.push(...expandedCatalog(now));
  for (const o of opportunities) {
    o.challengeDays = 7;
    o.rubric = [
      {
        id: "reasoning",
        label: "Reasoning",
        weight: 40,
        description: "Explain the approach and assumptions.",
      },
      {
        id: "completeness",
        label: "Completeness",
        weight: 35,
        description: "Address the requested deliverables.",
      },
      {
        id: "communication",
        label: "Communication",
        weight: 25,
        description: "Communicate results and limitations clearly.",
      },
    ];
  }
  const applications: Application[] = Array.from({ length: 7 }, (_, i) => {
    const stages: Application["stage"][] = [
      "Submitted",
      "Under Employer Review",
      "Shortlisted",
      "Draft",
      "Invited to Next Stage",
      "Submitted",
      "Under Employer Review",
    ];
    const own = i < 4;
    const sub = i === 3 ? null : date(i === 6 ? -12 : -i - 1);
    return {
      id: "application-" + i,
      opportunityId: opportunities[i % opportunities.length].id,
      studentId: own ? "alex" : "candidate-" + i,
      studentName: own
        ? "Alex Morgan"
        : ["", "", "", "", "Sam Patel", "Riley Brooks", "Morgan Lee"][i],
      university: own
        ? "York University"
        : [
            "",
            "",
            "",
            "",
            "Toronto Metropolitan University",
            "University of Waterloo",
            "York University",
          ][i],
      program: own
        ? "Computer Engineering · Year 2"
        : i === 4
          ? "Business Management"
          : "Engineering · Year 3",
      resume: own
        ? student.resume
        : "Fictional student resume. Academic projects and relevant coursework; no verified employment claims.",
      stage: stages[i],
      integrity:
        i === 5
          ? "Demo: human review recommended"
          : i === 3
            ? "Not checked"
            : "Demo: no flag",
      submittedAt: sub,
      reviewDue: sub
        ? new Date(
            new Date(sub).getTime() + opportunities[i].reviewDays * 86400000,
          ).toISOString()
        : null,
      reviewedAt: ["Shortlisted", "Invited to Next Stage"].includes(stages[i])
        ? date(-1)
        : null,
      notes:
        i === 5
          ? "Demo reviewer note: ask the student to explain the shared template."
          : "",
      followUp: false,
      clarification: "",
      text: "Demo project explanation: I explored the problem, prepared an example solution, and documented assumptions. Supporting material uses synthetic information.",
      links: ["https://github.com/example/fictional-project"],
      files: [],
      eligibility: {
        academic: true,
        authorization: i !== 6,
        availability: true,
        qualifications: true,
        acknowledgment: true,
      },
      history: [
        {
          stage: stages[i],
          at: sub || date(0),
          message: own
            ? "Fictional application loaded for your demo."
            : "Fictional candidate record.",
        },
      ],
    };
  });
  for (const a of applications) {
    a.studentEmail =
      a.studentId === "alex"
        ? student.email
        : a.studentName.toLowerCase().replace(/\s+/g, ".") + "@example.test";
    a.university = "";
    a.program = "";
    a.resume = "";
  }
  return {
    version: 2,
    user: null,
    profile: { ...student },
    opportunities: opportunities.map(developRole),
    applications,
    saved: [],
  };
}

export function upgradeDemoCatalog(saved: Store, now = new Date()): Store {
  const defaults = seed(now);
  const known = new Set(saved.opportunities.map((o) => o.id));
  return {
    ...saved,
    profile: { ...saved.profile, university: "", program: "", resume: "" },
    user: saved.user
      ? { ...saved.user, university: "", program: "", resume: "" }
      : null,
    opportunities: [
      ...saved.opportunities.map((o) => ({
        ...o,
        challengeDays: o.challengeDays || 7,
        rubric: o.rubric || defaults.opportunities[0].rubric,
      })),
      ...defaults.opportunities.filter((o) => !known.has(o.id)),
    ],
    applications: saved.applications.map((a) => ({
      ...a,
      studentEmail:
        a.studentEmail ||
        (a.studentId === saved.profile.id
          ? saved.profile.email
          : a.studentName.toLowerCase().replace(/\s+/g, ".") + "@example.test"),
      university: "",
      program: "",
      resume: "",
    })),
  };
}
