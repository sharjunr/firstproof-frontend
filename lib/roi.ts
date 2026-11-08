export interface RoiInputs {applicants:number;currentMinutes:number;firstProofMinutes:number;hourlyCost:number;}
export const ROI_DEFAULTS:Readonly<RoiInputs>={applicants:500,currentMinutes:8,firstProofMinutes:4,hourlyCost:60};
export const ROI_DISCLAIMER='This is a scenario calculator, not a measured FirstProof outcome. It excludes challenge creation, detailed technical review, platform fees, and other hiring costs. Actual savings depend on employer workflows and candidate volume.';
export const ROI_CONTROLS=[
 {key:'applicants',label:'Number of applicants',min:100,max:2000,step:1},
 {key:'currentMinutes',label:'Minutes per applicant — Current process',min:5,max:30,step:1},
 {key:'firstProofMinutes',label:'Minutes per applicant — FirstProof',min:1,max:30,step:1},
 {key:'hourlyCost',label:'Fully loaded reviewer cost per hour',min:30,max:150,step:1},
] as const;
export function calculateRoi(input:RoiInputs){
 for(const c of ROI_CONTROLS){const value=input[c.key];if(!Number.isFinite(value)||value<c.min||value>c.max||Math.abs((value-c.min)/c.step-Math.round((value-c.min)/c.step))>1e-8)throw new Error(`Invalid ${c.label.toLowerCase()} assumption.`);}
 const currentHours=input.applicants*input.currentMinutes/60;
 const firstProofHours=input.applicants*input.firstProofMinutes/60;
 const hoursSaved=input.applicants*(input.currentMinutes-input.firstProofMinutes)/60;
 return {currentHours,firstProofHours,hoursSaved,grossSavings:hoursSaved*input.hourlyCost,timeReductionPercent:(input.currentMinutes-input.firstProofMinutes)/input.currentMinutes*100};
}
const number=new Intl.NumberFormat('en-CA',{minimumFractionDigits:1,maximumFractionDigits:1});
const currency=new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0,minimumFractionDigits:0});
export const formatHours=(n:number)=>number.format(n);
export const formatCad=(n:number)=>currency.format(n)+' CAD';
export const formatPercent=(n:number)=>new Intl.NumberFormat('en-CA',{maximumFractionDigits:1}).format(n)+'%';
export function roiSummary(input:RoiInputs){const r=calculateRoi(input);const additional=r.hoursSaved<0;return [
 'FirstProof — Illustrative ROI Scenario',
 '',
 `Applicants: ${new Intl.NumberFormat('en-CA').format(input.applicants)}`,
 `Current process: ${input.currentMinutes} minutes per applicant`,
 `FirstProof: ${input.firstProofMinutes} minutes per applicant`,
 `Fully loaded reviewer cost: ${formatCad(input.hourlyCost)}/hour`,
 '',
 `Current screening time: ${formatHours(r.currentHours)} hours`,
 `FirstProof screening time: ${formatHours(r.firstProofHours)} hours`,
 additional?`Additional reviewer time: ${formatHours(Math.abs(r.hoursSaved))} hours (signed hours saved: ${formatHours(r.hoursSaved)})`:`Reviewer hours saved: ${formatHours(r.hoursSaved)} hours`,
 additional?`Additional labor cost: ${formatCad(Math.abs(r.grossSavings))} (signed gross labor savings: ${formatCad(r.grossSavings)})`:`Potential gross labor savings: ${formatCad(r.grossSavings)}`,
 `Estimated screening time ${additional?'increase':'reduction'}: ${formatPercent(Math.abs(r.timeReductionPercent))}`,
 '',ROI_DISCLAIMER,
 ].join('\n');}
