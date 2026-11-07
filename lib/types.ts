export type Role = "student" | "employer";
export type Stage =
  | "Draft"
  | "Submitted"
  | "Under Employer Review"
  | "Shortlisted"
  | "Invited to Next Stage"
  | "Declined"
  | "Withdrawn";
export type Integrity =
  | "Not checked"
  | "Demo: no flag"
  | "Demo: human review recommended"
  | "Demo: resolved";
export interface Opportunity {
  id: string;
  title: string;
  company: string;
  industry: string;
  majors?: string[];
  tags?: string[];
  location: string;
  arrangement: "Remote" | "Hybrid" | "Onsite";
  type: "Internship" | "Entry-level";
  paid: boolean;
  pay: number;
  duration: number;
  effort: number;
  deadline: string;
  reviewDays: number;
  description: string;
  qualifications: string;
  challenge: string;
  instructions: string;
  deliverables: string[];
  tools: string;
  criteria: string;
  eligibility: string;
  status: "Draft" | "Published";
  owner: string;
  challengeDays?: number;
  resources?: LocalFile[];
  rubric?: { id: string; label: string; weight: number; description: string }[];
  referenceSolution?: string;
  privateEvaluationFiles?: LocalFile[];
  demo: true;
}
export interface LocalFile {
  id: string;
  name: string;
  size: number;
  type: string;
  stored: boolean;
}
export interface Eligibility {
  academic: boolean;
  authorization: boolean;
  availability: boolean;
  qualifications: boolean;
  acknowledgment: boolean;
}
export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  joinedAt?: string;
  backgroundRequest?: {
    status: "requested" | "shared" | "declined";
    message: string;
    requestedAt: string;
    resume?: string;
    resumeFile?: LocalFile;
    education?: string;
    sharedAt?: string;
  };
  university: string;
  program: string;
  resume: string;
  stage: Stage;
  integrity: Integrity;
  submittedAt: string | null;
  reviewDue: string | null;
  reviewedAt: string | null;
  notes: string;
  followUp: boolean;
  clarification: string;
  text: string;
  links: string[];
  files: LocalFile[];
  eligibility: Eligibility;
  history: { stage: Stage; at: string; message: string }[];
}
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  university: string;
  program: string;
  resume: string;
}
export interface Store {
  version: 2;
  user: DemoUser | null;
  opportunities: Opportunity[];
  applications: Application[];
  saved: string[];
  profile: DemoUser;
}
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}
