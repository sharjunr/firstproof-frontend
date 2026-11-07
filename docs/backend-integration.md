# Backend integration contracts

This frontend currently uses explicit browser-local demo state. No compatible API routes existed in the repository. Nothing below is claimed to be a working server endpoint.

## Shared types

Use `lib/types.ts` for Opportunity, Application, Eligibility, Stage, Integrity, LocalFile, and DemoUser. `lib/model.ts` implements demo transitions and deadline calculations. `lib/api.ts` isolates JSON requests; replace demo-store reads/writes with an authenticated server adapter during integration. The current server-mode flag affects only the auth form scaffold, so do not turn it on for real applicants until all resources are integrated and authorized.

Standard success: `{ "success": true, "data": ... }`.
Standard failure: `{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Readable explanation" } }`.

| Method | Proposed route | Request / response |
|---|---|---|
| POST | /api/auth/register | `{name,email,password,role}` → authenticated user, session cookie |
| POST | /api/auth/sign-in | `{email,password}` → authenticated user, session cookie |
| POST | /api/auth/sign-out | no body → success; revoke session |
| GET | /api/auth/me | user or HTTP 401 |
| GET | /api/opportunities | keyword/filter/pagination query → published opportunities |
| GET | /api/opportunities/:id | public listing only; drafts require employer ownership |
| POST | /api/opportunities | opportunity fields → saved employer-owned draft |
| PATCH | /api/opportunities/:id | changed fields → updated draft or publication |
| GET | /api/applications | student’s own applications; authorized employer’s review queue |
| POST | /api/applications | `{opportunityId}` → private application draft |
| PATCH | /api/applications/:id | draft text, links, declarations, uploaded file references |
| POST | /api/applications/:id/submit | final validation → persisted submission + snapshotted reviewDue |
| POST | /api/applications/:id/withdraw | owner action → Withdrawn + history |
| POST | /api/uploads | authenticated multipart `file`, `applicationId` → private file ID and metadata |
| GET | /api/uploads/:id | authorized attachment download, no public URL |
| PATCH | /api/applications/:id/review | `{stage,notes,followUp,clarification}` → authorized review update |
| GET | /api/applications/:id/integrity | checks actually run, limitations, neutral flags |
| POST | /api/applications/:id/integrity/review | human review resolution; no automatic hiring mutation |

Example adapter call:

```ts
import {api} from '../lib/api';
import type {Application} from '../lib/types';
const result = await api<Application>(`/applications/${id}/submit`, {
  method: 'POST', body: JSON.stringify({})
});
```

Uploads need FormData with no manually set Content-Type. The JSON helper must not be used unchanged for multipart bodies.

## Required server guarantees

Authenticate requests, check object ownership/organization permissions, protect cookie mutations against CSRF, validate input and URL schemes, enforce upload limits, store file bytes durably, and exclude private employer notes from student responses. Use attachment delivery and do not execute uploaded code. Do not automatically fetch arbitrary project URLs. Preserve application snapshots, declarations, status history, and original review deadlines. Repeated submission must not duplicate applications or reset deadlines. Seeded demo integrity states must never be substituted for real analysis results.

Real sign-in also needs password recovery, email verification policy, abuse protection, session expiry, and secure credential handling. Employer verification is separate from registration. Shared demo role switching must never authorize access to real user records.

## Review semantics

Review deadline = final submission timestamp + selected calendar days (24-hour increments). Drafts do not start the clock. Editing a listing does not change existing deadlines. In this demo, Under Employer Review means review started; Shortlisted, Invited to Next Stage, and Declined record completed review. Withdrawn applications are not overdue. A status history entry explains each employer/student change.

## Known demo limits

No email is sent; clarification requests update only the local tracker. Files can be downloaded only on the same browser/origin where saved. Local storage can be cleared or modified by a user. Notes are private in the rendered student interface only. Fictional GitHub project links are sample placeholders and may not resolve. Eligibility booleans are declarations, never verified decisions. The demo requires all declarations before submission; a production needs-info/clarification path should be agreed with the team.
