'use client';
import {useEffect,useId,useState} from 'react';
import {ArrowDownRight,ArrowUpRight,Calculator,Check,Copy,RotateCcw,Sparkles} from 'lucide-react';
import {ROI_CONTROLS,ROI_DEFAULTS,ROI_DISCLAIMER,calculateRoi,formatCad,formatHours,formatPercent,roiSummary,type RoiInputs} from '../lib/roi';
export function EmployerRoiSimulator({id='employer-roi'}:{id?:string}){
 useEffect(()=>{let second=0;const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{if(window.location.hash==='#'+id)document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'});});});return ()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};},[id]);
 const prefix=useId();const [input,setInput]=useState<RoiInputs>({...ROI_DEFAULTS});const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false);
 const result=calculateRoi(input),additional=result.hoursSaved<0,chartMax=Math.max(result.currentHours,result.firstProofHours);
 const metrics=[
  {label:'Current Screening Time',value:formatHours(result.currentHours),unit:'hours'},
  {label:'FirstProof Screening Time',value:formatHours(result.firstProofHours),unit:'hours'},
  {label:additional?'Additional Reviewer Time':'Reviewer Hours Saved',value:formatHours(Math.abs(result.hoursSaved)),unit:additional?'additional hours':'hours',highlight:true},
  {label:additional?'Additional Labor Cost':'Potential Gross Labor Savings',value:formatCad(Math.abs(result.grossSavings)).replace(/ CAD$/,''),unit:'CAD',highlight:true},
 ];
 function change(key:keyof RoiInputs,value:number){setInput(current=>({...current,[key]:value}));setCopied(false);setCopyError(false);}
 async function copy(){try{await navigator.clipboard.writeText(roiSummary(input));setCopied(true);setCopyError(false);}catch{setCopied(false);setCopyError(true);}}
 return <section id={id} className="roi-section" aria-labelledby={prefix+'-title'}>
  <div className="roi-shell">
   <div className="roi-heading"><span className="roi-kicker"><Sparkles size={14}/>Illustrative ROI Scenario</span><h2 id={prefix+'-title'}>See What Smarter Screening Could Save.</h2><p>Estimate how much engineering and recruiting time your team could potentially save by screening applicants through structured, role-specific challenges.</p></div>
   <div className="roi-layout">
    <div className="roi-assumptions"><div className="roi-panel-heading"><Calculator size={18}/><h3>Your assumptions</h3><span>Per hiring round</span></div><p className="roi-help">Move the sliders to explore a scenario. These values are assumptions, not measured performance.</p>
    {ROI_CONTROLS.map(control=>{const value=input[control.key];const text=control.key==='hourlyCost'?formatCad(value)+'/hour':control.key==='applicants'?new Intl.NumberFormat('en-CA').format(value):value+' min';const progress=(value-control.min)/(control.max-control.min)*100;return <div className="roi-control" key={control.key}><div className="roi-label-row"><label htmlFor={prefix+'-'+control.key}>{control.label}</label><output htmlFor={prefix+'-'+control.key}>{text}</output></div><input id={prefix+'-'+control.key} name={control.key} type="range" min={control.min} max={control.max} step={control.step} value={value} aria-valuetext={text} style={{background:`linear-gradient(90deg, #8275ff 0%, #508bff ${progress}%, #273248 ${progress}%, #273248 100%)`}} onChange={e=>change(control.key,Number(e.target.value))}/><div className="roi-range-labels" aria-hidden="true"><span>{control.key==='hourlyCost'?'$':''}{control.min.toLocaleString('en-CA')}</span><span>{control.key==='hourlyCost'?'$':''}{control.max.toLocaleString('en-CA')}</span></div></div>})}
    <div className="roi-actions"><button type="button" className="roi-button roi-secondary" onClick={()=>{setInput({...ROI_DEFAULTS});setCopied(false);setCopyError(false);}}><RotateCcw size={15}/>Reset to Defaults</button><button type="button" className="roi-button roi-primary" onClick={()=>void copy()}>{copied?<Check size={15}/>:<Copy size={15}/>}Copy ROI Summary</button></div><p className="roi-copy-status" role="status">{copied?'ROI summary copied with the current assumptions and disclaimer.':copyError?'Clipboard unavailable. Copy the summary from the box below.':'All estimates update instantly.'}</p>
    {copyError&&<label className="roi-manual-copy">Copy summary manually<textarea rows={12} readOnly value={roiSummary(input)} onFocus={e=>e.currentTarget.select()}/></label>}
    </div>
    <div className={'roi-results'+(additional?' roi-additional':'')}>
     <div className="roi-results-header"><span>Estimated screening effort</span><span className="roi-live-dot">Live scenario</span></div>
     <div className="roi-metrics" aria-live="polite" aria-atomic="true">{metrics.map(metric=><article key={metric.label} className={'roi-metric'+(metric.highlight?' roi-metric-highlight':'')}><h3>{metric.label}</h3><div><strong key={metric.value}>{metric.value}</strong><span>{metric.unit}</span></div></article>)}</div>
     <div className="roi-reduction">{additional?<ArrowUpRight size={20}/>:<ArrowDownRight size={20}/>}<span>Estimated Screening Time {additional?'Increase':'Reduction'}</span><strong>{formatPercent(Math.abs(result.timeReductionPercent))}</strong></div>
     {additional&&<p className="roi-negative-note" role="status">In this scenario, FirstProof takes longer. The figures above show additional time and cost, rather than savings.</p>}
     <figure className="roi-chart" aria-label="Screening hours comparison"><figcaption>Current Process vs. FirstProof<span>Screening hours per hiring round</span></figcaption>{[{label:'Current Process',hours:result.currentHours,className:'roi-bar-current'},{label:'FirstProof',hours:result.firstProofHours,className:'roi-bar-firstproof'}].map(bar=><div key={bar.label} className="roi-chart-row"><div><span>{bar.label}</span><strong>{formatHours(bar.hours)} hours</strong></div><div className="roi-bar-track" aria-hidden="true"><div className={bar.className} style={{width:bar.hours/chartMax*100+'%'}}/></div></div>)}<p>Bars share the same scale. Results use unrounded calculations.</p></figure>
    </div>
   </div>
   <div className="roi-disclaimer"><span>Scenario estimate · CAD</span><p>{ROI_DISCLAIMER}</p></div>
  </div>
 </section>;
}
