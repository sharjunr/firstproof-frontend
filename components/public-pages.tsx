"use client";
import {EmployerRoiSimulator} from "./employer-roi";
import {ChallengeBrief,RoleDetails} from "./challenge-brief";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Users as UsersIcon,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Search,
  Code2,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Bookmark,
  ArrowLeft,
} from "lucide-react";
import { useStore } from "./store";
import {
  Badge,
  Heading,
  OpportunityCard,
  CompanyLogo,
  industries,
  Empty,
  Loading,
} from "./ui";
import { searchOpportunities, publicOpportunityView } from "../lib/model";

export function Landing() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const { state, login } = useStore();
  return (
    <>
      <section className="hero editorial-hero">
        <motion.div
          className="hero-content"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1>
            Your Potential Deserves
            <br />
            <span>a First Chance.</span>
          </h1>
          <p>
            Find real employer challenges. Compete with students, Unlock Careers
          </p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/marketplace?q=" + encodeURIComponent(query));
            }}
          >
            <button
              type="button"
              className="search-help"
              aria-label="Browse suggested searches"
              onClick={() =>
                document
                  .getElementById("suggested-searches")
                  ?.scrollIntoView({ block: "center", behavior: "smooth" })
              }
            >
              <Plus size={23} />
            </button>
            <input
              aria-label="Search opportunities"
              placeholder="Describe the opportunity you’re looking for…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button aria-label="Explore opportunities" type="submit">
              <ArrowRight size={21} />
            </button>
          </form>
          <div className="suggestions career-links" id="suggested-searches">
            {[
              {
                label: "AMD · Digital Design / RTL FIFO",
                href: "/opportunities/ai-developer",
              },
              {
                label: "RBC · Financial Analyst (DCF & Valuation)",
                href: "/opportunities/business-analyst",
              },
              {
                label: "Deloitte · CPA Audit & Assurance",
                href: "/opportunities/marketing",
              },
              {
                label: "Skyworks · RF S-Parameter Analysis",
                href: "/opportunities/frontend-developer",
              },
              {
                label: "NVIDIA · Matrix Multiplication Optimization",
                href: "/opportunities/electrical-engineer",
              },
            ].map(({ label, href }) => (
              <Link key={label} href={href}>
                {label}
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="principle-strip">
        <span>CORE PRODUCT RULE</span>
        <strong>Role-specific work samples.</strong>
        <strong>Starter datasets & specs included.</strong>
        <strong>Human review—never automated AI grading.</strong>
        <span>FICTIONAL DEMO LISTINGS</span>
      </section>
      <section className="section flow-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">HOW FIRSTPROOF WORKS</p>
            <h2>
              Don’t just tell employers what you can do.
              <br />
              Show them.
            </h2>
          </div>
          <p>
            Forget endless applications and generic coding tests. FirstProof
            lets you prove your skills through real challenges inspired by the
            jobs you want.
          </p>
        </div>
        <div className="process-three">
          {[
            {
              n: "01",
              title: "Find Your Challenge",
              lead: "Choose a challenge that matches your dream job.",
              text: "Explore exciting challenges from employers in software, AI, engineering, and more. Pick a role that interests you and see what the job is really like.",
              icon: Search,
            },
            {
              n: "02",
              title: "Show What You’ve Got",
              lead: "Solve real problems. Build real skills.",
              text: "Put your knowledge to work on a hands-on challenge. Create something meaningful, show your thinking, and submit your solution.",
              icon: Code2,
            },
            {
              n: "03",
              title: "Get Noticed. Get Hired.",
              lead: "Let your skills open doors.",
              text: "Employers review your work based on clear criteria, giving you a chance to stand out, receive feedback, and unlock potential job opportunities.",
              icon: UsersIcon,
            },
          ].map(({ n, title, lead, text, icon: Icon }) => (
            <article key={n}>
              <div>
                <span>{n}</span>
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>
                <strong>{lead}</strong> {text}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              FICTIONAL EMPLOYER DEMONSTRATIONS · NOT AFFILIATED WITH LISTED COMPANIES
            </p>
            <h2>Realistic daily tasks. Three hours or less.</h2>
          </div>
          <Link className="text-link" href="/marketplace">
            Explore all {state.opportunities.filter(o=>o.status==="Published").length} opportunities <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="cards-grid">
          {state.opportunities
            .filter((o) => o.status === "Published")
            .slice(0, 6)
            .map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
        </div>
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
          <Link className="text-link" href="/tracker" onClick={()=>login("student")}>
            Open your student workspace <ArrowUpRight size={17} />
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
          <Link className="text-link" href="/employer" onClick={()=>login("employer")}>
            Open your employer workspace <ArrowUpRight size={17} />
          </Link>
          <Link className="text-link roi-entry-link" href="#employer-roi" onClick={e=>{e.preventDefault();window.history.replaceState(null,"","#employer-roi");document.getElementById("employer-roi")?.scrollIntoView({block:"start",behavior:"instant"});}}>Estimate screening time and cost <ArrowUpRight size={17}/></Link>
        </article>
      </section>
      <EmployerRoiSimulator/>
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
    [arrangement, setArrangement] = useState(params.get("arrangement") || ""),
    [type, setType] = useState(params.get("type") || ""),
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
    setArrangement(params.get("arrangement") || "");
    setType(params.get("type") || "");
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
        description="Explore work samples across business, arts, engineering, science, health, and more. Find a challenge that matches your interests."
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
        Search matches listing keywords. Choose a location in the filters to find opportunities near you.
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
              ["1.5", "2", "2.5", "3"],
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
              <strong>{items.length}</strong> opportunities ·{" "}
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
  const source = state.opportunities.find(
    (o) => o.id === id && o.status === "Published",
  );
  const o = source ? publicOpportunityView(source) : undefined;
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
        <CompanyLogo company={o.company} big />
        <div>
          <div className="detail-company-line">
            <span className="muted">{o.company}</span>
            <Badge tone="warning">
              Fictional Demo — Not affiliated with {o.company}
            </Badge>

          </div>
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
          <section className="panel project-spotlight"><ChallengeBrief opportunity={o}/></section>
          <RoleDetails opportunity={o}/>

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
              Join challenge <ArrowUpRight size={16} />
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
