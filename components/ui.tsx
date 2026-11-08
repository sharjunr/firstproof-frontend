"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useId, type ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  MapPin,
  Clock,
  Bookmark,
  Check,
  Briefcase,
  LayoutDashboard,
  Users,
  Plus,
  Settings,
  Calculator,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type { Opportunity, Application } from "../lib/types";
import { useStore } from "./store";
import { deadlineInfo } from "../lib/model";
import { CompanyLogo } from "../lib/company-logos";
export { CompanyLogo };
export { catalogIndustries as industries } from "../lib/catalog";
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="FirstProof home">
      <span className="logo-mark">
        f<span>p</span>
      </span>
      firstproof<span className="dot">.</span>
    </Link>
  );
}
export function Nav() {
  const { state, setState, notify } = useStore();
  const [mobile, setMobile] = useState(false);
  const path = usePathname();
  useEffect(() => setMobile(false), [path]);
  return (
    <header className="nav">
        <Logo />
        <nav className={mobile ? "nav-links open" : "nav-links"}>
          <Link href="/#students">For students</Link>
          <Link href="/#employers">For employers</Link>
          <Link
            className={path === "/marketplace" ? "selected" : ""}
            href="/marketplace"
          >
            Marketplace
          </Link>
        </nav>
        <div className="nav-actions">
          {state.user ? (
            <>
              <Link
                className="text-link desktop"
                href={state.user.role === "employer" ? "/employer" : "/tracker"}
              >
                Workspace <ArrowUpRight size={14} />
              </Link>
              <button
                className="icon-button"
                aria-label="Sign out of demo"
                onClick={() => {
                  setState((s) => ({ ...s, user: null }));
                  notify("Signed out of local demo.");
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link className="text-link" href="/sign-in">
                Sign in
              </Link>
              <Link className="button small" href="/sign-up">
                Get started <ArrowUpRight size={13} />
              </Link>
            </>
          )}
          <button
            className="icon-button mobile-menu"
            aria-expanded={mobile}
            aria-label="Toggle navigation"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Logo />
        <p>Potential deserves a first chance.</p>
      </div>
      <div>
        <Link href="/marketplace">Explore opportunities</Link>
        <Link href="/employer">For employers</Link>
        <Link href="/profile">Your profile</Link>
      </div>
      <div>
        <span>Built for UNHACK 2026</span>
        <small>
          Skills open doors.
          <br />
          Local preview · Example listings, not live vacancies · AI review coming soon.
        </small>
      </div>
    </footer>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={"badge " + tone}>{children}</span>;
}
export function Status({ stage }: { stage: string }) {
  return (
    <Badge
      tone={
        stage === "Shortlisted" || stage === "Invited to Next Stage"
          ? "success"
          : stage === "Declined" || stage === "Time expired"
            ? "error"
            : stage === "Under Employer Review"
              ? "blue"
              : "neutral"
      }
    >
      {stage}
    </Badge>
  );
}
export function Deadline({ application }: { application: Application }) {
  const d = deadlineInfo(application);
  return (
    <span className={d.overdue ? "deadline overdue" : "deadline"}>
      <Clock size={13} />
      {d.label}
    </span>
  );
}
export function OpportunityCard({ o }: { o: Opportunity }) {
  const { state, setState, notify } = useStore();
  const saved = state.saved.includes(o.id);
  return (
    <article className="opportunity-card">
      <div className="card-top">
        <CompanyLogo company={o.company} />
        <div>
          <span>{o.company}</span>
          <small>Fictional Demo — Not affiliated with this company.</small>
        </div>
        <button
          className={"icon-button " + (saved ? "saved" : "")}
          aria-label={saved ? "Unsave " + o.title : "Save " + o.title}
          aria-pressed={saved}
          onClick={() => {
            setState((s) => ({
              ...s,
              saved: saved
                ? s.saved.filter((x) => x !== o.id)
                : [...s.saved, o.id],
            }));
            notify(
              saved
                ? "Opportunity removed from saved."
                : "Opportunity saved in this browser.",
            );
          }}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <Badge>{o.industry}</Badge>
      <h3>
        <Link href={"/opportunities/" + o.id}>{o.title}</Link>
      </h3>
      <div className="meta">
        <span>
          <MapPin size={13} />
          {o.location}
        </span>
        <span>{o.arrangement}</span>
        <span>{o.type}</span>
      </div>
      {o.majors?.length ? (
        <p className="card-majors">
          For {o.majors.slice(0, 2).join(" · ")}
          {o.majors.length > 2 ? " + more" : ""}
        </p>
      ) : null}
      <p className="challenge-label">ROLE-SPECIFIC CHALLENGE</p>
      <h4>{o.challenge}</h4>
      <p className="clamp">{o.scenario || o.instructions}</p>
      {o.skills?.length ? (
        <p className="card-majors">
          Skills: {o.skills.slice(0, 3).join(" · ")}
        </p>
      ) : null}
      <div className="card-facts">
        <span>
          <Clock size={13} />
          {o.effort}h project
        </span>
        <span>{o.paid ? `$${o.pay}/hr CAD` : "Unpaid"}</span>
        <span>{o.duration} months</span>
      </div>
      <div className="card-review">
        <ShieldCheck size={14} />
        <span>Human review within {o.reviewDays} days</span>
      </div>
      <div className="card-bottom">
        <small>
          Apply by{" "}
          {new Date(o.deadline + "T12:00:00").toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
          })}
        </small>
        <Link className="text-link violet" href={"/opportunities/" + o.id}>
          View challenge <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export function Gate({
  role,
  children,
}: {
  role: "student" | "employer";
  children: ReactNode;
}) {
  const { state, ready, login } = useStore();
  const nextPath=usePathname();
  if (!ready) return <Loading />;
  if (state.user?.role !== role)
    return (
      <section className="gate">
        <div className="large-icon">
          <Briefcase />
        </div>
        <p className="eyebrow">YOUR {role.toUpperCase()} WORKSPACE</p>
        <h1>
          {role === "student"
            ? "Your work starts here."
            : "A different way to discover talent."}
        </h1>
        <p>
          Use a preview {role} account to explore the complete workflow.
        </p>
        <Link className="button" href={'/sign-up?next='+encodeURIComponent(nextPath)}>Register to join <ArrowRight size={16}/></Link>
        <br/>
        <button className="button secondary" onClick={() => login(role)}>
          Continue as demo {role} <ArrowRight size={16} />
        </button>
        <p className="fine-print">
          Local demo only. No password or real applicant information needed.
        </p>
        <Link className="text-link" href="/sign-in">
          View sign-in options
        </Link>
      </section>
    );
  return <>{children}</>;
}
export function EmployerShell({ children }: { children: ReactNode }) {
  const p = usePathname();
  return (
    <Gate role="employer">
      <div className="employer-shell">
        <aside className="dashboard-sidebar">
          <span className="eyebrow">EMPLOYER WORKSPACE</span>
          {[
            [LayoutDashboard, "Overview", "/employer"],
            [Briefcase, "My opportunities", "/employer/opportunities"],
            [Users, "Candidate review", "/employer/candidates"],
            [Calculator, "ROI Simulator", "/employer/roi"],
            [Plus, "Post opportunity", "/employer/post-opportunity"],
            [Settings, "Settings", "/employer/settings"],
          ].map(([Icon, label, url]) => {
            const I = Icon as typeof Users;
            return (
              <Link
                key={String(url)}
                className={p === url ? "active" : ""}
                href={String(url)}
              >
                <I size={17} />
                {String(label)}
              </Link>
            );
          })}
          <div className="sidebar-note">
            <ShieldCheck size={22} />
            <strong>
              Real people make
              <br />
              the decisions.
            </strong>
            <p>
              Similarity flags are prompts for human review, never automatic
              rejections.
            </p>
          </div>
        </aside>
        <div className="dashboard-main">{children}</div>
      </div>
    </Gate>
  );
}
export function Heading({
  label,
  title,
  description,
  action,
}: {
  label: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Loading() {
  return (
    <div className="loading" aria-label="Loading workspace" role="status">
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton" />
      <span>Loading your workspace…</span>
    </div>
  );
}
export function Empty({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="large-icon">
        <Sparkles />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-head">
        <h2 id={titleId}>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function CheckLine({ children }: { children: ReactNode }) {
  return (
    <div className="check-line">
      <Check size={16} />
      <span>{children}</span>
    </div>
  );
}
