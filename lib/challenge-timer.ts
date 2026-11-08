import type {Application,Store} from './types';
export function challengeTimeLeft(a:Application,now=Date.now()):number|null{
 if(!a.challengeEndsAt||a.submittedAt)return null;
 return Math.max(0,Date.parse(a.challengeEndsAt)-now);
}
export function startTimedChallenge(s:Store,id:string,now=new Date()):Store{
 const a=s.applications.find(a=>a.id===id),o=s.opportunities.find(o=>o.id===a?.opportunityId);
 if(!a||!o||s.user?.role!=='student'||s.user.id!==a.studentId)throw new Error('Sign in as the student who owns this challenge.');
 if(a.stage!=='Draft'||a.challengeStartedAt)throw new Error('This challenge has already started or closed.');
 if(o.status!=='Published'||now>new Date(o.deadline+'T23:59:59Z'))throw new Error('This opportunity is closed.');
 if(!Number.isFinite(o.effort)||o.effort<=0||o.effort>3)throw new Error('The challenge needs a valid time limit of up to 3 hours.');
 const end=Math.min(now.getTime()+o.effort*3600000,Date.parse(o.deadline+'T23:59:59Z'),a.joinedAt&&o.challengeDays?Date.parse(a.joinedAt)+o.challengeDays*86400000:Infinity);
 if(end<=now.getTime())throw new Error('The challenge submission window has ended.');
 return {...s,applications:s.applications.map(x=>x.id!==id?x:{...x,timedChallengeRequired:true,challengeStartedAt:now.toISOString(),challengeEndsAt:new Date(end).toISOString(),history:[...x.history,{stage:'Draft',at:now.toISOString(),message:'Timed challenge started. Submit before '+new Date(end).toISOString()+'. The timer cannot be paused.'}]})};
}
export function expireTimedChallenges(s:Store,now=new Date()):Store{
 let changed=false;const applications=s.applications.map(a=>{
 if(a.stage!=='Draft'||a.submittedAt||!a.challengeEndsAt||Date.parse(a.challengeEndsAt)>now.getTime())return a;
 changed=true;return {...a,stage:'Time expired' as const,history:[...a.history,{stage:'Time expired' as const,at:a.challengeEndsAt,message:'Time expired — no submission received. This attempt is closed; no work quality or hiring judgment was made.'}]};
 });return changed?{...s,applications}:s;
}
export function formatCountdown(ms:number){const seconds=Math.ceil(Math.max(0,ms)/1000);return [Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(n=>String(n).padStart(2,'0')).join(':');}
