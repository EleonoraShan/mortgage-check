export interface AnalysisItemI {
  type: 'concern' | 'success' | 'warning';
  title: string;
  description: string;
  document: string;
}