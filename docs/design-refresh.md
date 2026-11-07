# FirstProof design refresh

Replaces the dark violet presentation with warm off-white surfaces, dark ink typography, a cobalt accent, and a split editorial homepage. A working featured challenge appears beside search. The introduction uses three concise steps, followed by opportunities, student/employer sections, and the review commitment.

Shared styling covers marketplace cards, filters, student forms and tracker, employer dashboards, candidate reviews, demo sign-in, and modal dialogs. Existing application logic, persistence, eligibility handling, and human decision workflows are preserved. Reduced-motion rules remain enabled.

Verification for this change: lint passed; all eight existing automated workflow tests passed; production build and its TypeScript checks passed. Browser inspection confirmed the new homepage and Marketing challenge details. Final screenshot capture and further mobile visual checks were unavailable because automatic browser approval review reached a usage limit.
