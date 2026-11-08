import type { Application, Opportunity, Store } from './types';
export type RuleKind = 'file-required'|'json-equals'|'json-type'|'json-number'|'manual';
export interface TechnicalRule { id:string; label:string; kind:RuleKind; path?:string; expected?:string; min?:number; max?:number; }
export interface ScreeningPolicy { version:1; rules:TechnicalRule[]; allowResubmission:boolean; hrCapacity:number; }
export interface ScreeningSnapshot { policy:ScreeningPolicy; rubric:NonNullable<Opportunity['rubric']>; deadline:string; challengeDays:number; frozenAt:string; }
export interface CheckResult { ruleId:string; label:string; outcome:'passed'|'failed'|'manual'; evidence:string; }
export interface TechnicalReport { id:string; at:string; outcome:'qualified'|'failed'|'manual'; checks:CheckResult[]; reason:string; automatic:boolean; actor:string; }
export type QualityOutcome = 'Exceptional Solution'|'Strong Solution'|'Meets Requirements'|'Needs Further Review'|'Does Not Meet Human Review Criteria';
export const qualityOutcomes:QualityOutcome[]=['Exceptional Solution','Strong Solution','Meets Requirements','Needs Further Review','Does Not Meet Human Review Criteria'];
export interface QualityReview { outcome:QualityOutcome; evidence:string; criterionId:string; reportId:string; reviewer:string; at:string; }
export interface ScreeningRecord { reports:TechnicalReport[]; qualityReviews:QualityReview[]; advancedToHR?:{at:string; reviewer:string; evidence:string}; events:{at:string;actor:string;message:string}[]; }
export function policyError(p?:ScreeningPolicy){
 if(!p)return '';
 if(p.version!==1 || !Number.isInteger(p.hrCapacity)||p.hrCapacity<1||p.hrCapacity>1000)return 'HR capacity must be a whole number from 1 to 1000.';
 if(!p.rules.length||p.rules.length>30)return 'Publish 1–30 mandatory technical requirements.';
 if(new Set(p.rules.map(r=>r.id)).size!==p.rules.length)return 'Requirement IDs must be unique.';
 for(const r of p.rules){
  if(!r.id || r.label.trim().length<5)return 'Give every requirement a clear label of at least 5 characters.';
  if(!['file-required','json-equals','json-type','json-number','manual'].includes(r.kind))return 'Unsupported requirement type.';
  if(r.kind.startsWith('json-')&&!/^\$(\.[a-zA-Z0-9_-]+)*$/.test(r.path||''))return 'JSON paths must use $ or $.field.subfield.';
  if(r.kind==='file-required'&&(!r.expected?.trim()||/[\\/]/.test(r.expected)))return 'A required file needs a filename, without a folder path.';
  if(r.kind==='json-equals'){try{JSON.parse(r.expected||'');}catch{return 'Expected output must be valid JSON.';}}
  if(r.kind==='json-type'&&!['object','array','string','number','boolean'].includes(r.expected||''))return 'Choose object, array, string, number, or boolean.';
  if(r.kind==='json-number' && ((r.min===undefined&&r.max===undefined)||[r.min,r.max].some(v=>v!==undefined&&!Number.isFinite(v))||(r.min!==undefined&&r.max!==undefined&&r.min>r.max)))return 'Set a valid numeric minimum or maximum.';
 }
 return '';
}
export function freezeScreening(o:Opportunity,at=new Date().toISOString()):ScreeningSnapshot|undefined{
 if(!o.screeningPolicy)return undefined;
 const error=policyError(o.screeningPolicy);if(error)throw new Error(error);
 if(!o.rubric?.length)throw new Error('Publish the quality rubric before enabling screening.');
 return JSON.parse(JSON.stringify({policy:o.screeningPolicy,rubric:o.rubric,deadline:o.deadline,challengeDays:o.challengeDays||7,frozenAt:at}));
}
const latest=(a:Pick<Application,"screening">)=>a.screening?.reports.at(-1);
export {latest as latestTechnical};
export function currentQuality(a:Pick<Application,"screening">){const q=a.screening?.qualityReviews.at(-1);return q?.reportId===latest(a)?.id?q:undefined;}
function owner(s:Store,id:string){const a=s.applications.find(x=>x.id===id);const o=s.opportunities.find(x=>x.id===a?.opportunityId);if(!a||!o||s.user?.role!=='employer'||o.owner!==s.user.id)throw new Error('Only the responsible employer reviewer can perform this action.');if(['Draft','Withdrawn'].includes(a.stage))throw new Error('This application is not available for review.');return a;}
function replace(s:Store,a:Application){return {...s,applications:s.applications.map(x=>x.id===a.id?a:x)};}
function record(a:Application):ScreeningRecord{return a.screening||{reports:[],qualityReviews:[],events:[]};}
function sameJSON(a:unknown,b:unknown):boolean{if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object')return false;if(Array.isArray(a)!==Array.isArray(b))return false;const aa=a as Record<string,unknown>,bb=b as Record<string,unknown>;const keys=Object.keys(aa).sort();return JSON.stringify(keys)===JSON.stringify(Object.keys(bb).sort())&&keys.every(k=>sameJSON(aa[k],bb[k]));}
function valueAt(data:unknown,path:string){let v=data;for(const key of path.split('.').slice(1)){if(!v||typeof v!=='object'||!Object.prototype.hasOwnProperty.call(v,key))return undefined;v=(v as Record<string,unknown>)[key];}return v;}
export function evaluateTechnical(a:Application,now=new Date(),unavailableReason?:string):Application{
 const snap=a.screeningSnapshot;if(!snap)return a;
 const invalid=policyError(snap.policy);let data:unknown;let parsed=true;
 try{if((a.screeningPayload||'').length>100000)throw Error();data=JSON.parse(a.screeningPayload||'');}catch{parsed=false;}
 const checks:CheckResult[]=snap.policy.rules.map(r=>{
  let outcome:CheckResult['outcome']='manual',evidence='Requires human verification; no uploaded code or external link was executed.';
  if(unavailableReason)return {ruleId:r.id,label:r.label,outcome,evidence:unavailableReason};
  if(invalid)return {ruleId:r.id,label:r.label,outcome,evidence:'Published policy is invalid. An authorized reviewer must investigate.'};
  if(r.kind==='file-required'){
   // Local metadata presence is the supported check; it makes no assertion about file contents.
   const matching=a.files.filter(f=>f.name===r.expected);const found=matching.find(f=>f.stored&&f.size>0)||matching[0];outcome=found&&!found.stored?'manual':found&&found.size>0?'passed':'failed';evidence=outcome==='manual'?'Attachment storage is unavailable; a reviewer must verify the file.':outcome==='passed'?`Non-empty stored attachment named ${r.expected} is present. Contents have not been assessed.`:`Required non-empty attachment ${r.expected} was not supplied.`;
  } else if(r.kind.startsWith('json-')){
   if(!parsed){outcome=r.kind==='json-type'&&r.path==='$'?'failed':'manual';evidence=outcome==='failed'?'The published JSON-format requirement failed: the submitted artifact is not valid JSON.':'No readable JSON artifact is available. This result is inconclusive.';}
   else {const value=valueAt(data,r.path||'$');
    if(r.kind==='json-equals'){outcome=sameJSON(value,JSON.parse(r.expected!))?'passed':'failed';evidence=`Submitted artifact field ${r.path} ${outcome==='passed'?'matches':'does not match'} the published expected JSON value ${r.expected}.`;}
    if(r.kind==='json-type'){const type=Array.isArray(value)?'array':value===null?'null':typeof value;outcome=type===r.expected?'passed':'failed';evidence=`${r.path}: expected ${r.expected}, received ${type}.`;}
    if(r.kind==='json-number'){outcome=typeof value==='number'&&Number.isFinite(value)&&(r.min===undefined||value>=r.min)&&(r.max===undefined||value<=r.max)?'passed':'failed';evidence=`Submitted numeric result ${r.path}=${JSON.stringify(value)??'missing'}; published range ${r.min??'unbounded'} to ${r.max??'unbounded'}. This is an artifact-value check, not a runtime benchmark.`;}
   }
  }
  return {ruleId:r.id,label:r.label,outcome,evidence};
 });
 const outcome=checks.some(c=>c.outcome==='failed')?'failed':checks.length&&checks.every(c=>c.outcome==='passed')?'qualified':'manual';
 const report:TechnicalReport={id:crypto.randomUUID(),at:now.toISOString(),outcome,checks,automatic:true,actor:'Deterministic artifact checker',reason:outcome==='failed'?'Not Qualified — Mandatory Requirements Not Met':outcome==='qualified'?'Technical requirements passed. Your project is awaiting quality review.':'Manual technical review required — a check is unsupported or inconclusive.'};
 const previous=record(a);
 return {...a,screening:{...previous,reports:[...previous.reports,report],advancedToHR:undefined,events:[...previous.events,{at:report.at,actor:report.actor,message:report.reason}]}};
}
export function recordQuality(s:Store,id:string,outcome:QualityOutcome,criterionId:string,evidence:string):Store{
 const a=owner(s,id);if(latest(a)?.outcome!=='qualified')throw new Error('Only technically qualified submissions enter quality review.');
 if(!qualityOutcomes.includes(outcome)||evidence.trim().length<30)throw new Error('Choose a quality outcome and cite at least 30 characters of work-specific evidence.');
 if(!a.screeningSnapshot?.rubric.some(c=>c.id===criterionId))throw new Error('Choose a criterion from the published rubric.');
 const r=record(a),at=new Date().toISOString();return replace(s,{...a,...(a.screening?.advancedToHR?{stage:'Under Employer Review' as const,reviewedAt:null}:{}),screening:{...r,advancedToHR:undefined,qualityReviews:[...r.qualityReviews,{outcome,evidence:evidence.trim(),criterionId,reportId:latest(a)!.id,reviewer:s.user!.id,at}],events:[...r.events,{at,actor:s.user!.id,message:`Human quality review: ${outcome}. ${evidence.trim()}`}]}});
}
export function advanceHR(s:Store,id:string,evidence:string):Store{
 const a=owner(s,id),q=currentQuality(a);if(latest(a)?.outcome!=='qualified'||!q||['Needs Further Review','Does Not Meet Human Review Criteria'].includes(q.outcome))throw new Error('Complete a favorable human quality review before selecting for HR.');
 if(a.screening?.advancedToHR)throw new Error('Already selected for HR.');
 const count=s.applications.filter(x=>x.opportunityId===a.opportunityId&&x.stage!=='Withdrawn'&&x.screening?.advancedToHR).length;
 if(count>=(a.screeningSnapshot?.policy.hrCapacity||0))throw new Error('The published HR review capacity has been reached. No automatic selection was made.');
 if(evidence.trim().length<20)throw new Error('Explain the human selection using at least 20 characters.');
 const r=record(a),at=new Date().toISOString();return replace(s,{...a,stage:'Shortlisted',reviewedAt:at,history:[...a.history,{stage:'Shortlisted',at,message:'Selected by an employer reviewer for HR review.'}],screening:{...r,advancedToHR:{at,reviewer:s.user!.id,evidence:evidence.trim()},events:[...r.events,{at,actor:s.user!.id,message:`Advanced to HR: ${evidence.trim()}`}]}});
}
export function correctTechnical(s:Store,id:string,outcome:'qualified'|'failed'|'manual',evidence:string):Store{
 const a=owner(s,id);if(!latest(a))throw new Error('No technical report to review.');if(evidence.trim().length<30)throw new Error('Document the correction and supporting evidence (at least 30 characters).');
 const r=record(a),at=new Date().toISOString();const report={...latest(a)!,id:crypto.randomUUID(),at,outcome,automatic:false,actor:s.user!.id,reason:`Human technical review: ${evidence.trim()}`};
 return replace(s,{...a,...(a.screening?.advancedToHR?{stage:'Under Employer Review' as const,reviewedAt:null}:{}),screening:{...r,reports:[...r.reports,report],advancedToHR:undefined,events:[...r.events,{at,actor:s.user!.id,message:report.reason}]}});
}
export function requestTechnicalReview(s:Store,id:string,message:string):Store{
 const a=s.applications.find(x=>x.id===id);if(!a||s.user?.role!=='student'||s.user.id!==a.studentId)throw new Error('Only the applicant may request a review.');if(!latest(a)||message.trim().length<20)throw new Error('Explain the test or accessibility issue (at least 20 characters).');if(a.stage==='Withdrawn')throw new Error('This application was withdrawn.');
 const r=record(a),at=new Date().toISOString();const report={...latest(a)!,id:crypto.randomUUID(),at,outcome:'manual' as const,automatic:false,actor:s.user.id,reason:`Applicant requested review: ${message.trim()}`};return replace(s,{...a,...(a.screening?.advancedToHR?{stage:'Under Employer Review' as const,reviewedAt:null}:{}),screening:{...r,reports:[...r.reports,report],advancedToHR:undefined,events:[...r.events,{at,actor:s.user.id,message:report.reason}]}});
}
export function resubmitScreening(s:Store,id:string,payload:string,now=new Date(),files?:Application["files"]):Store{
 const a=s.applications.find(x=>x.id===id);if(!a||s.user?.role!=='student'||s.user.id!==a.studentId)throw new Error('Only the applicant may correct their submission.');
 const snap=a.screeningSnapshot;if(!snap?.policy.allowResubmission||!['failed','manual'].includes(latest(a)?.outcome||'')||['Draft','Withdrawn','Declined'].includes(a.stage))throw new Error('Corrections are not available under the published rules.');
 if(now>new Date(snap.deadline+'T23:59:59Z') || (a.joinedAt && now.getTime()>new Date(a.joinedAt).getTime()+snap.challengeDays*86400000))throw new Error('The published correction window has ended. Request human review instead.');
 if(payload.length>100000)throw new Error('JSON artifact must be 100 KB or smaller.');if(files?.some(f=>!f.stored||f.size>10*1024*1024)|| (files&&files.length>8))throw new Error('Save at most eight attachments, each up to 10 MB, before resubmitting.');return replace(s,evaluateTechnical({...a,files:files||a.files,screeningPayload:payload},now));
}
export function screeningCounts(apps:Application[]){const list=apps.filter(a=>!['Draft','Withdrawn'].includes(a.stage));return [
 ['Total Submissions',list.length],['Technically Qualified',list.filter(a=>latest(a)?.outcome==='qualified').length],['Automatically Failed Technical Requirements',list.filter(a=>latest(a)?.outcome==='failed'&&latest(a)?.automatic).length],['Manual Technical Review Required',list.filter(a=>latest(a)?.outcome==='manual').length],['Quality Review Pending',list.filter(a=>latest(a)?.outcome==='qualified'&&!currentQuality(a)).length],['Quality Review Completed',list.filter(a=>latest(a)?.outcome==='qualified'&&currentQuality(a)).length],['Advanced to HR',list.filter(a=>a.screening?.advancedToHR).length]] as const;}
export function assertScreeningEdit(s:Store,o:Opportunity){
 if(s.user?.role!=='employer'||o.owner!==s.user.id)throw new Error('Employer ownership is required.');
 const old=s.opportunities.find(x=>x.id===o.id);if(!old)return;
 const started=s.applications.some(a=>a.opportunityId===o.id);if(!started)return;
 const keys:(keyof Opportunity)[]=['screeningPolicy','effort','instructions','deliverables','tools','rubric','criteria','deadline','challengeDays','challenge','referenceSolution','privateEvaluationFiles','resources','specifications','scenario','acceptanceCriteria','starterMaterials','skills'];
 if(keys.some(k=>JSON.stringify(old[k])!==JSON.stringify(o[k])))throw new Error('Requirements are locked because applicants have already started. Create a new challenge for revised rules.');
}
