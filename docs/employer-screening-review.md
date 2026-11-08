# Employer screening — local review delivery

The user approved GitHub delivery after local review. Deliver on feature/employer-screening, preserving the newer role-specific challenges and starter materials. The document named dheeranshankar-del/FirstProof---UNHack-2026; read-only inspection found only README.md on its default branch. Implementation therefore extends the working FirstProof frontend reviewed in this chat, preserving the homepage, search, role catalog and existing resume/consent flows.

## Implemented locally

- Optional employer-authored mandatory screening rules in the existing challenge editor, with validation, correction policy and HR capacity.
- Existing weighted quality rubrics reused. Published instructions, tools, deliverables, resources, sample solutions, deadlines and screening policy are locked once an applicant starts. Each new application captures a deep snapshot of the applicable policy and rubric.
- Deterministic checks against submitted JSON artifacts: JSON format/type, exact expected values (object key order independent), and numeric artifact values; required attachment filenames/presence. These are not evidence of execution, runtime efficiency, memory use, model accuracy or authorship.
- Published objective failures produce Not Qualified — Mandatory Requirements Not Met, with test-specific evidence. Unsupported, unavailable or inconclusive tests go to manual technical review. Technical outcomes remain separate from recruitment outcomes.
- Separate human quality review with five outcomes, evidence requirements, published-rubric references and reviewer history. Passing checks never auto-shortlists. Human HR selection requires qualification, a favorable quality review, selection evidence and available capacity. Direct shortlist/invite actions cannot bypass this for screened applications.
- Student reports, allowed corrections/resubmissions (including added attachments), deadline enforcement, test/accessibility review requests, and authorized employer corrections. Previous reports and decision history remain available; corrected technical outcomes invalidate prior quality/HR selections.
- Accurate queue metrics and filters. Legacy submissions without published rules are explicitly identified and never retroactively qualified or rejected.
- A separately created, opt-in safe fixture challenge demonstrates mandatory failure, basic/exceptional quality assessments, HR selection and unavailable tests. It does not modify existing employer requirements. Student preview account can correct its failed fixture submission.

## Review instructions

Open http://localhost:3019/employer/candidates. Choose the employer preview account if prompted. The review browser already contains safe fixtures from verification. Use Screening queue to inspect technical/manual/quality/HR categories. The student preview tracker contains the fixture application and its technical history. Existing challenges have no new requirements added to them; create a new challenge to author screening rules.

## Explicit backend blockers

This app has no authenticated application API, database or authorization service. Browser role guards and localStorage are not security boundaries. This delivery is the safe local-preview fallback requested in section 9, not production screening. All storage, reports, reviewer identity and permissions must move behind authenticated, server-enforced endpoints before real applicant use. A student who controls browser storage can change local records.

No uploaded code or external project links are executed or fetched. Production runtime/performance/memory testing requires a separate isolated worker environment with resource/network limits and trustworthy evidence. Do not run candidate code in the web application server. Virus/content scanning, durable private file storage and signed downloads are still required. JSON numeric output checks cannot validate a candidate's self-reported benchmark.

Human technical/quality/HR reviewers currently share the employer preview role. Real reviewer assignment and HR-only permissions require server role assignments. Resume access still requires the existing applicant consent and next-stage request; screening does not override it. No AI quality assessment or final automated hiring decision is implemented.

A future API should derive the actor from the server session, validate challenge ownership and reviewer assignment, enforce immutable policy versions and deadlines transactionally, store append-only reports/reviews, and enforce HR capacity atomically. Never trust client-supplied reports, technical outcomes, reviewer IDs or snapshot contents. Corrections should version the submission artifacts and invalidate affected reviews.

## Verification

36 automated tests pass after integrating the latest teammate code. Lint, production build and TypeScript pass. Tests cover all six requested scenarios, ownership/role guards, rule snapshots, forbidden retroactive edits, manual/inconclusive outcomes, missing files and correction deadlines, separate human reviews, HR capacity and actual queue counts. Browser checks confirmed fixture reports/counts, manual routing for an unavailable checker, saving evidence-backed quality assessment, student failure details and corrected resubmission to quality-review pending. Existing catalog/search/application/resume tests remain passing. A migration regression test verifies that started screening policies and new engineering constraints remain frozen. GitHub delivery was authorized after review.
