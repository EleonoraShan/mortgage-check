import { PromisePool } from '@supercharge/promise-pool';
import ollama from 'ollama/browser';
import { useState } from "react";
import { getModelName } from '../../config/model-config';
import { useClientContext } from '../client-screen';
import { summarisePdf } from '../processing';
import { getOverallAnalysisPrompt } from '../processing/analysis-across-documents-template';
import { parseOllamaJson } from '../processing/parse-ollama-json';

export const useRunAnalysis = () => {
  const { 
    files, 
    activeDocuments,
    updateFileAnalysis, 
    name, 
    loanAmount, 
    depositAmount, 
    employmentStatus, 
    currentRole, 
    company, 
    propertyType 
  } = useClientContext();
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false)
  const runAnalysis = async () => {
    try {
      setIsAnalysisRunning(true)
      console.log('Starting analysis with files:', files.length)
      console.log('Active documents:', activeDocuments)
      
      if (files.length === 0) {
        throw new Error('No documents uploaded. Please upload some documents first.')
      }

      // Filter files to only include active (selected) documents
      const activeFiles = files.filter(file => activeDocuments.includes(file.id))
      console.log('Active files for analysis:', activeFiles.length)
      
      if (activeFiles.length === 0) {
        throw new Error('No documents selected for analysis. Please select at least one document.')
      }

      const { results: summaries } = await PromisePool
        .withConcurrency(1)
        .for(activeFiles)
        .process(async (file) => {
          console.log('Processing file:', file.name)
          // only analyse each file once
          if (file.fileAnalysisSummaryJson) {
            console.log('Using cached analysis for:', file.name)
            return file.fileAnalysisSummaryJson
          }
          const summary = await summarisePdf(file.fileText)
          
          updateFileAnalysis(file.id, summary)
          
          return summary
        })

      console.log('Document summaries completed:', summaries)
      
      // Filter out placeholder values for analysis
      const clientData = {
        name, 
        loanAmount, 
        depositAmount, 
        employmentStatus: employmentStatus === 'Select employment status' ? 'Not specified' : employmentStatus,
        currentRole: currentRole === 'Type information here' ? 'Not specified' : currentRole,
        company: company === 'Type information here' ? 'Not specified' : company,
        propertyType: propertyType === 'Select property type' ? 'Not specified' : propertyType
      };

      console.log('Client data:', clientData)
      console.log('Calling Ollama with model:', getModelName())
      
      
      const prompt = getOverallAnalysisPrompt(JSON.stringify(summaries), JSON.stringify(clientData))
      console.log('Analysis prompt:', prompt)

      const response = await ollama.chat({
        model: getModelName(), 
        stream: false,
        messages: [
          {
            role: "system",
            content: prompt
          }
        ],
      })

      console.log('Ollama response:', response)
      console.log('Raw response content:', response.message.content)

      const parsedData = parseOllamaJson(response.message.content)

      console.log('Parsed analysis data:', parsedData)
      
      // If parsing failed or returned empty, create a fallback analysis
      if (!parsedData || (Array.isArray(parsedData) && parsedData.length === 0)) {
        console.log('Creating fallback analysis due to parsing issues')
        const fallbackAnalysis = [{
          title: "Analysis Completed",
          risk_status: "Medium",
          explanation: "Document analysis completed. The AI model response could not be parsed as structured data, but the documents were processed successfully."
        }]
        setIsAnalysisRunning(false)
        return fallbackAnalysis
      }
      
      setIsAnalysisRunning(false)
      return parsedData
    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalysisRunning(false)
      throw error
    }
  }

  return {
    runAnalysis,
    isAnalysisRunning
  }
}
