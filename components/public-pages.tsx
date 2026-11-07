"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Users as UsersIcon,
  ArrowRight,
  ArrowUpRight,
  Search,
  Code2,
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
  const { state } = useStore();
  const featured = state.opportunities.find((o) => o.status === "Published");
  return (
    <>
      <section className="hero editorial-hero">
        <motion.div
          className="hero-content"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow">
            <span className="edition-dot" />
            THE FIRST CHAPTER OF YOUR CAREER
          </p>
          <h1>
            Less experience.
            <br />
            More <span>possibility.</span>
          </h1>
          <p>
            You’re more than the jobs you’ve already had. Show employers what
            you can do with a small, practical challenge.
          </p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/marketplace?q=" + encodeURIComponent(query));
            }}
          >
            <Search size={20} />
            <input
              aria-label="Search opportunities"
              placeholder="AI internships near Toronto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button aria-label="Explore opportunities" type="submit">
              <ArrowRight size={21} />
            </button>
          </form>
          <div className="suggestions">
            <span>START WITH</span>
            {[
              "AI internships",
              "Business challenges",
              "Engineering projects",
            ].map((s) => (
              <Link key={s} href={"/marketplace?q=" + encodeURIComponent(s)}>
                {s}
                <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
          <div className="hero-proof">
            <span>
              <Check size={14} />
              Short, scoped projects
            </span>
            <span>
              <Check size={14} />
              Reviewed by people
            </span>
          </div>
        </motion.div>
        <div className="proof-scene">
          <div className="scene-caption">
            <span>YOUR POTENTIAL, IN PRACTICE</span>
            <span>01 / FIRSTPROOF</span>
          </div>
          <div className="scene-sheet">
            <div className="sheet-top">
              <span className="sheet-symbol">
                <Code2 size={22} />
              </span>
              <Badge>FICTIONAL DEMO</Badge>
            </div>
            <p className="eyebrow">
              A SMALL PROJECT. A DIFFERENT FIRST IMPRESSION.
            </p>
            <h2>{featured?.challenge || "Put your skills to work."}</h2>
            <p>
              {featured?.instructions ||
                "Discover a challenge and make your approach tangible."}
            </p>
            <div className="sheet-flow">
              <div>
                <Check size={15} />
                <span>Build something small</span>
              </div>
              <div>
                <Check size={15} />
                <span>Explain your thinking</span>
              </div>
              <div>
                <ShieldCheck size={15} />
                <span>Reach a human reviewer</span>
              </div>
            </div>
            <div className="sheet-footer">
              <div>
                <strong>{featured?.title || "Your next opportunity"}</strong>
                <span>
                  {featured?.company || "FirstProof"} · Fictional employer
                </span>
              </div>
              <Link
                href={
                  featured ? "/opportunities/" + featured.id : "/marketplace"
                }
                aria-label="Open featured challenge"
              >
                <ArrowUpRight size={22} />
              </Link>
            </div>
          </div>
          <div className="scene-note">
            <span className="note-icon">
              <Clock size={19} />
            </span>
            <div>
              <strong>Your time deserves a response.</strong>
              <span>A published review commitment on every challenge.</span>
            </div>
          </div>
          <div className="scene-index">
            <span>LEARN BY DOING. GET SEEN FOR IT.</span>
            <span>↗</span>
          </div>
        </div>
      </section>
      <section className="principle-strip">
        <span>A BETTER WAY TO GET STARTED</span>
        <strong>Real work samples.</strong>
        <strong>Clear expectations.</strong>
        <strong>Human decisions.</strong>
        <span>THAT’S FIRSTPROOF.</span>
      </section>
      <section className="section flow-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW IT COMES TOGETHER</p>
            <h2>
              From “give me a chance”
              <br />
              to “here’s what I made.”
            </h2>
          </div>
          <p>
            No mystery process. Just a focused project and a clear next step.
          </p>
        </div>
        <div className="process-three">
          {[
            {
              n: "01",
              title: "Find your kind of work.",
              text: "Explore employer-created challenges connected to internships and entry-level roles.",
              icon: Search,
            },
            {
              n: "02",
              title: "Make your potential tangible.",
              text: "Complete a short project. Share files, links, or your work directly, with an explanation.",
              icon: Code2,
            },
            {
              n: "03",
              title: "Let your work meet a person.",
              text: "Employers review your submission. Follow your application and its review deadline.",
              icon: UsersIcon,
            },
          ].map(({ n, title, text, icon: Icon }) => (
            <article key={n}>
              <div>
                <span>{n}</span>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SMALL PROJECTS. OPEN POSSIBILITIES.</p>
            <h2>Your next chapter could start here.</h2>
          </div>
          <Link className="text-link" href="/marketplace">
            Explore all opportunities <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="cards-grid">
          {state.opportunities
            .filter((o) => o.status === "Published")
            .slice(0, 3)
            .map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
        </div>
        <p className="fine-print">
          All listings are fictional demo opportunities. No employer
          partnerships or active vacancies are implied.
        </p>
      </section>
      <section className="section audience">
        <article id="students">
          <span className="audience-number">FOR THE NEXT GENERATION</span>
          <h2>
            Your first role shouldn’t
            <br />
            need a previous one.
          </h2>
          <p>
            Find a starting point that values your approach, your curiosity, and
            the work you can show.
          </p>
          <Link className="text-link" href="/marketplace">
            Find your first opportunity <ArrowUpRight size={17} />
          </Link>
        </article>
        <article id="employers">
          <span className="audience-number">FOR EMPLOYERS WHO LOOK CLOSER</span>
          <h2>
            Discover the person
            <br />
            behind the potential.
          </h2>
          <p>
            Post a focused challenge. Review tangible work. Give someone their
            first meaningful opportunity.
          </p>
          <Link className="text-link" href="/employer">
            Open your employer workspace <ArrowUpRight size={17} />
          </Link>
        </article>
      </section>
      <section className="section promise-section">
        <div className="promise-symbol">
          <ShieldCheck size={48} />
        </div>
        <div>
          <p className="eyebrow">THE REVIEW COMMITMENT</p>
          <h2>Because effort deserves a response.</h2>
          <p>
            See the employer’s review timeframe before starting. Track the
            deadline after submitting. Every hiring decision stays with a human.
          </p>
          <small>
            A commitment to review eligible, complete submissions—not a
            guarantee of an interview or job.
          </small>
        </div>
        <Link className="button" href="/sign-in">
          Try the full demo <ArrowRight size={16} />
        </Link>
      </section>
      <section className="section final-cta">
        <p className="eyebrow">PROVE YOUR POTENTIAL. EARN YOUR OPPORTUNITY.</p>
        <h2>
          Everyone starts somewhere.
          <br />
          <span>Start with proof.</span>
        </h2>
        <div>
          <Link className="button" href="/marketplace">
            Find a challenge <ArrowUpRight size={17} />
          </Link>
          <Link className="button secondary" href="/employer/post-opportunity">
            Create an opportunity <ArrowUpRight size={17} />
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
  const [major, setMajor] = useState("");
  const [page, setPage] = useState(1);
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
  useEffect(
    () => setPage(1),
    [
      q,
      industry,
      major,
      location,
      arrangement,
      type,
      paid,
      minPay,
      duration,
      effort,
      deadline,
      saved,
      sort,
    ],
  );
  const items = searchOpportunities(state.opportunities, q)
    .filter(
      (o) =>
        (!industry || o.industry === industry) &&
        (!major || o.majors?.includes(major)) &&
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
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  function changePage(next: number) {
    setPage(next);
    document
      .getElementById("marketplace-results")
      ?.scrollIntoView({ block: "start" });
  }
  function reset() {
    setMajor("");
    setPage(1);
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
        description="Explore work samples across business, arts, engineering, science, health, and more. Every listing is a fictional demo opportunity."
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
      <div className="industry-shortcuts" aria-label="Browse broad fields">
        {[
          "Software & AI",
          "Business & Finance",
          "Arts & Culture",
          "Engineering",
          "Health & Life Sciences",
          "Education",
          "Science & Research",
        ].map((field) => (
          <button
            key={field}
            aria-pressed={industry === field}
            onClick={() => {
              setQ("");
              setMajor("");
              setIndustry(industry === field ? "" : field);
            }}
          >
            {field}
          </button>
        ))}
      </div>
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
              "Major / study area",
              major,
              setMajor,
              [
                ...new Set(state.opportunities.flatMap((o) => o.majors || [])),
              ].sort(),
            ],
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
          <div className="results-heading" id="marketplace-results">
            <span>
              <strong>{items.length}</strong> demo opportunities ·{" "}
              {new Set(state.opportunities.map((o) => o.industry)).size} fields
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
              {visibleItems.map((o) => (
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
          {ready && items.length > 0 && (
            <nav
              className="result-pagination"
              aria-label="Marketplace result pages"
            >
              <span aria-live="polite">
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, items.length)} of{" "}
                {items.length}
              </span>
              <div>
                <button
                  className="button secondary small"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  className="button secondary small"
                  disabled={currentPage === pageCount}
                  onClick={() => changePage(currentPage + 1)}
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </nav>
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
            {o.majors?.length ? (
              <div className="major-list">
                <span>RELEVANT STUDY AREAS</span>
                {o.majors.map((m) => (
                  <Badge key={m}>{m}</Badge>
                ))}
              </div>
            ) : null}
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
