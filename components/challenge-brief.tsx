'use client';
import type {Opportunity} from '../lib/types';
import {Badge,CheckLine} from './ui';
import {ChallengeResources} from './hiring-controls';
import {PublishedScreening} from './screening-controls';
export function ChallengeBrief({opportunity:o}:{opportunity:Opportunity}){
 return <div className="concise-challenge">
  <p className="eyebrow">YOUR WORK SAMPLE</p><h2>{o.challenge}</h2>
  <div className="brief-time"><Badge tone="blue">Maximum time: {o.effort} hours</Badge><span>Includes reading, setup, checks and your short handoff.</span></div>
  <h3>Your task</h3><p>{o.scenario||o.instructions.split('\n\n')[0]}</p>
  <h3>What to submit</h3><div className="brief-deliverables">{o.deliverables.map(d=><CheckLine key={d}>{d}</CheckLine>)}</div>
  <p className="fine-print">Stop at the maximum time. A clear partial result and a note about unfinished work are acceptable.</p>
  <h3>Provided materials</h3><ChallengeResources opportunity={o} materialsOnly/>
  {!o.starterMaterials?.length&&!o.resources?.length&&<p>Use the facts and requirements in the task above. No separate files are provided.</p>}
  <h3>How your work is reviewed</h3>
  <div className="brief-rubric">{o.rubric?.length?o.rubric.map(c=><div key={c.id}><strong>{c.label}<span>{c.weight}%</span></strong><p>{c.description}</p></div>):<p>{o.criteria}</p>}</div>
  <p className="fine-print">Content supplied is a completeness indicator. It does not mean technical requirements or work quality have been verified.</p>
  <PublishedScreening opportunity={o}/>
  <div className="brief-deadlines"><strong>Submit within {o.challengeDays||7} days of joining, before {o.deadline}.</strong><p>The employer’s published review commitment is {o.reviewDays} calendar days after submission. These calendar windows are separate from the {o.effort}-hour work limit.</p></div>
  <details className="brief-disclosure"><summary>Full instructions, constraints and allowed tools</summary><h3>Full task instructions</h3><p className="pre-wrap">{o.instructions}</p>{!!o.specifications?.length&&<><h3>Scope and constraints</h3>{o.specifications.map(x=><CheckLine key={x}>{x}</CheckLine>)}</>}<h3>Allowed tools and assistance</h3><p>{o.tools}</p></details>
  <details className="brief-disclosure"><summary>Detailed review criteria and next steps</summary>{!!o.acceptanceCriteria?.length&&<><h3>Acceptance criteria</h3>{o.acceptanceCriteria.map(x=><CheckLine key={x}>{x}</CheckLine>)}</>}<p>{o.criteria}</p><p>After submission, check your tracker. Passing published technical checks leads to separate human quality review, not an automatic shortlist. If selected for a later stage, you choose whether to share requested background information.</p><p>AI review and similarity analysis are not connected in this preview.</p></details>
 </div>;
}
export function RoleDetails({opportunity:o}:{opportunity:Opportunity}){return <details className="panel brief-disclosure"><summary>About this role and the day-to-day work</summary><Badge>{o.industry}</Badge><h3>Role overview</h3><p className="pre-wrap">{o.description}</p>{o.dayInTheRole&&<><h3>A day in the role</h3><p>{o.dayInTheRole}</p></>}{o.responsibilities&&<><h3>Responsibilities</h3><p>{o.responsibilities}</p></>}{!!o.skills?.length&&<p>Relevant skills: {o.skills.join(', ')}</p>}<h3>What you’ll bring</h3><p>{o.qualifications}</p>{!!o.majors?.length&&<p>Relevant study areas: {o.majors.join(', ')}.</p>}<h3>Eligibility</h3><p>{o.eligibility}</p><p className="fine-print">No resume, school or GPA is requested at the initial submission stage.</p></details>}
