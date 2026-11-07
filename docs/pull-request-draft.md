# Add the complete FirstProof hiring frontend

Adds the student and employer frontend for the updated skills-first hiring workflow. Students can search fictional opportunities, prepare file/link/text deliverables, save drafts, submit applications, and track review deadlines. Employers can publish local demo opportunities, review candidates, record private notes and clarification requests, and update hiring stages that appear in the student tracker.

Uses shared TypeScript models, explicit browser-local demo state, reusable components, responsive dark violet styling, reduced-motion support, and an API adapter with backend contracts. Real sign-in and secure storage are clearly identified as backend dependencies; no AI grading, candidate ranking, or automatic rejection is implemented.

Validation: production build, TypeScript, lint with zero warnings, and 8 automated workflow tests pass. Browser verification covers saved drafts, all three deliverable interfaces, submission, employer shortlisting, opportunity publishing, and mobile filtering. See docs/verification.md for scope and limitations.
