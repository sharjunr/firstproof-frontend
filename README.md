# firstproof.

**Prove Your Potential. Earn Your Opportunity.**

An interactive skills-first hiring frontend for UNHACK 2026. Built with Next.js App Router, React, TypeScript, Motion, Lucide, and responsive CSS design tokens.

## Run locally

Install Node.js 24 LTS, open this folder in VS Code, then:

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production: `npm run build` then `npm start`.

## Verify

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

## Demo experience

Open Sign In and choose the fictional student or employer account. The header role selector lets you switch between them. All eight fictional opportunities and linked applications share one store. Changes persist in localStorage on this browser and origin. Actual file bytes are saved in IndexedDB; selected files are never uploaded to a server. Max 8 files per application, 10 MB each. New submissions remain “Not checked”; seeded integrity results are explicitly fictional scenarios.

Search → challenge → workspace → save/resume → submit → tracker. Switch to employer → candidates → shortlist. Switch back to student → tracker to see the same decision. Posting an opportunity adds it to the local marketplace. Drafts do not start a review deadline; submission snapshots the employer’s calendar-day commitment.

## Pages

`/`, `/marketplace`, `/opportunities/[id]`, `/workspace/[id]`, `/tracker`, `/profile`, `/sign-in`, `/sign-up`, `/employer`, `/employer/opportunities`, `/employer/post-opportunity`, `/employer/candidates`, `/employer/settings`.

## Backend boundary

This is a **frontend demo**, not a secure recruitment service. Do not collect real passwords, résumés, or applicant files in demo mode. Real authentication forms are disabled. No backend endpoints, secure uploads, employer verification, or AI similarity checks are claimed. Demo role gates organize the experience; they do not secure data stored in your browser. Employer notes are omitted from the student view, but genuine privacy requires a server.

`lib/api.ts` contains a fetch adapter and proposed endpoint names. Full integration contracts are in `docs/backend-integration.md`. Keep `NEXT_PUBLIC_DATA_MODE=demo` until integration is complete; merely changing this variable does not implement the missing backend. AI must never score, rank, reject, or make hiring decisions.

## Layout and accessibility

Dark violet design, responsive navigation and filters, keyboard-focus styling, labeled forms, native modal dialogs with focus trapping, reduced-motion support, and file-error states. Font loading uses an optional Google Fonts stylesheet with an Arial fallback.

## Ownership and handoff

Repository: https://github.com/sharjunr/firstproof-frontend. Frontend changes are delivered on `feature/firstproof-frontend` through a pull request. No teammate code is included or replaced.
