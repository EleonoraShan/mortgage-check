import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `./node_modules/pdfjs-dist/build/pdf.worker.min.js`;

export const processDocument = async (file: File) => {
  console.log("calling processDocument")
  const buffer = await file.arrayBuffer();
  const doc = await getDocument({ data: buffer }).promise;
  const numPages = doc.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const txt = await page.getTextContent();
    fullText += txt.items
      .map((item: any) => item.str)
      .join(' ');
  }

  console.log({fullText})

  return fullText
}
