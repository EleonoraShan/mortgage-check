const OVERALL_ANALYSIS_TEMPLATE = `
You are a UK mortgage broker assistant. Analyze the client's mortgage application risk.

Document summaries: {documentAnalysis}
Client info: {clientData}

Return ONLY a JSON array with this exact format:
[
  {
    "title": "Risk assessment title",
    "risk_status": "Low",
    "explanation": "Brief explanation"
  }
]

Risk status must be: Low, Medium, High, or Insufficient Information.
No other text, just the JSON array.
`;

export const getOverallAnalysisPrompt = (documentAnalysis: string, clientData: string) => {
  return OVERALL_ANALYSIS_TEMPLATE.replace('{documentAnalysis}', documentAnalysis).replace('{clientData}', clientData);

}
