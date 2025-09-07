import ollama from 'ollama';
import { useState } from "react";
import { useClientContext } from '../client-screen';

export const useRunAnalysis = () => {
  const { chatMessages, files } = useClientContext();
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const runAnalysis = async () => {
    setIsAnalysisRunning(true)
    const response = await ollama.chat({
      model: 'gpt-oss:20b', 
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "You are a mortgage‑broker risk‑analysis assistant. Keep your answer strictly in JSON."
        },
        {
          role: "system",
          content: `
            Please produce a risk analysis for a mortgage broker using the following client data:
            
            ${'Eleonora is currently employed at Google as a software engineer making £100,000 a year. She has passed her probation 3 months ago'}
            
            Include items for which more information should be submitted.
            
            Output the analysis as a JSON array of objects with the keys:
            title, risk_status, explanation. 
            The risk_status should be one of Low, Medium, High, Insufficient Information.
            No extra text outside the JSON array.


          `
        }
      ],
      // format: {
      //   "type": "object",
      //   "properties": {
      //     "overall-risk": {
      //       "type": "string"
      //     },
      //     "identity-verification": {
      //       "type": "string"
      //     },
      //     "credit-score": {
      //       "type": "string"
      //     },
      //     "employment-history": {
      //       "type": "string"
      //     },
      //     "debt-to-income-ratio": {
      //       "type": "string"
      //     }
      //   },
      //   "required": [
      //     "overall-risk",
      //     "identity-verification", 
      //     "credit-score",
      //     "employment-history",
      //     "debt-to-income-ratio"
      //   ]}
    })

    setIsAnalysisRunning(false)

    console.log({response})
    console.log({responseFormatted: JSON.parse(response.message.content)})
    return response
  }

  return {
    runAnalysis,
    isAnalysisRunning
  }
}