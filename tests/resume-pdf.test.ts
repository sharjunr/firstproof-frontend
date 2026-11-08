import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createResumePdf} from '../lib/resume-pdf';
test('shared resume export is a real PDF with readable sample content',async()=>{const pdf=await createResumePdf('Alex Morgan','DEMO RESUME\n\nProfile\nEarly-career applicant.\n\nSelected project\n- Prepared a work sample.');const output=pdf.output();assert.ok(output.startsWith('%PDF-'));assert.match(output,/DEMO RESUME/);assert.match(output,/Alex Morgan/);assert.equal(pdf.getNumberOfPages(),1);});
test('long shared resumes wrap and paginate without losing text',async()=>{const pdf=await createResumePdf('Alex Morgan',Array.from({length:150},(_,i)=>`Experience ${i}: prepared and checked deliverables with clear assumptions and documented limitations.`).join('\n'));assert.ok(pdf.getNumberOfPages()>1);assert.match(pdf.output(),/Experience 149/);assert.match(pdf.output(),/shared resume/);});
