
// // Tell pdfjs‑dist where its worker lives (required for non‑bundlers)
// // If you’re bundling with Webpack/Vite, this will usually resolve automatically.
// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import pdfToText from "react-pdftotext"


export const processDocument = async (file: File) => {
  const content = pdfToText(file)
  console.log({ content })
  return content
  // const arrayBuffer = await file.arrayBuffer();

  // // Load the PDF
  // const pdf: PDFDocumentProxy = await getDocument({ data: arrayBuffer }).promise;

  // // Iterate over the pages
  // const pagesText = await Promise.all(
  //   Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(async (pageNum) => {
  //     const page = await pdf.getPage(pageNum);
  //     const content = await page.getTextContent();
  //     const pageText = content.items
  //       .map((item: any) => item.str)
  //       .join(' ');
  //     return pageText;
  //   })
  // );

  // Join text for each page with a separator
  // return pagesText.join('\n\n--- Page separator ---\n\n')
}
