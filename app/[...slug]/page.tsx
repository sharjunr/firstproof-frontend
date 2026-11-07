import { Suspense } from "react";
import { notFound } from "next/navigation";
import { App } from "../../components/app";
const routes = [
  "marketplace",
  "tracker",
  "profile",
  "submission-success",
  "sign-in",
  "sign-up",
  "employer",
  "employer/opportunities",
  "employer/candidates",
  "employer/post-opportunity",
  "employer/settings",
];
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join("/");
  if (
    !routes.includes(path) &&
    !(slug.length === 2 && ["opportunities", "workspace"].includes(slug[0]))
  )
    notFound();
  return (
    <Suspense fallback={<div className="loading">Loading FirstProof…</div>}>
      <App />
    </Suspense>
  );
}
