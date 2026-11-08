import type {Application} from './types';
import {latestTechnical} from './screening';
export function technicalVerification(a:Pick<Application,'screening'|'screeningSnapshot'>){
 const report=latestTechnical(a);
 if(!report)return {label:a.screeningSnapshot?'Not run':'Not configured',tone:'neutral' as const,description:a.screeningSnapshot?'Published checks have not run yet. Supplied content is not a passing technical result.':'No technical requirements have been verified. This challenge has no published screening report.'};
 if(report.outcome==='failed')return {label:'Published requirements not met',tone:'warning' as const,description:'At least one published mandatory requirement failed. Review the test evidence below; this is separate from a hiring decision.'};
 if(report.outcome==='manual')return {label:'Human verification required',tone:'warning' as const,description:'A technical result is unavailable or inconclusive. Supplied content does not establish that requirements were met.'};
 if(!report.automatic)return {label:'Reviewer confirmed',tone:'success' as const,description:'An employer reviewer recorded a qualified technical outcome. Read their evidence below; this does not replace the separate quality assessment.'};
 return {label:'Published artifact checks passed',tone:'success' as const,description:'Only the published JSON-output and attachment-presence checks were verified. Code execution, performance and technical quality have not been verified.'};
}
export function suppliedContent(a:Pick<Application,'text'|'files'|'links'>){return a.text.trim().length>=80||a.links.length>0||a.files.some(f=>f.stored&&f.size>0);}
