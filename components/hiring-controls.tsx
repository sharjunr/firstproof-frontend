"use client";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  ShieldCheck,
  Check,
  Clock,
} from "lucide-react";
import type { Application, Opportunity, LocalFile } from "../lib/types";
import { useStore } from "./store";
import {
  requestBackground,
  respondToBackground,
  employerApplicationView,
  rubricErrors,
} from "../lib/model";
import { saveFile, fileError, openFile } from "../lib/files";
import { Badge } from "./ui";

export function NextStageReview({ application }: { application: Application }) {
  const { state, setState, notify } = useStore();
  const [message, setMessage] = useState(
    "Please share your résumé and any education information you choose to provide for the next hiring stage.",
  );
  const [error, setError] = useState("");
  const view = employerApplicationView(application);
  const advanced = ["Shortlisted", "Invited to Next Stage"].includes(
    application.stage,
  );
  return (
    <section className="background-panel">
      <h3>Optional next-stage information</h3>
      {!advanced ? (
        <p>
          Shortlist or advance this applicant before requesting a résumé or
          education details. Initial review uses name, email, and submitted work
          only.
        </p>
      ) : view.backgroundRequest?.status === "shared" ? (
        <>
          <Badge tone="success">Shared with applicant consent</Badge>
          {view.backgroundRequest.resume && (
            <>
              <h4>Résumé supplied for this stage</h4>
              <p className="pre-wrap">{view.backgroundRequest.resume}</p>
            </>
          )}
          {view.backgroundRequest.education && (
            <>
              <h4>Optional education information</h4>
              <p className="pre-wrap">{view.backgroundRequest.education}</p>
            </>
          )}
        </>
      ) : view.backgroundRequest?.status === "requested" ? (
        <>
          <Badge>Awaiting applicant consent</Badge>
          <p>{view.backgroundRequest.message}</p>
        </>
      ) : (
        <>
          <p>
            {view.backgroundRequest?.status === "declined"
              ? "The applicant declined the previous request. No background details were shared."
              : "The applicant chooses whether and what to share. A request does not reveal stored background information."}
          </p>
          <label>
            Explain your request
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <button
            className="button secondary"
            onClick={() => {
              try {
                setState(requestBackground(state, application.id, message));
                notify(
                  "Request added to the applicant tracker. No email was sent.",
                );
                setError("");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Request next-stage details
          </button>
        </>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </section>
  );
}
export function BackgroundResponse({
  application,
}: {
  application: Pick<Application, "id" | "stage" | "backgroundRequest">;
}) {
  const { state, setState, notify } = useStore();
  const [resume, setResume] = useState(""),
    [education, setEducation] = useState(""),
    [consent, setConsent] = useState(false),
    [error, setError] = useState("");
  const req = application.backgroundRequest;
  if (!req)
    return (
      <div className="notice">
        Your initial application contains name, email, and project work. Résumé
        and education sharing is available only if the employer advances you and
        requests it.
      </div>
    );
  function respond(share: boolean) {
    try {
      if (share && !consent)
        throw new Error("Confirm your consent before sharing.");
      setState(
        respondToBackground(state, application.id, share, resume, education),
      );
      notify(
        share
          ? "Selected information shared with this employer in the local preview."
          : "Request declined. No background details were shared.",
      );
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <section className="background-panel">
      <h3>Next-stage request</h3>
      <p>{req.message}</p>
      {req.status === "requested" &&
      ["Shortlisted", "Invited to Next Stage"].includes(application.stage) ? (
        <>
          <p>
            You choose what to share. Leave either field empty or decline the
            request.
          </p>
          <label>
            Résumé text (optional)
            <textarea
              rows={5}
              maxLength={10000}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </label>
          <label>
            Education information (optional)
            <textarea
              rows={3}
              maxLength={3000}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I consent to sharing only the information entered above with this
            employer for the next stage.
          </label>
          <div className="modal-actions">
            <button className="button secondary" onClick={() => respond(false)}>
              Decline request
            </button>
            <button
              className="button"
              disabled={!consent}
              onClick={() => respond(true)}
            >
              Share selected details
            </button>
          </div>
        </>
      ) : (
        <Badge tone={req.status === "shared" ? "success" : "neutral"}>
          {req.status === "shared"
            ? "You shared a response"
            : req.status === "declined"
              ? "You declined this request"
              : "Request is unavailable at the current stage"}
        </Badge>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </section>
  );
}
export function ChallengeMaterials({
  opportunity: o,
  onChange,
}: {
  opportunity: Opportunity;
  onChange: (p: Partial<Opportunity>) => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const rubric = o.rubric || [];
  async function upload(list: FileList | null, privateFiles: boolean) {
    if (!list) return;
    setBusy(true);
    setError("");
    try {
      const current = privateFiles
        ? o.privateEvaluationFiles || []
        : o.resources || [];
      if (current.length + list.length > 8)
        throw new Error("Use at most eight files in each section.");
      const files: LocalFile[] = [];
      for (const f of Array.from(list)) {
        const issue = fileError(f);
        if (issue) throw new Error(issue);
        const id = crypto.randomUUID();
        await saveFile(id, f);
        files.push({
          id,
          name: f.name,
          size: f.size,
          type: f.type,
          stored: true,
        });
      }
      onChange(
        privateFiles
          ? { privateEvaluationFiles: [...current, ...files] }
          : { resources: [...current, ...files] },
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="materials-editor">
      <h3>Challenge resources</h3>
      <p>
        Provide instructions or starter files applicants may download. Files are
        saved only in this browser for the preview.
      </p>
      <label className="compact-upload">
        <Upload size={18} />
        Applicant resources
        <input
          type="file"
          multiple
          disabled={busy}
          onChange={(e) => {
            void upload(e.target.files, false);
            e.target.value = "";
          }}
        />
      </label>
      {(o.resources || []).map((f) => (
        <div key={f.id} className="file-row">
          <FileText size={15} />
          {f.name}
          <button
            type="button"
            className="icon-button"
            aria-label={"Remove resource " + f.name}
            onClick={() =>
              onChange({ resources: o.resources?.filter((x) => x.id !== f.id) })
            }
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <h3>Evaluation rubric</h3>
      <p>
        Publish clear criteria and weights totaling 100%. Reference solutions
        remain employer-only in the interface.
      </p>
      {rubric.map((c, i) => (
        <div className="rubric-editor" key={c.id}>
          <label>
            Criterion {i + 1}
            <input
              value={c.label}
              maxLength={100}
              onChange={(e) =>
                onChange({
                  rubric: rubric.map((x) =>
                    x.id === c.id ? { ...x, label: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <label>
            Weight (%)
            <input
              type="number"
              min={1}
              max={100}
              value={c.weight}
              onChange={(e) =>
                onChange({
                  rubric: rubric.map((x) =>
                    x.id === c.id
                      ? { ...x, weight: Number(e.target.value) }
                      : x,
                  ),
                })
              }
            />
          </label>
          <label>
            Description
            <textarea
              rows={2}
              maxLength={1000}
              value={c.description}
              onChange={(e) =>
                onChange({
                  rubric: rubric.map((x) =>
                    x.id === c.id ? { ...x, description: e.target.value } : x,
                  ),
                })
              }
            />
          </label>
          <button
            type="button"
            className="icon-button"
            aria-label={"Remove criterion " + (i + 1)}
            onClick={() =>
              onChange({ rubric: rubric.filter((x) => x.id !== c.id) })
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div className="rubric-total">
        <Badge tone={rubricErrors(rubric) ? "warning" : "success"}>
          Total: {rubric.reduce((n, c) => n + c.weight, 0)}%
        </Badge>
        <button
          type="button"
          className="button secondary small"
          disabled={rubric.length >= 10}
          onClick={() =>
            onChange({
              rubric: [
                ...rubric,
                {
                  id: crypto.randomUUID(),
                  label: "New criterion",
                  weight: 10,
                  description: "",
                },
              ],
            })
          }
        >
          <Plus size={14} />
          Add criterion
        </button>
      </div>
      <label>
        Private sample solution (optional)
        <textarea
          rows={6}
          maxLength={20000}
          value={o.referenceSolution || ""}
          onChange={(e) => onChange({ referenceSolution: e.target.value })}
          placeholder="Model solution, expected reasoning, test fixtures, and known limitations."
        />
      </label>
      <label className="compact-upload">
        <Upload size={18} />
        Private rubric or sample solution files (optional)
        <input
          type="file"
          multiple
          disabled={busy}
          onChange={(e) => {
            void upload(e.target.files, true);
            e.target.value = "";
          }}
        />
      </label>
      {(o.privateEvaluationFiles || []).map((f) => (
        <div className="file-row" key={f.id}>
          <ShieldCheck size={15} />
          {f.name}
          <button
            type="button"
            className="icon-button"
            aria-label={"Remove private file " + f.name}
            onClick={() =>
              onChange({
                privateEvaluationFiles: o.privateEvaluationFiles?.filter(
                  (x) => x.id !== f.id,
                ),
              })
            }
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      {busy && <p role="status">Saving files locally…</p>}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <p className="fine-print">
        No code is executed. Live AI evaluation, secure file access, and server
        storage require backend integration. Keep real hiring records out of
        this preview.
      </p>
    </section>
  );
}
export function ChallengeResources({
  opportunity: o,
}: {
  opportunity: Pick<Opportunity, "resources" | "rubric" | "challengeDays">;
}) {
  const [error, setError] = useState("");
  return (
    <section className="challenge-resources">
      <h3>Time and evaluation</h3>
      <p>
        <Clock size={14} /> Complete within {o.challengeDays || 7} days after
        joining, and before the published application deadline.
      </p>
      {o.rubric?.map((c) => (
        <div className="public-rubric" key={c.id}>
          <strong>
            {c.label}
            <span>{c.weight}%</span>
          </strong>
          <p>{c.description}</p>
        </div>
      ))}
      {!!o.resources?.length && (
        <>
          <h3>Starter files and resources</h3>
          {o.resources.map((f) => (
            <button
              className="deliverable-link"
              key={f.id}
              onClick={() =>
                openFile(f.id, f.name).catch((e) => setError(e.message))
              }
            >
              <FileText size={15} />
              {f.name}
            </button>
          ))}
        </>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </section>
  );
}
export function SubmissionReview({
  application: a,
  opportunity: o,
}: {
  application: Application;
  opportunity: Opportunity;
}) {
  const checks = [
    ["Project explanation supplied", a.text.trim().length >= 30],
    [
      "Deliverables present",
      !!a.files.length || !!a.links.length || a.text.trim().length >= 80,
    ],
    ["Employer rubric ready", !rubricErrors(o.rubric)],
  ] as const;
  return (
    <section className="preflight-panel">
      <h3>First review layer</h3>
      <p>
        These are local completeness checks, not an assessment of technical
        quality or a hiring score.
      </p>
      {checks.map(([label, passed]) => (
        <div className="preflight-row" key={label}>
          <span>{label}</span>
          <Badge tone={passed ? "success" : "warning"}>
            {passed ? (
              <>
                <Check size={12} />
                Present
              </>
            ) : (
              "Needs review"
            )}
          </Badge>
        </div>
      ))}
      <h4>AI rubric evaluation</h4>
      <Badge>Not connected</Badge>
      <p>
        No AI score, ranking, originality finding, or code test result has been
        generated. The employer can review the submission against the published
        rubric manually.
      </p>
    </section>
  );
}
