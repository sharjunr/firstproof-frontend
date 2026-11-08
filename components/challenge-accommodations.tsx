'use client';
import {Accessibility,Mail} from 'lucide-react';
export function ChallengeAccommodations({challenge}:{challenge:string}){
 const configured=process.env.NEXT_PUBLIC_ACCOMMODATIONS_EMAIL?.trim();
 const email=configured||'accommodations@example.com';
 const available=!!email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 const subject=encodeURIComponent('Challenge accommodation request — '+challenge);
 const body=encodeURIComponent('Challenge: '+challenge+'\n\nI would like to discuss an accommodation, such as extra time, accessible materials, or an alternative submission format.\n\nMy request: ');
 return <aside className="challenge-accommodations" aria-label="Challenge accommodations"><Accessibility size={23}/><div><h3>Need an accommodation?</h3><p>You can request extra time, accessible challenge materials, or an alternative submission format. Contact us before starting the timer where possible, so arrangements can be agreed before you begin.</p><p>You do not need to include a diagnosis or medical documents in your first email. Describe the adjustment you need and include the challenge title.</p>{available&&<a className="text-link" href={'mailto:'+email+'?subject='+subject+'&body='+body}><Mail size={16}/>Request an accommodation: {email}</a>}{!configured&&<p className="fine-print"><strong>Example contact only — this inbox is not monitored.</strong> Accommodation requests are not sent to an employer by this demo.</p>}<p className="fine-print">Sending a request does not automatically pause or extend a running timer. Wait for confirmation of any agreed adjustment before starting.</p></div></aside>;
}
