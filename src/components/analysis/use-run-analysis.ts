import { PromisePool } from '@supercharge/promise-pool';
import ollama from 'ollama';
import { useState } from "react";
import { useClientContext } from '../client-screen';
import { summarisePdf } from '../document-processing';
import { getOverallAnalysisPrompt } from '../document-processing/analysis-across-documents-template';
import { parseOllamaJson } from '../document-processing/parse-ollama-json';

export const useRunAnalysis = () => {
  const { chatMessages, files, updateFileAnalysis, name, loanAmount } = useClientContext();
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const runAnalysis = async () => {
    setIsAnalysisRunning(true)
    const { results: summaries, errors } = await PromisePool
      .withConcurrency(1)
      .for(files)
      .process(async (file) => {
        // only analyse each file once
        if (file.fileAnalysisSummaryJson) {
          return file.fileAnalysisSummaryJson
        }
        const summary = await summarisePdf(file.fileText)
        
        updateFileAnalysis(file.id, JSON.stringify(summary))
        
        return summary
      })

    console.log({ summaries })
    const response = await ollama.chat({
      model: 'gpt-oss:20b', 
      stream: false,
      messages: [
        {
          role: "system",
          content: getOverallAnalysisPrompt(JSON.stringify(summaries), JSON.stringify({ name, loanAmount }))
        }
      ],
    })

    setIsAnalysisRunning(false)

    const parsedData = parseOllamaJson(response.message.content)

    console.log({response})
    console.log({parsedData})
    return parsedData
  }

  return {
    runAnalysis,
    isAnalysisRunning
  }
}



// content: `
// Please produce a risk analysis for a mortgage broker using the following client data:

// ${'Eleonora is currently employed at Google as a software engineer making £100,000 a year. She has passed her probation 3 months ago'}

// Include items for which more information should be submitted.

// Output the analysis as a JSON array of objects with the keys:
// title, risk_status, explanation. 
// The risk_status should be one of Low, Medium, High, Insufficient Information.
// No extra text outside the JSON array.


// `