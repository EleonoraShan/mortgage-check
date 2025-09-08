import { decode, encode } from 'gpt-tokenizer';

import ollama from 'ollama/browser'
import { AnalysisItemI } from "../analysis/analysis.interfaces";
import { defaultModel } from './constants';
import { parseOllamaJson } from './parse-ollama-json';

const model = defaultModel


// ---------------------------------------------------------------------------
// 2.4  Helper: Chunk text into ~4000‑token pieces
// ---------------------------------------------------------------------------
function chunkText(text: string, chunkSize = 4000) {
  // const enc = encode('cl100k_base');
  const tokens = encode(text);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += chunkSize) {
    const chunk = tokens.slice(i, i + chunkSize);
    chunks.push(decode(chunk));
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// 2.5  Prompt template (JSON‑output)
const PROMPT_TEMPLATE = `
You are a UK mortgage‑broker assistant.  
Read the following excerpt from a client’s documentation and produce a **structured summary** in jsons format.  
The JSON must contain an analysis item which is an array of assessments where the title if the item being analysed, risk_status should be one of Low, Medium, High, Insufficient Information
and explanation the reason for analysis. The JSON can optionally contain notes.

{analysis: {
  title: "", risk_status: "", explanation: ""
}[]
  notes: ""
}

**Excerpt:**
{excerpt}
`;

const MERGE_SUMMARIES = `
You are a UK mortgage‑broker assistant.  
Read the following JSON data analysis of mortgage risk generated from a single client document and produce a **structured summary** in jsons format.  
The JSON must contain an analysis item which is an array of assessments where the title if the item being analysed, risk_status should be one of Low, Medium, High, Insufficient Information
and explanation the reason for analysis. The JSON can optionally contain notes.

{analysis: {
  title: "", risk_status: "", explanation: ""
}[]
  notes: ""
}

**Excerpt:**
{excerpt}
`;


// ---------------------------------------------------------------------------
// 2.6  Summarise a single chunk via Ollama
// ---------------------------------------------------------------------------
async function summariseChunk(excerpt: string) {
  const prompt = PROMPT_TEMPLATE.replace('{excerpt}', excerpt.trim());             // uses default: http://localhost:11434
  const response = await ollama.chat({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });

  console.log({ response})

  return parseOllamaJson(response.message.content)
}

// ---------------------------------------------------------------------------
// 2.7  Merge an array of chunk summaries into a final summary
// ---------------------------------------------------------------------------


async function mergeSummaries(summaries: {analysis: AnalysisItemI[], notes: string}[]) {
  const prompt = MERGE_SUMMARIES.replace('{excerpt}', JSON.stringify(summaries));        // uses default: http://localhost:11434
  const response = await ollama.chat({
    model,
    messages: [{ role: 'user', content: prompt }],
    stream: false,
  });

    return parseOllamaJson(response.message.content);
}

// ---------------------------------------------------------------------------
// 2.8  The public API – summarise a PDF
// ---------------------------------------------------------------------------
export const  summarisePdf = async (rawText: string) => {
  const chunks = chunkText(rawText, 4000);

  const chunkSummaries = await Promise.all(
    chunks.map(chunk => summariseChunk(chunk))
  );

  console.log({ chunkSummaries})

  const merged = await mergeSummaries(chunkSummaries);

  console.log({ merged})
  return merged
}
