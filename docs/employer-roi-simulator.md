# Employer screening ROI simulator

Reusable client-side React component: components/employer-roi.tsx. Calculation/formatting/summary helpers: lib/roi.ts. Located after the For Employers audience section on the landing page, with a direct link in that section and a shortcut from the employer dashboard to /#employer-roi. Dark navy/violet/blue styles are scoped to this module; the existing site layout and theme remain intact.

## Assumptions and formulas

Four keyboard-accessible native range inputs:
- Applicants: 100–2,000, step 100, default 500.
- Current review minutes per applicant: 5–30, step 1, default 8.
- FirstProof review minutes per applicant: 1–30, step 1, default 4.
- Fully loaded reviewer cost: CAD 30–150/hour, step 10, default CAD 60/hour.

Current hours = applicants × current minutes / 60. FirstProof hours = applicants × FirstProof minutes / 60. Hours saved = applicants × (current minutes - FirstProof minutes) / 60. Potential gross labor savings = hours saved × hourly cost. Time reduction = (current minutes - FirstProof minutes) / current minutes × 100. Calculations retain full precision; hours display one decimal and CAD values display whole dollars with thousands separators.

Defaults show 66.7 current hours, 33.3 FirstProof hours, 33.3 hours saved, CAD 2,000 potential gross labor savings and 50% reduction. Negative results are labeled Additional Reviewer Time, Additional Labor Cost and Estimated Screening Time Increase, with an explicit warning. Equal times show zero savings. The comparison bars share a scale and update with the metrics.

Reset restores all four assumptions. Copy ROI Summary writes assumptions, calculated results and the exact disclaimer to the clipboard. A labeled read-only manual-copy field is provided if clipboard access is unavailable. Values are not sent to a server or saved as measured employer performance.

## Transparency

The component displays Illustrative ROI Scenario and the exact requested disclaimer:

This is a scenario calculator, not a measured FirstProof outcome. It excludes challenge creation, detailed technical review, platform fees, and other hiring costs. Actual savings depend on employer workflows and candidate volume.

No testimonials or achieved savings claims are added. This is gross reviewer labor savings, not net profit or a measured ROI percentage.

## Verification

57 tests pass, including six new ROI tests for defaults/rounding, negative time and cost, equal-time zero savings, all valid endpoint combinations, exact copied disclaimer and input ranges/steps. Lint, TypeScript and production build pass.

Browser verification exercised all four sliders through keyboard controls, observed additional time/cost and 0% reduction for equal review times, restored defaults, and confirmed the successful clipboard message. Unit tests independently verify summary contents. Desktop at 1440 px and mobile at 390 px showed no horizontal page overflow. Verified the landing entry link and employer dashboard shortcut. Reduced-motion preferences disable transitions and number animation; sliders have explicit labels, visible outputs and focus rings. Chart text supplies numeric equivalents to the bars.
