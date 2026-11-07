"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  ExternalLink,
  FileText,
  Clock,
  Save,
  User,
  Briefcase,
} from "lucide-react";
import { useStore } from "./store";
import {
  Heading,
  Gate,
  Badge,
  Status,
  Deadline,
  Empty,
  Loading,
  Modal,
} from "./ui";
import { emptyEligibility } from "../lib/demo";
import type { Application, Role, Stage } from "../lib/types";
import { submitApplication, studentView } from "../lib/model";
import { saveFile, fileError } from "../lib/files";
import { dataMode, api, contracts } from "../lib/api";
function safeLink(value: string) {
  try {
    const u = new URL(value);
    return (
      ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
    );
  } catch {
    return false;
  }
}
export function Workspace({ id }: { id: string }) {
  return (
    <Gate role="student">
      <WorkspaceBody id={id} />
    </Gate>
  );
}
function WorkspaceBody({ id }: { id: string }) {
  const { state, setState, notify } = useStore();
  const router = useRouter();
  const o = state.opportunities.find((o) => o.id === id);
  const a = state.applications.find(
    (a) => a.opportunityId === id && a.studentId === state.user?.id,
  );
  const [step, setStep] = useState(0),
    [link, setLink] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [confirm, setConfirm] = useState(false),
    [savedAt, setSavedAt] = useState("");
  useEffect(() => {
    if (o && !a && state.user) {
      const now = new Date().toISOString();
      const draft: Application = {
        id: crypto.randomUUID(),
        opportunityId: id,
        studentId: state.user.id,
        studentName: state.profile.name,
        university: state.profile.university,
        program: state.profile.program,
        resume: state.profile.resume,
        stage: "Draft",
        integrity: "Not checked",
        submittedAt: null,
        reviewDue: null,
        reviewedAt: null,
        notes: "",
        followUp: false,
        clarification: "",
        text: "",
        links: [],
        files: [],
        eligibility: { ...emptyEligibility },
        history: [
          {
            stage: "Draft",
            at: now,
            message: "Draft created locally. Review clock has not started.",
          },
        ],
      };
      setState((s) =>
        s.applications.some(
          (x) => x.opportunityId === id && x.studentId === s.user?.id,
        )
          ? s
          : { ...s, applications: [...s.applications, draft] },
      );
    }
  }, [id, o, a, state.user, state.profile, setState]);
  if (!o)
    return (
      <div className="container">
        <Empty
          title="Challenge unavailable"
          description="Choose an opportunity from the marketplace."
        >
          <Link href="/marketplace" className="button">
            Browse opportunities
          </Link>
        </Empty>
      </div>
    );
  if (!a) return <Loading />;
  const app = a;
  const opportunity = o;
  function update(patch: Partial<Application>) {
    setState((s) => ({
      ...s,
      applications: s.applications.map((x) =>
        x.id === app.id ? { ...x, ...patch } : x,
      ),
    }));
  }
  const complete = Object.values(a.eligibility).filter(Boolean).length;
  async function files(list: FileList | null) {
    if (!list) return;
    setError("");
    setBusy(true);
    const added = [];
    try {
      if (a!.files.length + list.length > 8)
        throw new Error("Use at most 8 files per application.");
      for (const file of Array.from(list)) {
        const error = fileError(file);
        if (error) throw new Error(file.name + ": " + error);
        const id = crypto.randomUUID();
        await saveFile(id, file);
        added.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          stored: true,
        });
      }
      update({ files: [...app.files, ...added] });
      notify("Files saved in this browser only. Nothing uploaded to a server.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save the selected files.",
      );
    } finally {
      setBusy(false);
    }
  }
  function submit() {
    try {
      setState(submitApplication(state, app.id));
      setConfirm(false);
      router.push("/tracker?submitted=" + app.id);
      notify(
        "Application submitted in the local demo. No employer was contacted.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
      setConfirm(false);
    }
  }
  if (a.stage !== "Draft")
    return (
      <div className="container">
        <Empty
          title="Your work is already in the review queue."
          description="This application is saved in your local demo tracker. It has not been sent to a real employer."
        >
          <Link className="button" href="/tracker">
            View application tracker <ArrowRight size={16} />
          </Link>
        </Empty>
      </div>
    );
  return (
    <div className="container workspace">
      <Link className="text-link muted" href={"/opportunities/" + id}>
        <ArrowLeft size={14} />
        Back to challenge
      </Link>
      <Heading
        label="STUDENT WORKSPACE"
        title={o.challenge}
        description={`${o.title} · ${o.company} (fictional)`}
        action={
          <button
            className="button secondary"
            onClick={() => {
              setSavedAt(new Date().toLocaleTimeString());
              notify("Draft saved locally. The review clock has not started.");
            }}
          >
            <Save size={16} />
            Save draft
          </button>
        }
      />
      <div className="notice">
        <ShieldCheck size={18} />
        <span>
          Local demo workspace. Use fictional content only. Files are saved in
          browser storage, not securely uploaded.
        </span>
      </div>
      <div className="stepper">
        {[
          "Review challenge",
          "Prepare deliverables",
          "Confirm eligibility",
          "Submit",
        ].map((s, i) => (
          <button
            key={s}
            className={step === i ? "active" : step > i ? "complete" : ""}
            onClick={() => setStep(i)}
          >
            <span>{step > i ? <Check size={14} /> : i + 1}</span>
            {s}
          </button>
        ))}
      </div>
      <div className="workspace-grid">
        <section className="panel">
          {step === 0 ? (
            <>
              <p className="eyebrow">A BRIEF WORTH READING</p>
              <h2>{o.challenge}</h2>
              <p>{o.instructions}</p>
              <h3>Deliverables checklist</h3>
              {o.deliverables.map((d) => (
                <div className="check-line" key={d}>
                  <Check size={16} />
                  {d}
                </div>
              ))}
              <h3>Tools & assistance</h3>
              <p>{o.tools}</p>
              <h3>Review criteria</h3>
              <p>{o.criteria}</p>
              <div className="inline-callout">
                <Clock size={18} />
                Budget around {o.effort} hours. Human review within{" "}
                {o.reviewDays} calendar days after complete submission.
              </div>
            </>
          ) : step === 1 ? (
            <>
              <p className="eyebrow">MAKE YOUR WORK TANGIBLE</p>
              <h2>Prepare your deliverables.</h2>
              <label className="upload-box">
                <Upload size={26} />
                <strong>
                  {busy
                    ? "Saving files locally…"
                    : "Choose files to save locally"}
                </strong>
                <span>
                  Documents, presentations, spreadsheets, images, code, ZIP · up
                  to 10 MB each · 8 files maximum
                </span>
                <input
                  aria-label="Choose deliverable files"
                  type="file"
                  multiple
                  disabled={busy}
                  onChange={(e) => {
                    void files(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
              {busy && <progress aria-label="Saving selected files" />}
              {a.files.map((f) => (
                <div className="file-row" key={f.id}>
                  <FileText size={16} />
                  <span>
                    {f.name}
                    <small>{Math.ceil(f.size / 1024)} KB · Saved locally</small>
                  </span>
                  <button
                    className="icon-button"
                    aria-label={"Remove " + f.name}
                    onClick={() =>
                      update({ files: a.files.filter((x) => x.id !== f.id) })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <label>
                Project links
                <div className="input-action">
                  <input
                    placeholder="https://github.com/your-project"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                  <button
                    className="button secondary"
                    aria-label="Add project link"
                    onClick={() => {
                      if (!safeLink(link)) {
                        setError(
                          "Enter a complete http or https link without embedded credentials.",
                        );
                        return;
                      }
                      if (a.links.length >= 10) {
                        setError("Use at most 10 project links.");
                        return;
                      }
                      update({ links: [...a.links, link] });
                      setLink("");
                      setError("");
                    }}
                  >
                    <Plus size={17} />
                  </button>
                </div>
              </label>
              {a.links.map((url, i) => (
                <div className="file-row" key={i}>
                  <ExternalLink size={16} />
                  <a href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                  <button
                    className="icon-button"
                    aria-label={"Remove link " + (i + 1)}
                    onClick={() =>
                      update({ links: a.links.filter((_, j) => j !== i) })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <label>
                Project content and explanation
                <textarea
                  rows={8}
                  maxLength={20000}
                  placeholder="Paste your work or explain your approach. Describe any outside tools or AI assistance."
                  value={a.text}
                  onChange={(e) => update({ text: e.target.value })}
                />
              </label>
              <p className="fine-print">
                At least 30 characters of explanation. For a text-only project,
                include at least 80 characters. Linked content is not fetched or
                analyzed.
              </p>
              <label>
                Résumé text (fictional demo only)
                <textarea
                  rows={4}
                  value={a.resume}
                  maxLength={10000}
                  onChange={(e) => update({ resume: e.target.value })}
                />
              </label>
            </>
          ) : step === 2 ? (
            <>
              <p className="eyebrow">YOUR DECLARATIONS</p>
              <h2>Confirm the basics.</h2>
              <p>{o.eligibility}</p>
              <div className="notice">
                These answers are self-reported. FirstProof has not verified
                your identity, work authorization, or qualifications.
              </div>
              {Object.entries({
                academic: "I meet the published academic requirements.",
                authorization:
                  "I declare that I have permission to work in the stated location.",
                availability:
                  "I am available during the stated employment term.",
                qualifications:
                  "I have reviewed and meet the listed required qualifications.",
                acknowledgment:
                  "I understand the demo terms, have permission to submit this work, and have disclosed any assistance.",
              }).map(([key, label]) => (
                <label className="declaration" key={key}>
                  <input
                    type="checkbox"
                    checked={a.eligibility[key as keyof typeof a.eligibility]}
                    onChange={(e) =>
                      update({
                        eligibility: {
                          ...a.eligibility,
                          [key]: e.target.checked,
                        },
                      })
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
              <p className="fine-print">
                If you are unsure, leave the declaration unchecked and keep your
                application as a draft. This demo does not automatically reject
                you.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow">ONE LAST LOOK</p>
              <h2>Ready to show your work?</h2>
              <dl>
                <div>
                  <dt>Opportunity</dt>
                  <dd>{o.title}</dd>
                </div>
                <div>
                  <dt>Files saved locally</dt>
                  <dd>{a.files.length}</dd>
                </div>
                <div>
                  <dt>Project links</dt>
                  <dd>{a.links.length}</dd>
                </div>
                <div>
                  <dt>Explanation</dt>
                  <dd>{a.text.length} characters</dd>
                </div>
                <div>
                  <dt>Declarations</dt>
                  <dd>{complete}/5</dd>
                </div>
                <div>
                  <dt>Review commitment</dt>
                  <dd>{o.reviewDays} calendar days</dd>
                </div>
              </dl>
              <div className="notice">
                Submitting creates a local demo application. No real employer
                receives your files. Similarity status remains “Not checked”
                because no analysis service is connected.
              </div>
              <button
                className="button full"
                disabled={busy}
                onClick={() => setConfirm(true)}
              >
                Submit demo application <ArrowUpRightIcon />
              </button>
            </>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="form-footer">
            {step > 0 && (
              <button
                className="button secondary"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={15} />
                Back
              </button>
            )}
            {step < 3 && (
              <button className="button" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight size={15} />
              </button>
            )}
            {savedAt && <small>Saved at {savedAt}</small>}
          </div>
        </section>
        <aside>
          <div className="panel sticky">
            <Badge tone="violet">DRAFT · LOCAL DEMO</Badge>
            <h3>{o.title}</h3>
            <p>{o.company}</p>
            <div className="summary-line">
              <Check size={15} />
              {a.files.length} files · {a.links.length} links
            </div>
            <div className="summary-line">
              <Check size={15} />
              {complete}/5 declarations
            </div>
            <div className="summary-line">
              <Clock size={15} />
              Apply by {o.deadline}
            </div>
            <hr />
            <h3>Your review clock hasn’t started.</h3>
            <p className="fine-print">
              Save your draft and return anytime on this browser. The{" "}
              {opportunity.reviewDays}-day commitment starts only after final
              submission.
            </p>
          </div>
        </aside>
      </div>
      {confirm && (
        <Modal
          title="Submit this demo application?"
          onClose={() => setConfirm(false)}
        >
          <p>
            Your application will be saved locally and become visible in the
            fictional employer view. The review deadline starts now.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Keep editing
            </button>
            <button className="button" onClick={submit}>
              Confirm demo submission
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={16} />;
}
export function Tracker() {
  return (
    <Gate role="student">
      <TrackerBody />
    </Gate>
  );
}
function TrackerBody() {
  const { state, setState, notify } = useStore();
  const params = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null),
    [filter, setFilter] = useState("All"),
    [withdraw, setWithdraw] = useState<string | null>(null);
  const apps = state.applications
    .filter((a) => a.studentId === state.user?.id)
    .map(studentView);
  const active = apps.find((a) => a.id === selected);
  const counts = [
    ["Applications", apps.length],
    [
      "Awaiting review",
      apps.filter((a) =>
        ["Submitted", "Under Employer Review"].includes(a.stage),
      ).length,
    ],
    [
      "Next steps",
      apps.filter((a) =>
        ["Shortlisted", "Invited to Next Stage"].includes(a.stage),
      ).length,
    ],
    ["Drafts", apps.filter((a) => a.stage === "Draft").length],
  ];
  return (
    <div className="container">
      <Heading
        label="YOUR APPLICATION TRACKER"
        title="Every step, in view."
        description="Your work has a story. See where it goes next."
        action={
          <Link className="button" href="/marketplace">
            Explore opportunities <ArrowRight size={16} />
          </Link>
        }
      />
      {params.get("submitted") && (
        <div className="notice success">
          <Check size={18} />
          Demo submission saved. No employer was contacted; track the local
          review deadline below.
        </div>
      )}
      <div className="metrics">
        {counts.map(([name, n]) => (
          <article key={name}>
            <span>{name}</span>
            <strong>{n}</strong>
          </article>
        ))}
      </div>
      <div className="toolbar">
        <h2>Your applications</h2>
        <select
          aria-label="Filter application status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All",
            "Draft",
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
      </div>
      <div className="application-list">
        {apps
          .filter((a) => filter === "All" || a.stage === filter)
          .map((a) => {
            const o = state.opportunities.find(
              (o) => o.id === a.opportunityId,
            )!;
            return (
              <article key={a.id} className="application-card">
                <div className="company-icon">
                  {o.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="app-main">
                  <span className="muted">{o.company}</span>
                  <h3>{o.title}</h3>
                  <div className="meta">
                    <span>
                      {a.submittedAt
                        ? "Submitted " +
                          new Date(a.submittedAt).toLocaleDateString()
                        : "Unsubmitted draft"}
                    </span>
                    <span>{a.integrity}</span>
                  </div>
                </div>
                <div className="app-status">
                  <Status stage={a.stage} />
                  <Deadline application={a as Application} />
                </div>
                <div className="app-actions">
                  {a.stage === "Draft" ? (
                    <Link
                      className="button secondary small"
                      href={"/workspace/" + o.id}
                    >
                      Resume draft <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <button
                      className="button secondary small"
                      onClick={() => setSelected(a.id)}
                    >
                      View details <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        {!apps.some((a) => filter === "All" || a.stage === filter) && (
          <Empty
            title="Nothing in this view yet."
            description="Try another status or find your first challenge."
          />
        )}
      </div>
      <p className="fine-print">
        Demo integrity statuses are pre-seeded scenarios, not analysis results.
        New applications remain “Not checked.”
      </p>
      {active && (
        <Modal title="Application details" onClose={() => setSelected(null)}>
          <Status stage={active.stage} />
          <h3>
            {
              state.opportunities.find((o) => o.id === active.opportunityId)
                ?.title
            }
          </h3>
          <Deadline application={active as Application} />
          <h3>Self-reported declarations</h3>
          <p>
            {Object.values(active.eligibility).filter(Boolean).length}/5
            confirmed. Not independently verified.
          </p>
          <h3>Integrity review</h3>
          <p>
            {active.integrity === "Demo: human review recommended"
              ? "Similarity flag raised — human review recommended. Fictional scenario, not an actual comparison."
              : active.integrity}
          </p>
          {active.clarification && (
            <div className="notice">
              <strong>Employer clarification request:</strong>{" "}
              {active.clarification}
            </div>
          )}
          <h3>Status history</h3>
          <ol className="timeline">
            {active.history.map((h, i) => (
              <li key={i}>
                <strong>{h.stage}</strong>
                <small>{new Date(h.at).toLocaleString()}</small>
                <p>{h.message}</p>
              </li>
            ))}
          </ol>
          {!["Withdrawn", "Declined"].includes(active.stage) && (
            <button
              className="button danger"
              onClick={() => setWithdraw(active.id)}
            >
              Withdraw application
            </button>
          )}
        </Modal>
      )}
      {withdraw && (
        <Modal
          title="Withdraw this demo application?"
          onClose={() => setWithdraw(null)}
        >
          <p>The fictional employer will see the application as withdrawn.</p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setWithdraw(null)}
            >
              Cancel
            </button>
            <button
              className="button danger"
              onClick={() => {
                const at = new Date().toISOString();
                setState((s) => ({
                  ...s,
                  applications: s.applications.map((a) =>
                    a.id === withdraw
                      ? {
                          ...a,
                          stage: "Withdrawn",
                          history: [
                            ...a.history,
                            {
                              stage: "Withdrawn" as Stage,
                              at,
                              message: "Withdrawn by the demo student.",
                            },
                          ],
                        }
                      : a,
                  ),
                }));
                setWithdraw(null);
                setSelected(null);
                notify("Demo application withdrawn.");
              }}
            >
              Withdraw
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function Auth({ register = false }: { register?: boolean }) {
  const { login, setState } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<Role>("student"),
    [real, setReal] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function auth(form: FormData) {
    if (dataMode === "demo") {
      setError(
        "Secure authentication is not connected. Use the fictional demo buttons below; do not enter real account credentials.",
      );
      return;
    }
    setBusy(true);
    try {
      const user = await api<import("../lib/types").DemoUser>(
        register ? contracts.register : contracts.signIn,
        {
          method: "POST",
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
            name: form.get("name"),
            role,
          }),
        },
      );
      setState((s) => ({ ...s, user }));
      router.push(role === "employer" ? "/employer" : "/tracker");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <div className="auth-story">
        <p className="eyebrow">PROVE YOUR POTENTIAL.</p>
        <h1>
          Your next chapter
          <br />
          starts with a<br />
          <span>first chance.</span>
        </h1>
        <p>
          A small project can say more than a long experience section. Show what
          you can do.
        </p>
        <div className="auth-orbit">
          <ShieldCheck size={58} />
        </div>
        <small>UNHACK 2026 · Skills-first hiring</small>
      </div>
      <section className="auth-panel">
        <Badge tone="violet">EXPLORE FIRSTPROOF</Badge>
        <h2>
          {register
            ? "Your first chance starts here."
            : "Welcome to your next step."}
        </h2>
        <p>
          {register
            ? "Choose how you’d like to explore."
            : "Sign in or explore a fictional account."}
        </p>
        <div className="role-tabs">
          <button
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            <User size={18} />
            I’m a student
          </button>
          <button
            className={role === "employer" ? "active" : ""}
            onClick={() => setRole("employer")}
          >
            <Briefcase size={18} />
            I’m an employer
          </button>
        </div>
        <div className="demo-auth">
          <SparkleMark />
          <h3>Take the full demo for a spin.</h3>
          <p>
            No password. No real applicant data. Everything stays in this
            browser.
          </p>
          <button
            className="button full"
            onClick={() => {
              login(role);
              const requested = params.get("next");
              router.push(
                requested?.startsWith("/") && !requested.startsWith("//")
                  ? requested
                  : role === "student"
                    ? "/tracker"
                    : "/employer",
              );
            }}
          >
            Continue as demo {role} <ArrowRight size={16} />
          </button>
        </div>
        <button
          className="text-button"
          onClick={() => setReal(!real)}
          aria-expanded={real}
        >
          {real ? "Hide" : "View"}{" "}
          {register ? "registration" : "account sign-in"} options
        </button>
        {real && (
          <form action={auth}>
            {dataMode === "demo" && (
              <div className="notice">
                Real account authentication is a backend dependency. The fields
                below are disabled in this demo.
              </div>
            )}
            <fieldset disabled={dataMode === "demo" || busy}>
              {register && (
                <label>
                  Name
                  <input name="name" required autoComplete="name" />
                </label>
              )}
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  required
                  minLength={12}
                  autoComplete={register ? "new-password" : "current-password"}
                />
              </label>
              <button className="button full" type="submit">
                {busy ? "Connecting…" : register ? "Create account" : "Sign in"}
              </button>
            </fieldset>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
          </form>
        )}
        <p className="fine-print">
          {register ? "Already have an account?" : "New to FirstProof?"}{" "}
          <Link href={register ? "/sign-in" : "/sign-up"}>
            {register ? "Sign in" : "Get started"}
          </Link>
        </p>
      </section>
    </div>
  );
}
function SparkleMark() {
  return (
    <span className="large-icon">
      <ShieldCheck />
    </span>
  );
}
export function Profile() {
  const { state, setState, notify } = useStore();
  return (
    <Gate role="student">
      <div className="container narrow">
        <Heading
          label="STUDENT PROFILE"
          title="Start with your story."
          description="Fictional demo profile. Do not enter real personal or applicant information."
        />
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setState((s) => ({
              ...s,
              user: s.user ? { ...s.user, ...s.profile } : s.user,
            }));
            notify(
              "Demo profile saved locally. Existing submitted applications keep their original details.",
            );
          }}
        >
          {(["name", "university", "program"] as const).map((k) => (
            <label key={k}>
              {k === "name"
                ? "Display name"
                : k === "university"
                  ? "University"
                  : "Program and academic year"}
              <input
                required
                value={state.profile[k]}
                onChange={(e) =>
                  setState((s) => ({
                    ...s,
                    profile: { ...s.profile, [k]: e.target.value },
                  }))
                }
              />
            </label>
          ))}
          <label>
            Résumé summary
            <textarea
              rows={6}
              value={state.profile.resume}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  profile: { ...s.profile, resume: e.target.value },
                }))
              }
            />
          </label>
          <button className="button" type="submit">
            Save demo profile <Save size={16} />
          </button>
        </form>
      </div>
    </Gate>
  );
}
