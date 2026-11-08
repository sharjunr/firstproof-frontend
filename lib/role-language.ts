import type {Opportunity} from './types';
const fields:Record<string,{challenge:string;scenario:string;requirements:string}>={
 'Engineering':{challenge:'Engineering work sample',scenario:'Engineering scenario',requirements:'Technical specifications and constraints'},
 'Software & AI':{challenge:'Software and data work sample',scenario:'Product or data scenario',requirements:'Functional requirements and constraints'},
 'Business & Finance':{challenge:'Business and finance work sample',scenario:'Business scenario',requirements:'Analysis requirements and assumptions'},
 'Law & Public Policy':{challenge:'Legal and policy work sample',scenario:'Case or policy scenario',requirements:'Review requirements and source constraints'},
 'Marketing':{challenge:'Marketing work sample',scenario:'Audience and campaign brief',requirements:'Campaign requirements and constraints'},
 'Design':{challenge:'Design work sample',scenario:'Design brief',requirements:'Design requirements and constraints'},
 'Arts & Culture':{challenge:'Arts and culture work sample',scenario:'Creative brief',requirements:'Creative requirements and constraints'},
 'Media & Communications':{challenge:'Communications work sample',scenario:'Editorial or communications brief',requirements:'Content requirements and source guidelines'},
 'Health & Life Sciences':{challenge:'Health and life sciences work sample',scenario:'Research or service scenario',requirements:'Evidence requirements and boundaries'},
 'Psychology & Social Sciences':{challenge:'Social sciences work sample',scenario:'Research or community scenario',requirements:'Research requirements and evidence limits'},
 'Education':{challenge:'Education work sample',scenario:'Learning or student-support scenario',requirements:'Learning objectives and requirements'},
 'Environment & Sustainability':{challenge:'Sustainability work sample',scenario:'Environmental scenario',requirements:'Analysis requirements and assumptions'},
 'Human Resources':{challenge:'Human resources work sample',scenario:'People and workplace scenario',requirements:'Process requirements and constraints'},
 'Sales & Customer Success':{challenge:'Customer and sales work sample',scenario:'Customer or sales scenario',requirements:'Response requirements and constraints'},
 'Supply Chain & Logistics':{challenge:'Logistics work sample',scenario:'Supply or delivery scenario',requirements:'Planning requirements and constraints'},
 'Architecture & Built Environment':{challenge:'Built-environment work sample',scenario:'Space and site brief',requirements:'Design requirements and boundaries'},
 'Science & Research':{challenge:'Research work sample',scenario:'Research question and supplied evidence',requirements:'Method requirements and evidence limits'},
 'Nonprofit & Community':{challenge:'Community work sample',scenario:'Program or community brief',requirements:'Program requirements and constraints'},
 'Hospitality & Events':{challenge:'Hospitality and events work sample',scenario:'Guest or event scenario',requirements:'Service requirements and constraints'},
 'Sports & Recreation':{challenge:'Sports and recreation work sample',scenario:'Activity or performance scenario',requirements:'Planning requirements and boundaries'},
};
export function roleLanguage(o:Pick<Opportunity,'industry'|'title'>){
 const base=fields[o.industry]||{challenge:'Role-specific work sample',scenario:'Workplace scenario',requirements:'Task requirements and constraints'};
 if(o.industry==='Business & Finance'&&/audit|account/i.test(o.title))return {challenge:'Accounting and audit work sample',scenario:'Accounting or audit scenario',requirements:'Working-paper requirements and assumptions'};
 if(o.industry==='Business & Finance'&&/financial|credit|investment/i.test(o.title))return {challenge:'Financial analysis work sample',scenario:'Financial analysis scenario',requirements:'Analysis requirements and assumptions'};
 return base;
}
export function requirementsHeading(o:Pick<Opportunity,'industry'|'title'>){return o.industry==='Engineering'?'Technical requirements verification':'Published requirements verification';}
