/** Export only the resume text that the applicant has already consented to share. */
export async function createResumePdf(name:string,text:string){
 const {jsPDF}=await import('jspdf');
 const pdf=new jsPDF({unit:'pt',format:'a4'});
 const width=pdf.internal.pageSize.getWidth(),height=pdf.internal.pageSize.getHeight(),margin=48;
 const clean=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/\u2022/g,'-').replace(/[^\x20-\x7e\n\t]/g,'');
 pdf.setProperties({title:`${clean(name)} - Shared resume`,subject:'Applicant-consented resume text',creator:'FirstProof'});
 let y=margin;
 function header(){pdf.setFont('helvetica','bold');pdf.setFontSize(20);pdf.setTextColor(32,37,43);const lines=pdf.splitTextToSize(clean(name),width-margin*2);pdf.text(lines,margin,y);y+=lines.length*24;pdf.setFontSize(10);pdf.setFont('helvetica','normal');pdf.setTextColor(80,95,115);pdf.text('Resume shared for the next hiring stage',margin,y);y+=22;pdf.setDrawColor(200,220,250);pdf.line(margin,y,width-margin,y);y+=26;}
 header();pdf.setFont('helvetica','normal');pdf.setFontSize(11);pdf.setTextColor(32,37,43);
 for(const paragraph of clean(text).split('\n')){const lines:string[]=paragraph.trim()?pdf.splitTextToSize(paragraph,width-margin*2):[''];for(const line of lines){if(y>height-margin-28){pdf.addPage();y=margin;}if(line)pdf.text(line,margin,y);y+=16;}}
 const total=pdf.getNumberOfPages();for(let page=1;page<=total;page++){pdf.setPage(page);pdf.setFontSize(9);pdf.setTextColor(100,116,139);pdf.text('FirstProof - shared resume',margin,height-28);pdf.text(`${page} / ${total}`,width-margin,height-28,{align:'right'});}
 return pdf;
}
export async function downloadResumePdf(name:string,text:string){const pdf=await createResumePdf(name,text);const filename=name.replace(/[^a-z0-9-]+/gi,'-').replace(/^-|-$/g,'')||'applicant';pdf.save(filename+'-shared-resume.pdf');}
