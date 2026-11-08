'use client';
import {useEffect,useId,useState} from 'react';
import {ArrowDownRight,ArrowUpRight,Calculator,Check,Copy,RotateCcw,Sparkles} from 'lucide-react';
import {ROI_CONTROLS,ROI_DEFAULTS,ROI_DISCLAIMER,calculateRoi,formatCad,formatHours,formatPercent,roiSummary,type RoiInputs} from '../lib/roi';
function RoiNumber({value,min,max,step,label,onChange}:{value:number;min:number;max:number;step:number;label:string;onChange:(value:number)=>void}){
 const [draft,setDraft]=useState(String(value));
 const errorId=useId();
 useEffect(()=>setDraft(String(value)),[value]);
 const number=Number(draft),valid=draft.trim()!==''&&Number.isFinite(number)&&number>=min&&number<=max&&Math.abs((number-min)/step-Math.round((number-min)/step))<1e-8;
 return <div className="roi-number-wrap"><input type="number" aria-label={label+' — enter a number'} aria-invalid={!valid} aria-describedby={!valid?errorId:undefined} min={min} max={max} step={step} value={draft} onChange={e=>{const text=e.target.value;setDraft(text);const n=Number(text);if(text.trim()!==''&&Number.isFinite(n)&&n>=min&&n<=max&&Math.abs((n-min)/step-Math.round((n-min)/step))<1e-8)onChange(n);}}/>{!valid&&<span id={errorId} className="roi-number-error">Enter {min}–{max}. Results keep the last valid value.</span>}</div>;
}
export function EmployerRoiSimulator({id='employer-roi'}:{id?:string}){
 useEffect(()=>{let second=0;const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{if(window.location.hash==='#'+id)document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});});});return ()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};},[id]);
 const prefix=useId();const [input,setInput]=useState<RoiInputs>({...ROI_DEFAULTS});const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false);
 const result=calculateRoi(input),additional=result.hoursSaved<0,chartMax=Math.max(result.currentHours,result.firstProofHours);
 const metrics=[
  {label:'Review time without FirstProof',value:formatHours(result.currentHours),unit:'hours'},
  {label:'Review time with FirstProof',value:formatHours(result.firstProofHours),unit:'hours'},
  {label:additional?'Additional review time':'Review hours saved',value:formatHours(Math.abs(result.hoursSaved)),unit:additional?'additional hours':'hours',highlight:true},
  {label:additional?'Additional reviewer cost':'Potential reviewer cost savings',value:formatCad(Math.abs(result.grossSavings)).replace(/ CAD$/,''),unit:'CAD',highlight:true},
 ];
 function change(key:keyof RoiInputs,value:number){setInput(current=>({...current,[key]:value}));setCopied(false);setCopyError(false);}
 async function copy(){try{await navigator.clipboard.writeText(roiSummary(input));setCopied(true);setCopyError(false);}catch{setCopied(false);setCopyError(true);}}
 return <section id={id} className="roi-section" aria-labelledby={prefix+'-title'}>
  <div className="roi-shell">
   <div className="roi-heading"><span className="roi-kicker"><Sparkles size={14}/>Illustrative ROI Scenario</span><h2 id={prefix+'-title'}>Estimate your screening savings.</h2><p>Compare your current review process with FirstProof. Adjust four estimates to see the difference in time and reviewer cost.</p></div>
   <div className="roi-layout">
    <div className="roi-assumptions"><div className="roi-panel-heading"><Calculator size={18}/><h3>1. Enter your estimates</h3><span>Per hiring round</span></div><p className="roi-help">Type a number or move a slider. Times are minutes per applicant; reviewer cost is CAD per hour.</p>
    {ROI_CONTROLS.map(control=>{const value=input[control.key];const text=control.key==='hourlyCost'?formatCad(value)+'/hour':control.key==='applicants'?new Intl.NumberFormat('en-CA').format(value):value+' min';const progress=(value-control.min)/(control.max-control.min)*100;return <div className="roi-control" key={control.key}><div className="roi-label-row"><label htmlFor={prefix+'-'+control.key}>{{applicants:"Number of applicants",currentMinutes:"Employer review time without FirstProof (min/applicant)",firstProofMinutes:"Employer review time with FirstProof (min/applicant)",hourlyCost:"Reviewer cost per hour"}[control.key]}</label><RoiNumber value={value} min={control.min} max={control.max} step={control.step} label={control.label} onChange={value=>change(control.key,value)}/></div><input id={prefix+'-'+control.key} name={control.key} type="range" min={control.min} max={control.max} step={control.step} value={value} aria-valuetext={text} style={{background:`linear-gradient(90deg, #0b66e8 0%, #0b66e8 ${progress}%, #e2e8f0 ${progress}%, #e2e8f0 100%)`}} onChange={e=>change(control.key,Number(e.target.value))}/><div className="roi-range-labels" aria-hidden="true"><span>{control.key==='hourlyCost'?'$':''}{control.min.toLocaleString('en-CA')}</span><span>{control.key==='hourlyCost'?'$':''}{control.max.toLocaleString('en-CA')}</span></div></div>})}
    <p className="roi-help">FirstProof time means employer review time after initial screening, not AI processing speed. It stays adjustable because workflows vary. AI speed and accuracy have not yet been benchmarked.</p><div className="roi-actions"><button type="button" className="roi-button roi-secondary" onClick={()=>{setInput({...ROI_DEFAULTS});setCopied(false);setCopyError(false);}}><RotateCcw size={15}/>Reset estimates</button><button type="button" className="roi-button roi-primary" onClick={()=>void copy()}>{copied?<Check size={15}/>:<Copy size={15}/>}Copy summary</button></div><p className="roi-copy-status" role="status">{copied?'ROI summary copied with the current assumptions and disclaimer.':copyError?'Clipboard unavailable. Copy the summary from the box below.':'All estimates update instantly.'}</p>
    {copyError&&<label className="roi-manual-copy">Copy summary manually<textarea rows={12} readOnly value={roiSummary(input)} onFocus={e=>e.currentTarget.select()}/></label>}
    </div>
    <div className={'roi-results'+(additional?' roi-additional':'')}>
     <div className="roi-results-header"><span>2. Compare the results</span><span className="roi-live-dot">Updates instantly</span></div>
     <div className="roi-metrics" aria-live="polite" aria-atomic="true">{metrics.map(metric=><article key={metric.label} className={'roi-metric'+(metric.highlight?' roi-metric-highlight':'')}><h3>{metric.label}</h3><div><strong key={metric.value}>{metric.value}</strong><span>{metric.unit}</span></div></article>)}</div>
     <div className="roi-reduction">{additional?<ArrowUpRight size={20}/>:<ArrowDownRight size={20}/>}<span>Screening time {additional?'Increase':'Reduction'}</span><strong>{formatPercent(Math.abs(result.timeReductionPercent))}</strong></div>
     {additional&&<p className="roi-negative-note" role="status">In this scenario, FirstProof takes longer. The figures above show additional time and cost, rather than savings.</p>}
     <figure className="roi-chart" aria-label="Screening hours comparison"><figcaption>Without FirstProof vs. with FirstProof<span>Screening hours per hiring round</span></figcaption>{[{label:'Without FirstProof',hours:result.currentHours,className:'roi-bar-current'},{label:'With FirstProof',hours:result.firstProofHours,className:'roi-bar-firstproof'}].map(bar=><div key={bar.label} className="roi-chart-row"><div><span>{bar.label}</span><strong>{formatHours(bar.hours)} hours</strong></div><div className="roi-bar-track" aria-hidden="true"><div className={bar.className} style={{width:bar.hours/chartMax*100+'%'}}/></div></div>)}<p>Shorter bars mean less review time.</p></figure>
    </div>
   </div>
   <aside className="roi-research"><h3>Why look beyond resume filters?</h3><p>In a 2021 Harvard Business School and Accenture report, 88% of surveyed employers said their hiring systems filtered out high-skills candidates who could do the job but did not match the exact job criteria.</p><p>This is an employer survey finding, not an ATS error rate or a FirstProof accuracy score. FirstProof screening accuracy has not yet been measured.</p><a href="https://www.hbs.edu/managing-the-future-of-work/Documents/research/hiddenworkers09032021.pdf" target="_blank" rel="noopener noreferrer">Read Hidden Workers: Untapped Talent (2021) ↗</a></aside><div className="roi-disclaimer"><span>Scenario estimate · CAD</span><p>{ROI_DISCLAIMER}</p></div>
  </div>
 </section>;
}
