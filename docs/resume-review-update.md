# Resume and challenge review update

Reviewed and approved for delivery to feature/firstproof-frontend. Preserves the newer slate-and-blue palette update.

Adds PDF/Word resume selection after an invitation and a pending employer request, a 5 MB limit, empty-file/type/header checks, explicit consent, and a local submission confirmation. Employer download is available only through the consented next-stage projection. Initial applications never show resume upload. These browser checks are not a malware scanner; secure server storage, authorization and server-side document validation are still required.

Uses resume without accents, expands the 88 role descriptions and project briefs, highlights mini-project deliverables and time limits, and explains that submissions may be reviewed alongside other applicants without fabricated counts or rankings. The eight original challenges now include concrete starter inputs. Repeated fictional-employer labels are removed; a single footer notice identifies example listings. AI review is labeled Coming soon, not connected.

Verification: 22 tests pass and production build/TypeScript pass. Browser testing completed employer invitation/request, PDF file selection, consent and saved confirmation.
