import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resumeFileError} from '../lib/files';
import {seed,student,employer} from '../lib/demo';
import {requestBackground,respondToBackground,employerApplicationView} from '../lib/model';
test('resume file validation rejects empty, oversized, unsupported and disguised files',async()=>{
 assert.match(await resumeFileError(new File([],'resume.pdf')),/non-empty/);
 assert.match(await resumeFileError(new File([new Uint8Array(5*1024*1024+1)],'resume.pdf')),/5 MB/);
 assert.match(await resumeFileError(new File(['text'],'resume.exe')),/PDF or Word/);
 assert.match(await resumeFileError(new File(['not a document'],'resume.pdf')),/does not match/);
 assert.equal(await resumeFileError(new File(['%PDF-1.7 test'],'resume.pdf')),'');
 assert.equal(await resumeFileError(new File([new Uint8Array([0x50,0x4b,3,4])],'resume.docx')),'');
 assert.equal(await resumeFileError(new File([new Uint8Array([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1])],'resume.doc')),'');
});
test('resume file is permitted only after invitation and request, and exposed only after sharing',()=>{
 let s=seed();s.user=employer;const a=s.applications[0];a.stage='Shortlisted';s=requestBackground(s,a.id,'Please share a resume for the next hiring stage.');s.user=student;
 const file={id:'resume-file',name:'resume.pdf',size:100,type:'application/pdf',stored:true};
 assert.throws(()=>respondToBackground(s,a.id,true,'','',file),/next-stage invitation/);
 s.applications[0].stage='Invited to Next Stage';
 const shared=respondToBackground(s,a.id,true,'','',file);
 assert.deepEqual(employerApplicationView(shared.applications[0]).backgroundRequest!.resumeFile,file);
 shared.applications[0].stage='Submitted';
 assert.equal(employerApplicationView(shared.applications[0]).backgroundRequest!.resumeFile,undefined);
 const declined=respondToBackground(s,a.id,false,'','',file);
 assert.equal(declined.applications[0].backgroundRequest!.resumeFile,undefined);
 s.user=employer;assert.throws(()=>respondToBackground(s,a.id,true,'','',file),/Only this applicant/);
});
