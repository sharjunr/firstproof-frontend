const database = "firstproof-demo-files-v2";
export const allowedExtensions = [
  "pdf",
  "txt",
  "csv",
  "xlsx",
  "xls",
  "docx",
  "pptx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "py",
  "js",
  "ts",
  "tsx",
  "jsx",
  "json",
  "md",
  "zip",
  "ipynb",
  "html",
  "css",
  "c",
  "cpp",
  "java",
];
export function fileError(file: File) {
  if (file.size > 10 * 1024 * 1024)
    return "Each demo file must be 10 MB or smaller.";
  if (
    !allowedExtensions.includes(file.name.split(".").pop()?.toLowerCase() || "")
  )
    return "Unsupported file type. Use a document, image, spreadsheet, presentation, code file, or ZIP.";
  return "";
}
function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(database, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error("Browser file storage is unavailable."));
  });
}
export async function saveFile(id: string, file: File) {
  const d = await db();
  return new Promise<void>((resolve, reject) => {
    const tx = d.transaction("files", "readwrite");
    tx.objectStore("files").put(file, id);
    tx.oncomplete = () => {
      d.close();
      resolve();
    };
    tx.onerror = () => {
      d.close();
      reject(
        new Error(
          "Could not save the file locally. Browser storage may be full.",
        ),
      );
    };
  });
}
export async function openFile(id: string, name: string) {
  const d = await db();
  const file = await new Promise<Blob | undefined>((resolve, reject) => {
    const tx = d.transaction("files", "readonly");
    const r = tx.objectStore("files").get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(new Error("File unavailable."));
  });
  d.close();
  if (!file) throw new Error("This demo file is unavailable in this browser.");
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function resumeFileError(file: File): Promise<string> {
  if (!file.size) return "Choose a non-empty resume file.";
  if (file.size > 5 * 1024 * 1024) return "Your resume must be 5 MB or smaller.";
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['pdf','doc','docx'].includes(ext || '')) return "Use a PDF or Word file (.pdf, .doc, .docx).";
  const bytes = new Uint8Array(await file.slice(0,8).arrayBuffer());
  const pdf = bytes[0]===0x25 && bytes[1]===0x50 && bytes[2]===0x44 && bytes[3]===0x46 && bytes[4]===0x2d;
  const zip = bytes[0]===0x50 && bytes[1]===0x4b && bytes[2]===0x03 && bytes[3]===0x04;
  const doc = [0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1].every((b,i)=>bytes[i]===b);
  if (!(ext==='pdf' ? pdf : ext==='doc' ? doc : zip)) return "The file content does not match its PDF or Word extension. Export your resume again and retry.";
  return '';
}
