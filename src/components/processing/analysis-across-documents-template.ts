const OVERALL_ANALYSIS_TEMPLATE = `
You are a UK mortgage‑broker assistant.  
Please produce a risk analysis for a mortgage broker using the following document analysis and general information client data.

The document analysis is an array of jsons where each item is an analysis of mortgage risk generated from a different client document.
Client data is general information about the client and how much they are looking to borrow.

Produce a **structured summary** of lending risk in jsons format. Avoid multiple analyses covering the same point.
Include items for which more information should be submitted. Items requiring more information should have the risk_status Insufficient Information.

Output the analysis as a JSON array of objects with the keys:
title, risk_status, explanation. 
The risk_status should be one of Low, Medium, High, Insufficient Information.
No extra text outside the JSON array.

**Document analysis:**
{documentAnalysis}

**Client data:**
{clientData}
`;

export const getOverallAnalysisPrompt = (documentAnalysis: string, clientData: string) => {
  return OVERALL_ANALYSIS_TEMPLATE.replace('{documentAnalysis}', documentAnalysis).replace('{clientData}', clientData);

}
