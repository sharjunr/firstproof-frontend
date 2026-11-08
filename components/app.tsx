"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { StoreProvider } from "./store";
import { EmployerRoiSimulator } from "./employer-roi";
import { EmployerShell } from "./ui";
import { Nav, Footer } from "./ui";
import { Landing, Marketplace, Details } from "./public-pages";
import {
  Workspace,
  Tracker,
  Auth,
  Profile,
  SubmissionSuccess,
} from "./student-pages";
import {
  EmployerDashboard,
  PostOpportunity,
  Candidates,
  EmployerSettings,
} from "./employer-pages";
export function App() {
  const path = usePathname();
  const params = useSearchParams();
  let page;
  if (path === "/") page = <Landing />;
  else if (path === "/marketplace") page = <Marketplace />;
  else if (path.startsWith("/opportunities/"))
    page = <Details id={path.split("/")[2]} />;
  else if (path.startsWith("/workspace/"))
    page = <Workspace id={path.split("/")[2]} />;
  else if (path === "/tracker") page = <Tracker />;
  else if (path === "/submission-success") page = <SubmissionSuccess />;
  else if (path === "/profile") page = <Profile />;
  else if (path === "/sign-in") page = <Auth />;
  else if (path === "/sign-up") page = <Auth register />;
  else if (path === "/employer/post-opportunity")
    page = <PostOpportunity editId={params.get("edit") || undefined} />;
  else if (path === "/employer/candidates")
    page = (
      <Candidates
        applicationId={params.get("application") || undefined}
        flagsOnly={params.get("flags") === "true"}
      />
    );
  else if (path === "/employer/roi") page = <EmployerShell><EmployerRoiSimulator id="employer-roi-dashboard" /></EmployerShell>;
  else if (path === "/employer/settings") page = <EmployerSettings />;
  else if (path === "/employer/opportunities")
    page = <EmployerDashboard onlyOpportunities />;
  else page = <EmployerDashboard />;
  return (
    <StoreProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">{page}</main>
      <Footer />
    </StoreProvider>
  );
}
