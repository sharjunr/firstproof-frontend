import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <p className="eyebrow">FIRSTPROOF · 404</p>
      <h1>This path needs a new direction.</h1>
      <p>We couldn’t find that page.</p>
      <Link className="button" href="/marketplace">
        Explore opportunities
      </Link>
    </main>
  );
}
