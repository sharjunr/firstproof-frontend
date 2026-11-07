# Local review preview — November 7, 2026

This document describes the reviewed frontend update. Delivery uses feature/firstproof-frontend and its existing pull request.

## Updated experience

The homepage includes five suggested-search links, the revised career headline copy, and a single persistent fictional-listings preview notice instead of repeated sample-employer labels. Private sample solutions and solution files are optional.

- Clean white and blue homepage with conversational search and no challenge illustration.
- 88 sample opportunities across 20 fields remain available.
- Registration preview collects name and email. Initial applications contain name, email and submitted project work; no résumé, school, GPA or employment-history inputs.
- Employers see applicant name and email. After shortlisting or advancing an applicant, they can request optional next-stage background information. The applicant can share selected résumé/education text with explicit consent, or decline. Requests alone reveal no background.
- Employers can author weighted rubrics, upload public starter resources and private evaluation files, add a reference solution, and set a completion window. Published criteria must total 100%.
- Local completeness preflight checks explanation, deliverables and rubric readiness. AI scoring is explicitly not connected.

## Preview boundaries

Data and files live in this browser only. Role switching is a demonstration, not authorization. A secure backend must enforce all employer ownership, file access and consent checks before using real applicant information. Private evaluation materials are hidden from student components, but browser storage is not secure storage.

Preview registration does not create a secure account, verify email, or save passwords. Real authentication forms remain disabled until an authentication backend is connected. No real messages or email notifications are sent. No AI ranking, quality score or originality assessment is generated.

## Validation

20 automated tests passed, including first-stage visibility, consent, guarded employer requests, private-material projection, weighted rubrics, challenge windows and migration of legacy demo data. Lint and the production build passed. Browser checks confirmed name/email visibility, an employer next-stage request, and the applicant consent dialog.

Run locally with Node.js LTS: npm install, npm run dev. The reviewed production preview uses npm run build followed by npm start -- --port 3013.
