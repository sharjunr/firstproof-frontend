"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Code2,
  BarChart3,
  CircuitBoard,
  Megaphone,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Clock,
  Bookmark,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useStore } from "./store";
import {
  Badge,
  Heading,
  OpportunityCard,
  industries,
  Empty,
  Loading,
  CheckLine,
} from "./ui";
import { searchOpportunities } from "../lib/model";
export function Landing() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const glow = useRef<HTMLDivElement>(null);
  const { state } = useStore();
  return (
    <>
      <section
        className="hero"
        onPointerMove={(e) => {
          if (!reduced && glow.current) {
            const r = e.currentTarget.getBoundingClientRect();
            glow.current.style.setProperty(
              "--mx",
              `${((e.clientX - r.left) / r.width) * 100}%`,
            );
            glow.current.style.setProperty(
              "--my",
              `${((e.clientY - r.top) / r.height) * 100}%`,
            );
          }
        }}
      >
        <div className="hero-glow" ref={glow} />
        <div className="hero-grid" />
        <div className="particles" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <i
              key={i}
              style={{
                left: ((i * 37) % 100) + "%",
                top: ((i * 23) % 90) + "%",
                animationDelay: -(i * 1.8) + "s",
              }}
            />
          ))}
        </div>
        <motion.div
          className="hero-content"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="hero-pill">
            <span />A first chance, built around what you can do{" "}
            <ArrowUpRight size={13} />
          </span>
          <h1>
            Your potential deserves
            <br />a <span>first chance.</span>
          </h1>
          <p>Discover employer challenges. Prove what you can do.</p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/marketplace?q=" + encodeURIComponent(query));
            }}
          >
            <Search size={21} />
            <input
              aria-label="Search opportunities"
              placeholder="I'm looking for AI internships near Toronto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button aria-label="Explore opportunities" type="submit">
              <span>Explore opportunities</span>
              <ArrowUpRight size={24} />
            </button>
          </form>
          <div className="suggestions">
            {[
              "AI internships",
              "Business challenges",
              "Engineering projects",
              "Marketing opportunities",
            ].map((s) => (
              <Link key={s} href={"/marketplace?q=" + encodeURIComponent(s)}>
                {s}
                <ArrowUpRight size={11} />
              </Link>
            ))}
          </div>
          <div className="hero-proof">
            <span>
              <Check size={13} />
              Skills before job titles
            </span>
            <span>
              <Check size={13} />
              Human hiring decisions
            </span>
            <span>
              <Check size={13} />A commitment to review
            </span>
          </div>
        </motion.div>
        <div className="hero-foot">
          <span>
            FOR THE BUILDERS. THE THINKERS. THE NOT-YET-GIVEN-A-CHANCERS.
          </span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>
      <section className="section intro">
        <p className="eyebrow">A DIFFERENT STARTING LINE</p>
        <h2>
          You have the skills.
          <br />
          <span>Let your work introduce you.</span>
        </h2>
        <p>
          The first-job paradox shouldn’t define your future. FirstProof
          connects short, practical challenges to opportunities—so employers can
          see more than your experience section.
        </p>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM POTENTIAL TO POSSIBILITY</p>
            <h2>A clear path. A real person on the other side.</h2>
          </div>
          <p>Seven steps. One shared hiring workflow.</p>
        </div>
        <div className="steps-grid">
          {[
            "Employer posts a role",
            "Discover your opportunity",
            "Build a small project",
            "Submit your work",
            "Integrity & eligibility checks",
            "Employer reviews your work",
            "Track your next step",
          ].map((s, i) => (
            <article key={s}>
              <span>0{i + 1}</span>
              <h3>{s}</h3>
              <p>
                {
                  [
                    "A relevant challenge, clear scope, and a published review timeframe.",
                    "Search by interest, location, and the kind of work you want to do.",
                    "Show your approach through a short, practical mini-project.",
                    "Attach files, share links, or paste your work and explanation.",
                    "Declarations stay self-reported. Similarity concerns go to humans.",
                    "Your résumé and work sample reach an authorized reviewer.",
                    "Employers make decisions. You see where your application stands.",
                  ][i]
                }
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MORE THAN A RÉSUMÉ</p>
            <h2>Evidence opens a different conversation.</h2>
          </div>
        </div>
        <div className="comparison">
          <article>
            <span className="eyebrow">TRADITIONAL APPLICATION</span>
            <h3>“What have you done before?”</h3>
            <p>
              Previous roles and credentials can leave your potential between
              the lines.
            </p>
          </article>
          <article>
            <span className="eyebrow">A STANDALONE CHATBOT</span>
            <h3>“Here’s how you could prepare.”</h3>
            <p>
              Useful guidance, without an employer’s posting, application
              record, or commitment to review.
            </p>
          </article>
          <article className="highlight">
            <span className="eyebrow">THE FIRSTPROOF APPROACH</span>
            <h3>“Show us what you can do.”</h3>
            <p>
              Employer-created challenges, concrete work samples, and a
              trackable human review.
            </p>
          </article>
        </div>
      </section>
      <section className="section audience">
        <article id="students">
          <div className="large-icon">
            <Code2 />
          </div>
          <p className="eyebrow">FOR STUDENTS</p>
          <h2>
            Your first role starts
            <br />
            with your next project.
          </h2>
          <p>
            Find a challenge that speaks to you. Build something small. Give an
            employer a reason to look closer.
          </p>
          <Link className="text-link violet" href="/marketplace">
            Find your first opportunity <ArrowUpRight size={16} />
          </Link>
        </article>
        <article id="employers">
          <div className="large-icon">
            <BarChart3 />
          </div>
          <p className="eyebrow">FOR EMPLOYERS</p>
          <h2>
            Discover ability
            <br />
            beyond the experience section.
          </h2>
          <p>
            Create a focused challenge and review real work. Your team keeps
            control of every recruitment decision.
          </p>
          <Link className="text-link violet" href="/employer">
            Explore the employer workspace <ArrowUpRight size={16} />
          </Link>
        </article>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MANY DISCIPLINES. ONE FIRST CHANCE.</p>
            <h2>What could you prove?</h2>
          </div>
          <Link className="text-link" href="/marketplace">
            Explore all challenges <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {[Code2, BarChart3, CircuitBoard, Megaphone].map((Icon, i) => (
            <Link
              key={i}
              className="category-card"
              href={
                "/marketplace?industry=" + encodeURIComponent(industries[i])
              }
            >
              <Icon />
              <small>0{i + 1}</small>
              <h3>{industries[i]}</h3>
              <p>
                {
                  [
                    "Build a feedback classifier.",
                    "Find the story in sales data.",
                    "Diagnose a circuit problem.",
                    "Give a new product its voice.",
                  ][i]
                }
              </p>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
        <p className="fine-print">
          Examples use fictional employers and synthetic briefs. No confirmed
          partnerships are implied.
        </p>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR NEXT SMALL PROJECT</p>
            <h2>Explore the possibilities.</h2>
          </div>
          <Badge tone="violet">FICTIONAL DEMO LISTINGS</Badge>
        </div>
        <div className="cards-grid">
          {state.opportunities
            .filter((o) => o.status === "Published")
            .slice(0, 3)
            .map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
        </div>
      </section>
      <section className="section">
        <div className="review-feature">
          <div className="review-art" aria-hidden="true">
            <div>
              <ShieldCheck size={60} />
              <strong>
                Work submitted.
                <br />
                Review committed.
              </strong>
              <span>YOUR WORK DESERVES A RESPONSE</span>
            </div>
          </div>
          <div>
            <p className="eyebrow">THE EMPLOYER REVIEW COMMITMENT</p>
            <h2>
              Your effort should
              <br />
              reach a real person.
            </h2>
            <p>
              Every published challenge includes an employer-selected review
              timeframe. Eligible, complete applications get a visible review
              deadline—and overdue reviews stay visible.
            </p>
            <CheckLine>See the commitment before you start.</CheckLine>
            <CheckLine>Track the review after you submit.</CheckLine>
            <CheckLine>Human decisions, always.</CheckLine>
            <p className="fine-print">
              A review commitment does not guarantee an interview or job. Demo
              deadlines illustrate the planned workflow.
            </p>
          </div>
        </div>
      </section>
      <section className="section final-cta">
        <Sparkles />
        <p className="eyebrow">THE NEXT CHAPTER IS YOURS</p>
        <h2>
          Don’t just tell them.
          <br />
          <span>Show them.</span>
        </h2>
        <div>
          <Link className="button" href="/marketplace">
            Find a challenge <ArrowUpRight size={17} />
          </Link>
          <Link className="button secondary" href="/employer/post-opportunity">
            Post an opportunity <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function Marketplace() {
  const drawer = useRef<HTMLElement>(null);
  const params = useSearchParams();
  const { state, ready } = useStore();
  const [q, setQ] = useState(params.get("q") || ""),
    [industry, setIndustry] = useState(params.get("industry") || ""),
    [location, setLocation] = useState(""),
    [arrangement, setArrangement] = useState(""),
    [type, setType] = useState(""),
    [paid, setPaid] = useState(""),
    [minPay, setMinPay] = useState(""),
    [duration, setDuration] = useState(""),
    [effort, setEffort] = useState(""),
    [deadline, setDeadline] = useState(""),
    [saved, setSaved] = useState(false),
    [filters, setFilters] = useState(false),
    [sort, setSort] = useState("deadline");
  useEffect(() => {
    setQ(params.get("q") || "");
    setIndustry(params.get("industry") || "");
  }, [params]);
  useEffect(() => {
    if (!filters || !window.matchMedia("(max-width:600px)").matches) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = drawer.current;
    el?.querySelector<HTMLElement>("button,input,select")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilters(false);
      if (e.key === "Tab" && el) {
        const controls = Array.from(
          el.querySelectorAll<HTMLElement>("button,input,select,a"),
        ).filter((c) => c.getClientRects().length);
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [filters]);
  const items = searchOpportunities(state.opportunities, q)
    .filter(
      (o) =>
        (!industry || o.industry === industry) &&
        (!location || o.location === location) &&
        (!arrangement || o.arrangement === arrangement) &&
        (!type || o.type === type) &&
        (!paid || o.paid === (paid === "paid")) &&
        (!minPay || o.pay >= Number(minPay)) &&
        (!duration || o.duration <= Number(duration)) &&
        (!effort || o.effort <= Number(effort)) &&
        (!deadline || o.deadline <= deadline) &&
        (!saved || state.saved.includes(o.id)),
    )
    .sort((a, b) =>
      sort === "pay"
        ? b.pay - a.pay
        : sort === "effort"
          ? a.effort - b.effort
          : a.deadline.localeCompare(b.deadline),
    );
  function reset() {
    setQ("");
    setIndustry("");
    setLocation("");
    setArrangement("");
    setType("");
    setPaid("");
    setMinPay("");
    setDuration("");
    setEffort("");
    setDeadline("");
    setSaved(false);
  }
  return (
    <div className="container marketplace">
      <Heading
        label="THE OPPORTUNITY MARKETPLACE"
        title="Find your next first."
        description="Short challenges. Tangible work. A new way to be considered."
      />
      <form className="market-search" onSubmit={(e) => e.preventDefault()}>
        <Search size={20} />
        <input
          aria-label="Search marketplace"
          placeholder="AI internships near Toronto"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="button small" type="submit">
          Search <ArrowRight size={15} />
        </button>
      </form>
      <p className="fine-print">
        Search matches listing keywords, not your location automatically. All
        opportunities below are fictional demo records.
      </p>
      <div className="market-layout">
        <aside
          ref={drawer}
          role={filters ? "dialog" : undefined}
          aria-modal={filters ? true : undefined}
          aria-label="Opportunity filters"
          className={filters ? "filters show" : "filters"}
        >
          <div className="filter-heading">
            <h2>
              <SlidersHorizontal size={16} />
              Refine your search
            </h2>
            <button className="text-button" onClick={reset}>
              Reset
            </button>
            <button
              className="icon-button mobile-filter"
              aria-label="Close filters"
              onClick={() => setFilters(false)}
            >
              ×
            </button>
          </div>
          {[
            ["Industry", industry, setIndustry, industries],
            [
              "Location",
              location,
              setLocation,
              [...new Set(state.opportunities.map((o) => o.location))],
            ],
            [
              "Work arrangement",
              arrangement,
              setArrangement,
              ["Remote", "Hybrid", "Onsite"],
            ],
            ["Job type", type, setType, ["Internship", "Entry-level"]],
            ["Compensation", paid, setPaid, ["paid", "unpaid"]],
            ["Maximum duration", duration, setDuration, ["3", "4", "6"]],
            [
              "Maximum challenge hours",
              effort,
              setEffort,
              ["2", "3", "4", "8"],
            ],
          ].map(([label, value, setter, options]) => (
            <label key={String(label)}>
              {String(label)}
              <select
                value={String(value)}
                onChange={(e) =>
                  (setter as (v: string) => void)(e.target.value)
                }
              >
                <option value="">Any</option>
                {(options as string[]).map((v) => (
                  <option key={v} value={v}>
                    {v}
                    {label === "Maximum duration"
                      ? " months"
                      : label === "Maximum challenge hours"
                        ? " hours"
                        : ""}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label>
            Minimum hourly pay (CAD)
            <input
              type="number"
              min="0"
              value={minPay}
              onChange={(e) => setMinPay(e.target.value)}
            />
          </label>
          <label>
            Application deadline on or before
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={saved}
              onChange={(e) => setSaved(e.target.checked)}
            />
            Saved opportunities only
          </label>
          <button
            className="button secondary mobile-filter"
            onClick={() => setFilters(false)}
          >
            Show results
          </button>
        </aside>
        <div>
          <div className="results-heading">
            <span>
              <strong>{items.length}</strong> opportunities to explore
            </span>
            <div>
              <button
                className="button secondary small mobile-filter"
                aria-expanded={filters}
                onClick={() => setFilters(!filters)}
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>
              <select
                aria-label="Sort opportunities"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="deadline">Deadline: soonest</option>
                <option value="pay">Pay: highest</option>
                <option value="effort">Effort: shortest</option>
              </select>
            </div>
          </div>
          {!ready ? (
            <Loading />
          ) : items.length ? (
            <div className="cards-grid two">
              {items.map((o) => (
                <OpportunityCard key={o.id} o={o} />
              ))}
            </div>
          ) : (
            <Empty
              title="Your next opportunity may need a wider search."
              description="Try a different keyword or loosen a filter."
            >
              <button className="button secondary" onClick={reset}>
                Clear filters
              </button>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}
export function Details({ id }: { id: string }) {
  const { state, setState, ready, notify } = useStore();
  const o = state.opportunities.find(
    (o) => o.id === id && o.status === "Published",
  );
  if (!ready) return <Loading />;
  if (!o)
    return (
      <div className="container">
        <Empty
          title="Opportunity not found"
          description="This listing may be a draft or may not exist in this demo."
        >
          <Link className="button" href="/marketplace">
            Back to marketplace
          </Link>
        </Empty>
      </div>
    );
  const saved = state.saved.includes(id);
  return (
    <div className="container details">
      <Link className="text-link muted" href="/marketplace">
        <ArrowLeft size={15} />
        Back to marketplace
      </Link>
      <div className="detail-heading">
        <div className="company-icon big">
          {o.company.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <span className="muted">{o.company} · Fictional employer</span>
          <h1>{o.title}</h1>
          <div className="meta">
            <span>
              <MapPin size={14} />
              {o.location}
            </span>
            <span>{o.arrangement}</span>
            <span>{o.type}</span>
            <span>{o.duration} months</span>
          </div>
        </div>
      </div>
      <div className="detail-grid">
        <div>
          <section className="panel">
            <Badge tone="violet">{o.industry}</Badge>
            <h2>The opportunity</h2>
            <p>{o.description}</p>
            <h3>What you’ll bring</h3>
            <p>{o.qualifications}</p>
          </section>
          <section className="panel">
            <p className="eyebrow">YOUR MINI-PROJECT</p>
            <h2>{o.challenge}</h2>
            <p>{o.instructions}</p>
            <div className="inline-callout">
              <Clock size={19} />
              <span>
                Estimated effort: <strong>{o.effort} hours</strong>. Use
                synthetic data. This is a scoped demonstration task.
              </span>
            </div>
            <h3>Required deliverables</h3>
            {o.deliverables.map((d) => (
              <CheckLine key={d}>{d}</CheckLine>
            ))}
            <h3>Permitted tools & AI assistance</h3>
            <p>{o.tools}</p>
            <h3>How employers review</h3>
            <p>{o.criteria}</p>
            <h3>Eligibility requirements</h3>
            <p>{o.eligibility}</p>
            <p className="fine-print">
              Declarations are self-reported unless separately verified. No
              automatic hiring decisions are made.
            </p>
          </section>
          <section className="panel">
            <h2>From submission to a response</h2>
            {[
              "Prepare your work and explanation.",
              "Add your résumé and eligibility declarations.",
              "Submit before the deadline.",
              "Track your application while the employer reviews.",
            ].map((s) => (
              <CheckLine key={s}>{s}</CheckLine>
            ))}
          </section>
        </div>
        <aside className="detail-sidebar">
          <div className="panel sticky">
            <p className="eyebrow">YOUR NEXT FIRST</p>
            <h2>
              {o.paid ? `$${o.pay}/hour` : "Unpaid role"} <small>CAD</small>
            </h2>
            <dl>
              <div>
                <dt>Challenge effort</dt>
                <dd>{o.effort} hours</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{o.duration} months</dd>
              </div>
              <div>
                <dt>Apply by</dt>
                <dd>{o.deadline}</dd>
              </div>
            </dl>
            <Link className="button full" href={"/workspace/" + id}>
              Start challenge <ArrowUpRight size={16} />
            </Link>
            <button
              className="button secondary full"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  saved: saved
                    ? s.saved.filter((s) => s !== id)
                    : [...s.saved, id],
                }));
                notify(saved ? "Removed from saved." : "Saved for later.");
              }}
            >
              <Bookmark size={16} />
              {saved ? "Saved opportunity" : "Save opportunity"}
            </button>
            <div className="commitment">
              <ShieldCheck size={23} />
              <h3>A commitment to review</h3>
              <p>
                We commit to reviewing eligible, complete submissions within{" "}
                <strong>{o.reviewDays} calendar days</strong> of submission.
              </p>
              <small>
                Employer commitment. No interview or employment guarantee.
              </small>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
