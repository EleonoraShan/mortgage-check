// src/pdf.ts
import type {
  PDFDocumentProxy,
} from 'pdfjs-dist/legacy/build/pdf';

import { GlobalWorkerOptions, getDocument, } from 'pdfjs-dist/legacy/build/pdf';
// Import the worker – the `?worker` suffix tells Vite to bundle it as a web‑worker.
const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url);
GlobalWorkerOptions.workerSrc = workerUrl.href;


// Re‑export the functions you’ll actually call in your UI.
export { PDFDocumentProxy, getDocument };
