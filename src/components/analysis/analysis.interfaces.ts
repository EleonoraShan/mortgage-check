export interface AnalysisItemI {
  risk_status: 'Low' | 'Medium' | 'High' | 'Insufficient Information';
  title: string;
  explanation: string;
}