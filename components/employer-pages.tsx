"use client";
import {roleLanguage} from "../lib/role-language";
import {assertScreeningEdit} from "../lib/screening";
import {ScreeningEditor,ScreeningMetrics,ScreeningFixtures,EmployerScreening,inQueue,queueOptions} from "./screening-controls";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Clock,
  Users,
  Briefcase,
  Check,
  ShieldCheck,
  Flag,
  ExternalLink,
  FileText,
  Save,
  Search,
  ArrowRight,
} from "lucide-react";
import type { Application, Opportunity, Stage } from "../lib/types";
import { useStore } from "./store";
import {
  EmployerShell,
  Heading,
  Badge,
  Status,
  Deadline,
  Modal,
  Empty,
  industries,
} from "./ui";
import { deadlineInfo, validateOpportunity, changeStage } from "../lib/model";
import {
  ChallengeMaterials,
  NextStageReview,
  SubmissionReview,
} from "./hiring-controls";
import { openFile } from "../lib/files";
export function EmployerDashboard({
  onlyOpportunities = false,
}: {
  onlyOpportunities?: boolean;
}) {
  return (
    <EmployerShell>
      <DashboardBody onlyOpportunities={onlyOpportunities} />
    </EmployerShell>
  );
}
function DashboardBody({ onlyOpportunities }: { onlyOpportunities: boolean }) {
  const { state } = useStore();
  const opportunities = state.opportunities.filter(
    (o) => o.owner === state.user?.id,
  );
  const apps = state.applications.filter(
    (a) =>
      opportunities.some((o) => o.id === a.opportunityId) &&
      a.stage !== "Draft",
  );
  const pending = apps.filter((a) =>
    ["Submitted", "Under Employer Review"].includes(a.stage),
  );
  const metrics = [
    [
      "Active opportunities",
      opportunities.filter((o) => o.status === "Published").length,
      Briefcase,
    ],
    ["Total submissions", apps.length, Users],
    ["Pending reviews", pending.length, Clock],
    [
      "Shortlisted",
      apps.filter((a) => a.stage === "Shortlisted").length,
      Check,
    ],
    [
      "Overdue reviews",
      apps.filter((a) => deadlineInfo(a).overdue).length,
      Flag,
    ],
  ] as const;
  return (
    <>
      <Heading
        label="EMPLOYER WORKSPACE · FICTIONAL DEMO"
        title={
          onlyOpportunities
            ? "Opportunities you’ve opened."
            : "Look beyond the resume."
        }
        description="Discover the work. Meet the person behind it."
        action={
          <Link className="button small" href="/employer/post-opportunity">
            <Plus size={16} />
            Post opportunity
          </Link>
        }
      />
      {!onlyOpportunities && (
        <>
          <div className="dashboard-callout roi-dashboard-entry"><div><h3>Employer Screening ROI Simulator</h3><p>Explore an illustrative screening scenario using your own applicant volume, review time and labor cost assumptions.</p></div><Link className="button secondary small" href="/#employer-roi">Estimate time and cost <ArrowUpRight size={16}/></Link></div>
          <ScreeningMetrics applications={apps}/>
          <ScreeningFixtures/>
          <div className="metrics five">
            {metrics.map(([name, n, Icon]) => (
              <article key={name}>
                <div>
                  <span>{name}</span>
                  <Icon size={16} />
                </div>
                <strong>{n}</strong>
              </article>
            ))}
          </div>
          <div className="dashboard-callout">
            <ShieldCheck size={28} />
            <div>
              <h3>Every submission represents someone’s time.</h3>
              <p>
                Keep your review commitments visible. Human reviewers make every
                advancement decision.
              </p>
            </div>
            <Link className="text-link" href="/employer/candidates">
              Open review queue <ArrowRight size={16} />
            </Link>
          </div>
          <div className="section-heading">
            <h2>Recent submissions</h2>
            <Link className="text-link violet" href="/employer/candidates">
              View candidates <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Opportunity</th>
                  <th>Status</th>
                  <th>Review commitment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {apps
                  .slice()
                  .sort((a, b) =>
                    (b.submittedAt || "").localeCompare(a.submittedAt || ""),
                  )
                  .slice(0, 5)
                  .map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.studentName}</strong>
                        <small>{a.studentEmail}</small>
                      </td>
                      <td>
                        {
                          opportunities.find((o) => o.id === a.opportunityId)
                            ?.title
                        }
                      </td>
                      <td>
                        <Status stage={a.stage} />
                      </td>
                      <td>
                        <Deadline application={a} />
                      </td>
                      <td>
                        <Link
                          href={"/employer/candidates?application=" + a.id}
                          className="text-link violet"
                        >
                          Review <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="integrity-banner">
            <Flag size={20} />
            <div>
              <h3>
                {
                  apps.filter(
                    (a) => a.integrity === "Demo: human review recommended",
                  ).length
                }{" "}
                demo integrity flag awaiting attention
              </h3>
              <p>
                A fictional similarity scenario. A flag is a request for review,
                not proof of misconduct.
              </p>
            </div>
            <Link
              className="button secondary small"
              href="/employer/candidates?flags=true"
            >
              Review flags
            </Link>
          </div>
        </>
      )}
      <div className="section-heading">
        <h2>My opportunities</h2>
        <Badge>{opportunities.length} listings</Badge>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Status</th>
              <th>Applications</th>
              <th>Review commitment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((o) => (
              <tr key={o.id}>
                <td>
                  <strong>{o.title}</strong>
                  <small>
                    {o.company} · {o.location}
                  </small>
                </td>
                <td>
                  <Badge
                    tone={o.status === "Published" ? "success" : "neutral"}
                  >
                    {o.status === "Published" ? "Published locally" : "Draft"}
                  </Badge>
                </td>
                <td>{apps.filter((a) => a.opportunityId === o.id).length}</td>
                <td>{o.reviewDays} calendar days</td>
                <td>
                  <div className="table-actions">
                    {o.status === "Published" && (
                      <Link
                        className="text-link violet"
                        href={"/opportunities/" + o.id}
                      >
                        View <ArrowUpRight size={13} />
                      </Link>
                    )}
                    <Link
                      className="text-link"
                      href={"/employer/post-opportunity?edit=" + o.id}
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
const templateBriefs: {
  name: string;
  patch: Partial<Opportunity>;
}[] = [
  {
    name: "AMD (Fictional Demo) — Digital Design / RTL Engineering Intern",
    patch: {
      company: "AMD",
      title: "Digital Design Engineering Intern",
      industry: "Engineering",
      location: "Markham, ON",
      effort: 3,
      description:
        "Fictional Demo — Not affiliated with AMD. Join the fictional RTL Design & Verification team to build and verify synthesizable hardware blocks.",
      responsibilities:
        "Design synthesizable RTL blocks in Verilog/SystemVerilog, write self-checking simulation testbenches, and verify corner cases.",
      dayInTheRole:
        "Digital design engineers develop and verify RTL modules used in larger hardware systems. The synchronous FIFO challenge demonstrates a small, representative slice of that workflow.",
      qualifications:
        "Digital logic, computer architecture, and Verilog/SystemVerilog simulation experience.",
      challenge: "Design and Verify a Synchronous FIFO",
      scenario:
        "Your team is developing a digital data-processing subsystem. You need an 8-bit, 16-entry synchronous FIFO buffer that temporarily stores incoming data before a downstream module reads it.",
      specifications: [
        "8-bit data width, 16-entry depth",
        "Single-clock synchronous operation",
        "Active-high synchronous reset",
        "Read and write enable inputs",
        "Full and empty status outputs",
        "Defined behavior for simultaneous reads and writes",
      ],
      skills: ["RTL Design", "Verilog/SystemVerilog", "Digital Logic", "Verification", "Simulation"],
      instructions:
        "Implement read/write control, full/empty flags, and a self-checking testbench that verifies normal operation and boundary conditions.",
      deliverables: [
        "fifo.sv — RTL implementation",
        "fifo_tb.sv — Simulation testbench",
        "Simulation waveform screenshot",
        "README.md — Architecture, assumptions, and verification results",
      ],
      acceptanceCriteria: [
        "Correct FIFO ordering and full/empty status transitions",
        "Clean synchronous reset and simultaneous read/write handling",
        "Testbench covers normal and edge cases",
      ],
      tools:
        "Verilog or SystemVerilog with Icarus Verilog, Verilator, ModelSim, or Vivado Simulator. Disclose AI assistance.",
    },
  },
  {
    name: "Skyworks Solutions (Fictional Demo) — RF Test Engineering Intern",
    patch: {
      company: "Skyworks Solutions",
      title: "RF Test Engineering Intern",
      industry: "Engineering",
      location: "Ottawa",
      effort: 3,
      description:
        "Fictional Demo — Not affiliated with Skyworks Solutions. Characterize RF amplifier stages and automate S-parameter test data evaluation.",
      responsibilities:
        "Automate RF measurement analysis in Python, evaluate S11/S21/S22 against datasheet limits, and produce characterization reports.",
      dayInTheRole:
        "RF test engineers automate measurements, interpret S-parameters, and identify devices that fail electrical specifications.",
      qualifications:
        "RF fundamentals, S-parameters, Python (NumPy/Matplotlib), and test automation.",
      challenge: "Analyze Simulated RF Amplifier Test Measurements",
      scenario:
        "You receive simulated 2-port S-parameter data (1.8–2.8 GHz) for an RF amplifier stage and must identify return-loss issues, plot gain vs. frequency, and determine pass/fail status.",
      specifications: [
        "Passband: 2.10–2.50 GHz",
        "Minimum forward gain |S21| >= 14.5 dB",
        "Input/output return loss |S11|, |S22| <= -10 dB",
      ],
      skills: ["RF Fundamentals", "S-Parameters", "Python", "Test Automation"],
      instructions:
        "Write a Python script to parse the synthetic S-parameters, plot |S21|, |S11|, and |S22| vs. frequency, and identify specification failures.",
      deliverables: [
        "Python analysis script",
        "Gain and return-loss plots vs. frequency",
        "Concise engineering pass/fail report",
      ],
      acceptanceCriteria: [
        "Accurately flags upper-passband return-loss mismatch",
        "Plots include clear datasheet threshold lines",
      ],
    },
  },
  {
    name: "Satellite Comms (Fictional Demo) — Embedded Software Intern",
    patch: {
      company: "Orbital Link Satellite Communications",
      title: "Embedded Software Intern",
      industry: "Software & AI",
      location: "Toronto",
      effort: 3,
      description:
        "Fictional Demo — Not affiliated with this company. Build flight and ground telemetry parsers for LEO satellite subsystems.",
      responsibilities:
        "Implement binary telemetry decoders in C++ or Python, verify checksums, and write unit tests for corrupted frames.",
      dayInTheRole:
        "Embedded engineers translate hardware interface control documents into deterministic packet parsers and flag anomalous spacecraft telemetry.",
      qualifications:
        "C++ or Python, binary packet parsing, bitwise operations, and unit testing.",
      challenge: "Build a Satellite Telemetry Packet Decoder",
      scenario:
        "Decode simulated satellite downlink packets containing temperature, battery voltage, and orientation data, validate checksums, and flag abnormal readings.",
      specifications: [
        "12-byte fixed binary frames starting with 0xEB90 sync word",
        "Validate 16-bit big-endian checksum",
        "Flag battery < 6.8 V, temperature > 60 °C, or attitude pitch > 45°",
      ],
      skills: ["Embedded C++/Python", "Packet Parsing", "Checksum Validation", "Unit Testing"],
      instructions:
        "Write a telemetry decoder that parses valid packets, rejects corrupted checksums, and flags out-of-range sensor readings.",
      deliverables: [
        "Python or C++ telemetry decoder code",
        "Unit tests and sample decoded outputs",
        "Short test report",
      ],
      acceptanceCriteria: [
        "Decodes engineering units accurately",
        "Gracefully rejects corrupted frames",
      ],
    },
  },
];
export function PostOpportunity({ editId }: { editId?: string }) {
  return (
    <EmployerShell>
      <PostBody key={editId || "new"} editId={editId} />
    </EmployerShell>
  );
}
function PostBody({ editId }: { editId?: string }) {
  const { state, setState, notify } = useStore();
  const existing = state.opportunities.find(
    (o) => o.id === editId && o.owner === state.user?.id,
  );
  const [o, setO] = useState<Opportunity>(
    () =>
      existing || {
        id: "",
        title: "",
        company: "",
        industry: "Software & AI",
        location: "Toronto",
        arrangement: "Hybrid",
        type: "Internship",
        paid: true,
        pay: 25,
        duration: 4,
        effort: 2,
        deadline: new Date(Date.now() + 30 * 86400000)
          .toISOString()
          .slice(0, 10),
        reviewDays: 7,
        challengeDays: 7,
        resources: [],
        referenceSolution: "",
        privateEvaluationFiles: [],
        rubric: [
          {
            id: "reasoning",
            label: "Reasoning",
            weight: 40,
            description: "Explain approach and assumptions.",
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
        ],
        description: "",
        responsibilities: "",
        dayInTheRole: "",
        qualifications: "",
        challenge: "",
        scenario: "",
        specifications: [
          "Scoped to a maximum of 3 hours using synthetic materials",
          "Clear boundary conditions and verification expectations",
        ],
        skills: ["Problem Solving", "Clear Communication"],
        starterMaterials: [],
        acceptanceCriteria: [
          "Meets the stated role-specific requirements",
          "Includes clear verification evidence and documentation",
        ],
        instructions: "",
        deliverables: [
          "Project work (file, link, or pasted content)",
          "Short explanation of your approach",
        ],
        tools:
          "AI assistance is permitted if disclosed. Use synthetic data and be ready to explain your work.",
        criteria:
          "Human reviewers consider relevance, reasoning, clarity, and limitations. No automated candidate score.",
        eligibility:
          "Current student or recent graduate; self-declared work authorization; available during the stated term.",
        status: "Draft",
        owner: "employer-demo",
        demo: true,
      },
  );
  const language=roleLanguage(o);
  const editorTemplates=[...templateBriefs,...Array.from(new Set(state.opportunities.map(item=>item.industry))).filter(field=>field!=="Engineering").map(field=>{
    const example=state.opportunities.find(item=>item.industry===field&&item.status==="Published")!;
    const patch:Partial<Opportunity>={title:example.title,company:example.company,industry:example.industry,description:example.description,responsibilities:example.responsibilities,dayInTheRole:example.dayInTheRole,qualifications:example.qualifications,challenge:example.challenge,scenario:example.scenario,specifications:example.specifications,skills:example.skills,starterMaterials:example.starterMaterials,acceptanceCriteria:example.acceptanceCriteria,instructions:example.instructions,deliverables:example.deliverables,tools:example.tools,criteria:example.criteria,rubric:example.rubric,effort:Math.min(3,example.effort)};
    return {name:`${field} — ${example.title}`,patch};
  })];
  const [errors, setErrors] = useState<Record<string, string>>({}),
    [success, setSuccess] = useState(""),
    [preview, setPreview] = useState(false);
  function update<K extends keyof Opportunity>(k: K, v: Opportunity[K]) {
    setO((o) => ({ ...o, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }
  function save(publish: boolean) {
    const e = publish
      ? validateOpportunity(o)
      : o.title.trim()
        ? {}
        : { title: "Give your draft a title." };
    setErrors(e);
    if (Object.keys(e).length) {
      notify("Review the highlighted fields before publishing.");
      return;
    }
    const record = {
      ...o,
      id: o.id || crypto.randomUUID(),
      owner: state.user!.id,
      status: publish ? ("Published" as const) : ("Draft" as const),
    };
    try { assertScreeningEdit(state,record); } catch(error) { setErrors({screeningPolicy:(error as Error).message});notify((error as Error).message);return; }
    setState((s) => ({
      ...s,
      opportunities: s.opportunities.some((x) => x.id === record.id)
        ? s.opportunities.map((x) => (x.id === record.id ? record : x))
        : [...s.opportunities, record],
    }));
    setO(record);
    setSuccess(publish ? "published" : "draft");
    notify(
      publish
        ? "Opportunity published to the local demo marketplace."
        : "Opportunity draft saved locally.",
    );
  }
  function input(k: keyof Opportunity, label: string, type = "text") {
    return (
      <label>
        {label}
        <input
          type={type}
          value={String(o[k])}
          min={type === "number" ? (k === "effort" ? 0.5 : 0) : undefined}
          max={k === "effort" ? 3 : undefined}
          step={k === "effort" ? 0.5 : undefined}
          aria-invalid={!!errors[k]}
          aria-describedby={errors[k] ? "error-" + k : undefined}
          onChange={(e) =>
            update(
              k,
              (type === "number"
                ? Number(e.target.value)
                : e.target.value) as never,
            )
          }
        />
        {errors[k] && (
          <span id={"error-" + k} className="form-error">
            {errors[k]}
          </span>
        )}
      </label>
    );
  }
  function area(k: keyof Opportunity, label: string) {
    return (
      <label>
        {label}
        <textarea
          rows={4}
          value={String(o[k])}
          aria-invalid={!!errors[k]}
          onChange={(e) => update(k, e.target.value as never)}
        />
        {errors[k] && <span className="form-error">{errors[k]}</span>}
      </label>
    );
  }
  return (
    <>
      <Heading
        label="POST AN OPPORTUNITY"
        title={
          existing ? "Make the brief clearer." : "Open a door for someone."
        }
        description="A focused challenge. Clear expectations. A commitment to review."
      />
      <div className="notice">
        Demo editor. Publish adds a fictional listing in this browser only.
        Existing applications retain their original review deadlines.
      </div>
      <div className="post-grid">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(true);
          }}
          noValidate
        >
          <section className="panel">
            <p className="eyebrow">01 · THE OPPORTUNITY</p>
            <h2>Start with the role.</h2>
            <div className="form-grid">
              {input("company", "Fictional company name")}
              {input("title", "Job title")}
            </div>
            {area("description", "Role overview")}
            {area(
              "responsibilities",
              "Job responsibilities (what this position actually performs)",
            )}
            {area(
              "dayInTheRole",
              "A day in the role (how this task relates to everyday work)",
            )}
            <div className="form-grid">
              <label>
                Industry
                <select
                  value={o.industry}
                  onChange={(e) => update("industry", e.target.value)}
                >
                  {industries.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {input("location", "Location")}
              <label>
                Job type
                <select
                  value={o.type}
                  onChange={(e) =>
                    update("type", e.target.value as Opportunity["type"])
                  }
                >
                  <option>Internship</option>
                  <option>Entry-level</option>
                </select>
              </label>
              <label>
                Work arrangement
                <select
                  value={o.arrangement}
                  onChange={(e) =>
                    update(
                      "arrangement",
                      e.target.value as Opportunity["arrangement"],
                    )
                  }
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>Onsite</option>
                </select>
              </label>
              {input("duration", "Duration (months)", "number")}
              <label>
                Compensation
                <select
                  value={o.paid ? "paid" : "unpaid"}
                  onChange={(e) => update("paid", e.target.value === "paid")}
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </label>
              {o.paid && input("pay", "Hourly pay (CAD)", "number")}
              {input("deadline", "Application deadline", "date")}
            </div>
            {area("qualifications", "Required qualifications")}
            {area("eligibility", "Eligibility requirements (self-reported)")}
          </section>
          <section className="panel">
            <p className="eyebrow">02 · EMPLOYER CHALLENGE CREATOR</p>
            <h2>{language.challenge}</h2>
            <p className="fine-print">
              Core FirstProof rule: every challenge must directly correspond to
              the actual responsibilities of the role. Do not assign generic
              chatbots or unrelated puzzles.
            </p>
            <label>
              Load a role-specific starting brief
              <select
                defaultValue=""
                onChange={(e) => {
                  const t = editorTemplates.find(
                    (t) => t.name === e.target.value,
                  );
                  if (t) {
                    setO((curr) => ({ ...curr, ...t.patch }));
                  }
                }}
              >
                <option value="" disabled>
                  Choose an optional role-specific template
                </option>
                {editorTemplates.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            {input("challenge", "Work-sample title")}
            {area(
              "scenario",
              language.scenario,
            )}
            {area("instructions", "Detailed challenge instructions")}
            <label>
              {language.requirements} (one per line)
              <textarea
                rows={4}
                value={(o.specifications || []).join("\n")}
                onChange={(e) =>
                  update(
                    "specifications",
                    e.target.value.split("\n").filter((x) => x.trim()),
                  )
                }
              />
            </label>
            <label>
              Relevant skills and tools (comma-separated)
              <input
                type="text"
                value={(o.skills || []).join(", ")}
                onChange={(e) =>
                  update(
                    "skills",
                    e.target.value
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>
            {input(
              "effort",
              "Maximum work time (0.5–3 hours, including setup)",
              "number",
            )}
            <label>
              Required deliverables (one per line)
              <textarea
                rows={3}
                value={o.deliverables.join("\n")}
                onChange={(e) =>
                  update("deliverables", e.target.value.split("\n"))
                }
              />
              {errors.deliverables && (
                <span className="form-error">{errors.deliverables}</span>
              )}
            </label>
            <label>
              Acceptance criteria (one per line)
              <textarea
                rows={3}
                value={(o.acceptanceCriteria || []).join("\n")}
                onChange={(e) =>
                  update(
                    "acceptanceCriteria",
                    e.target.value.split("\n").filter((x) => x.trim()),
                  )
                }
              />
            </label>
            {area("criteria", "Published manual review rubric summary")}
            {area("tools", "Permitted tools and AI assistance policy")}
            {input(
              "challengeDays",
              "Time to complete after joining (days)",
              "number",
            )}
            <ChallengeMaterials
              opportunity={o}
              onChange={(patch) =>
                setO((current) => ({ ...current, ...patch }))
              }
            />
            <ScreeningEditor opportunity={o} locked={state.applications.some(a=>a.opportunityId===o.id)} onChange={patch=>setO(current=>({...current,...patch}))}/>
            {errors.screeningPolicy&&<p role="alert" className="form-error">{errors.screeningPolicy}</p>}
            {errors.rubric && (
              <p className="form-error" role="alert">
                {errors.rubric}
              </p>
            )}
          </section>
          <section className="panel">
            <p className="eyebrow">03 · YOUR REVIEW COMMITMENT</p>
            <h2>Make their effort count.</h2>
            <p>
              Commit to a human review of eligible, complete submissions. This
              is not a promise of an interview or offer.
            </p>
            {input(
              "reviewDays",
              "Review within (1–30 calendar days)",
              "number",
            )}
            <div className="commitment">
              <ShieldCheck size={22} />
              <p>
                We commit to reviewing eligible, complete submissions within{" "}
                <strong>{o.reviewDays} calendar days</strong> of submission.
              </p>
            </div>
            <div className="form-footer">
              <button
                className="button secondary"
                type="button"
                onClick={() => save(false)}
              >
                <Save size={16} />
                Save draft
              </button>
              <button
                className="button secondary"
                type="button"
                onClick={() => setPreview(true)}
              >
                Preview
              </button>
              <button className="button" type="submit">
                Publish demo opportunity <ArrowUpRight size={16} />
              </button>
            </div>
          </section>
        </form>
        <aside className="post-preview">
          <div className="panel sticky">
            <Badge tone="violet">LIVE PREVIEW · DEMO</Badge>
            <h2>{o.title || "Your opportunity title"}</h2>
            <p>{o.company || "Your fictional company"}</p>
            <div className="meta">
              <span>{o.location}</span>
              <span>{o.arrangement}</span>
            </div>
            <hr />
            <h3>{o.challenge || "Your practical challenge"}</h3>
            <p>
              {o.instructions ||
                "A short challenge that lets students show their approach."}
            </p>
            <dl>
              <div>
                <dt>Compensation</dt>
                <dd>{o.paid ? `$${o.pay}/hr CAD` : "Unpaid"}</dd>
              </div>
              <div>
                <dt>Project effort</dt>
                <dd>{o.effort} hours</dd>
              </div>
              <div>
                <dt>Review within</dt>
                <dd>{o.reviewDays} days</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
      {success && (
        <Modal
          title={
            success === "published"
              ? "Published in your local demo."
              : "Draft saved locally."
          }
          onClose={() => setSuccess("")}
        >
          <p>
            {success === "published"
              ? "Your fictional opportunity now appears in the marketplace and employer dashboard. No real recruitment campaign was launched."
              : "You can return to this draft from My Opportunities."}
          </p>
          <div className="modal-actions">
            <Link className="button secondary" href="/employer/opportunities">
              My opportunities
            </Link>
            {success === "published" && (
              <Link className="button" href={"/opportunities/" + o.id}>
                View opportunity <ArrowUpRight size={15} />
              </Link>
            )}
          </div>
        </Modal>
      )}
      {preview && (
        <Modal title="Opportunity preview" onClose={() => setPreview(false)}>
          <Badge>FICTIONAL DEMO</Badge>
          <h2>{o.title || "Untitled opportunity"}</h2>
          <p>{o.description}</p>
          <h3>{o.challenge}</h3>
          <p>{o.instructions}</p>
          <h3>Required deliverables</h3>
          <ul>
            {o.deliverables.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <p>Review commitment: {o.reviewDays} calendar days.</p>
        </Modal>
      )}
    </>
  );
}
export function Candidates({
  applicationId,
  flagsOnly = false,
}: {
  applicationId?: string;
  flagsOnly?: boolean;
}) {
  return (
    <EmployerShell>
      <CandidateBody applicationId={applicationId} flagsOnly={flagsOnly} />
    </EmployerShell>
  );
}
function CandidateBody({
  applicationId,
  flagsOnly,
}: {
  applicationId?: string;
  flagsOnly: boolean;
}) {
  const { state, setState, notify } = useStore();
  const all = state.applications.filter(
    (a) =>
      a.stage !== "Draft" &&
      state.opportunities.some(
        (o) => o.id === a.opportunityId && o.owner === state.user?.id,
      ),
  );
  const [selected, setSelected] = useState(applicationId || all[0]?.id || ""),
    [query, setQuery] = useState(""),
    [flags, setFlags] = useState(flagsOnly),
    [status, setStatus] = useState(""),
    [screeningQueue,setScreeningQueue]=useState("All submissions"),
    [confirm, setConfirm] = useState<Stage | null>(null),
    [clarify, setClarify] = useState(false),
    [message, setMessage] = useState(""),
    [fileError, setFileError] = useState("");
  const filtered = all.filter(
    (a) =>
      (!query ||
        `${a.studentName} ${a.studentEmail} ${state.opportunities.find((o) => o.id === a.opportunityId)?.title}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!flags || a.integrity === "Demo: human review recommended") &&
      (!status || a.stage === status) && inQueue(a,screeningQueue),
  );
  const a = filtered.find((a) => a.id === selected) || filtered[0];
  const o = state.opportunities.find((o) => o.id === a?.opportunityId);
  function patch(p: Partial<Application>) {
    if (!a) return;
    setState((s) => ({
      ...s,
      applications: s.applications.map((x) =>
        x.id === a.id ? { ...x, ...p } : x,
      ),
    }));
  }
  function decide(stage: Stage) {
    if (!a) return;
    try {
      setState(changeStage(state, a.id, stage));
      notify("Demo decision saved. The student tracker is updated.");
      setConfirm(null);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not update status.");
    }
  }
  return (
    <>
      <Heading
        label="CANDIDATE REVIEW"
        title="Meet the work. Then the person."
        description="Human decisions, supported by the work students choose to share."
      />
      <ScreeningMetrics applications={all}/>
      <ScreeningFixtures/>
      <label>Screening queue<select value={screeningQueue} onChange={e=>setScreeningQueue(e.target.value)}>{queueOptions.map(q=><option key={q}>{q}</option>)}</select></label>
      <div className="candidate-toolbar">
        <div className="input-icon">
          <Search size={16} />
          <input
            aria-label="Search candidates"
            placeholder="Search candidate or opportunity"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter candidate status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {[
            "Submitted",
            "Under Employer Review",
            "Shortlisted",
            "Invited to Next Stage",
            "Declined",
            "Withdrawn",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={flags}
            onChange={(e) => setFlags(e.target.checked)}
          />
          Integrity flags
        </label>
      </div>
      <div className="candidate-layout">
        <aside className="candidate-list">
          {filtered.map((c) => (
            <button
              className={a?.id === c.id ? "active" : ""}
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                setFileError("");
              }}
            >
              <div className="avatar">
                {c.studentName
                  .split(" ")
                  .map((s) => s[0])
                  .join("")}
              </div>
              <div>
                <strong>{c.studentName}</strong>
                <p>
                  {
                    state.opportunities.find((o) => o.id === c.opportunityId)
                      ?.title
                  }
                </p>
                <small>{c.studentEmail}</small>
                <div>
                  <Status stage={c.stage} />
                  {c.integrity === "Demo: human review recommended" && (
                    <Flag size={13} />
                  )}
                </div>
                <small>
                  {c.submittedAt
                    ? new Date(c.submittedAt).toLocaleDateString()
                    : ""}
                </small>
              </div>
            </button>
          ))}
          {!filtered.length && (
            <Empty title="Queue clear." description="Try another filter." />
          )}
        </aside>
        {a && o ? (
          <div className="candidate-detail">
            <section className="panel">
              <div className="candidate-head">
                <div className="avatar big">
                  {a.studentName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div>
                  <Badge>APPLICANT</Badge>
                  <h2>{a.studentName}</h2>
                  <p>{a.studentEmail || "Email not supplied"}</p>
                </div>
                <Status stage={a.stage} />
              </div>
              <h3>{o.title}</h3>
              <Deadline application={a} />
              <p className="fine-print">
                Review due:{" "}
                {a.reviewDue
                  ? new Date(a.reviewDue).toLocaleString()
                  : "Not started"}
                . Review commitment is not an interview guarantee.
              </p>
              <div className="notice">
                First-stage review includes name, email, and project work only.
                Resumes, school, GPA, and employment history are not collected
                here.
              </div>
              <NextStageReview application={a} />
            </section>
            <section className="panel">
              <h2>Submitted work</h2>
              <p className="pre-wrap">{a.text}</p>
              {a.links.map((url, i) => (
                <a
                  className="deliverable-link"
                  href={url}
                  key={i}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={16} />
                  Work-sample link {i + 1}
                  <span>{url}</span>
                </a>
              ))}
              {a.files.map((f) => (
                <button
                  key={f.id}
                  className="deliverable-link"
                  onClick={() =>
                    openFile(f.id, f.name).catch((e) => setFileError(e.message))
                  }
                >
                  <FileText size={16} />
                  {f.name}
                  <small>Download local demo file</small>
                </button>
              ))}
              {fileError && (
                <p role="alert" className="form-error">
                  {fileError}
                </p>
              )}
              <p className="fine-print">
                Files are stored locally in this demo. Links are not
                automatically fetched, scanned, or executed.
              </p>
            </section>
            <section className="panel">
              <h2>
                <ShieldCheck size={20} />
                Integrity review
              </h2>
              <Badge
                tone={
                  a.integrity === "Demo: human review recommended"
                    ? "warning"
                    : "neutral"
                }
              >
                {a.integrity}
              </Badge>
              <p>
                {a.integrity === "Demo: human review recommended"
                  ? "Similarity flag raised — human review recommended. This seeded demo scenario represents two submissions using a similar template. No actual similarity analysis ran. Similarity is not proof of misconduct."
                  : a.integrity === "Not checked"
                    ? "No similarity service has run for this submission. No conclusion about originality can be drawn."
                    : "This is a pre-seeded demo scenario, not an analysis result."}
              </p>
              {a.integrity === "Demo: human review recommended" && (
                <button
                  className="button secondary small"
                  onClick={() => {
                    patch({ integrity: "Demo: resolved" });
                    notify(
                      "Demo integrity review marked resolved. Hiring status unchanged.",
                    );
                  }}
                >
                  Mark concern reviewed
                </button>
              )}
            </section>
            <section className="panel">
              <SubmissionReview application={a} opportunity={o} />
              <EmployerScreening key={a.id} application={a}/>
              <h2>Employer actions</h2>
              <p className="fine-print">
                Your actions update the shared local demo. No real candidate is
                contacted.
              </p>
              <div className="decision-buttons">
                {(
                  [
                    "Under Employer Review",
                    "Shortlisted",
                    "Invited to Next Stage",
                    "Declined",
                  ] as Stage[]
                ).map((s) => (
                  <button
                    key={s}
                    disabled={a.stage === "Withdrawn" || a.stage === s}
                    className={
                      "button " +
                      (s === "Declined"
                        ? "danger"
                        : s === "Shortlisted"
                          ? ""
                          : "secondary")
                    }
                    onClick={() =>
                      s === "Declined" ? setConfirm(s) : decide(s)
                    }
                  >
                    {s === "Under Employer Review"
                      ? "Mark under review"
                      : s === "Shortlisted"
                        ? "Shortlist candidate"
                        : s === "Declined"
                          ? "Decline candidate"
                          : "Invite to next stage"}
                  </button>
                ))}
                <button
                  className="button secondary"
                  onClick={() => {
                    patch({ followUp: !a.followUp });
                    notify(
                      a.followUp
                        ? "Follow-up removed."
                        : "Marked for follow-up.",
                    );
                  }}
                >
                  <Flag size={15} />
                  {a.followUp ? "Follow-up marked" : "Mark for follow-up"}
                </button>
                <button
                  className="button secondary"
                  disabled={a.stage === "Withdrawn"}
                  onClick={() => {
                    setMessage(a.clarification);
                    setClarify(true);
                  }}
                >
                  Request clarification
                </button>
              </div>
              <label>
                Private employer notes
                <textarea
                  rows={4}
                  value={a.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                />
              </label>
              <button
                className="button secondary small"
                onClick={() =>
                  notify(
                    "Private note saved in the local demo. It is excluded from the student interface.",
                  )
                }
              >
                <Save size={14} />
                Save private note
              </button>
              <p className="fine-print">
                Demo notes share browser storage with the demo records. Real
                privacy requires server authorization.
              </p>
            </section>
          </div>
        ) : (
          <Empty
            title="No candidate selected."
            description="Choose an application in the review queue."
          />
        )}
      </div>
      {confirm && (
        <Modal
          title="Decline this demo application?"
          onClose={() => setConfirm(null)}
        >
          <p>
            This human decision will appear in the fictional student tracker.
            Similarity flags do not trigger it automatically.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setConfirm(null)}
            >
              Cancel
            </button>
            <button className="button danger" onClick={() => decide(confirm)}>
              Confirm decline
            </button>
          </div>
        </Modal>
      )}
      {clarify && (
        <Modal title="Request clarification" onClose={() => setClarify(false)}>
          <label>
            Message visible to the demo student
            <textarea
              rows={5}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a neutral, specific question about their work."
            />
          </label>
          <p className="fine-print">
            Saved to the local tracker only. No email or notification is sent
            externally.
          </p>
          <button
            className="button"
            disabled={!message.trim()}
            onClick={() => {
              patch({ clarification: message });
              setClarify(false);
              notify(
                "Clarification request added to the demo student tracker.",
              );
            }}
          >
            Save demo request
          </button>
        </Modal>
      )}
    </>
  );
}
export function EmployerSettings() {
  const { state, setState, notify } = useStore();
  return (
    <EmployerShell>
      <Heading label="EMPLOYER SETTINGS" title="Your demo workspace." />
      <section className="panel">
        <h2>Account</h2>
        <p>
          {state.user?.name} · {state.user?.email}
        </p>
        <p>
          Fictional hiring team. This account has not been verified as a real
          employer.
        </p>
        <h3>Data and privacy</h3>
        <p>
          The prototype saves demo data in your browser. There is no secure
          authentication, employer verification, private cloud storage, or live
          similarity service connected.
        </p>
        <button
          className="button secondary"
          onClick={() => {
            setState((s) => ({ ...s, user: null }));
            notify("Signed out of demo workspace.");
          }}
        >
          Sign out of demo
        </button>
      </section>
    </EmployerShell>
  );
}
