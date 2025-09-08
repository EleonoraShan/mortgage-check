import { Download, RefreshCw } from 'lucide-react';
import { useClientContext } from '../client-screen';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { AnalysisContent } from './analysis-content';
import { useExportAnalysisToPdf } from './export-to-pdf';
import { useRunAnalysis } from './use-run-analysis';


export const AnalysisResults = () => {
  const { files, setAnalysisItems, analysisItems } = useClientContext();
  const { exportToPDF } = useExportAnalysisToPdf()

  const { runAnalysis, isAnalysisRunning } = useRunAnalysis();
  //   setIsAnalyzing(true);
  //   setTimeout(() => {
  //     setAnalysisItems([
  //       {
  //         type: 'success',
  //         title: 'Income Verification Complete',
  //         description: 'Pay stubs show consistent monthly income of $8,500',
  //         document: 'paystub_march_2024.pdf'
  //       },
  //       {
  //         type: 'concern',
  //         title: 'Credit Score Below Threshold',
  //         description: 'Credit score of 640 is below preferred 680 threshold',
  //         document: 'credit_report.pdf'
  //       },
  //       {
  //         type: 'warning',
  //         title: 'High Debt-to-Income Ratio',
  //         description: 'Current DTI of 42% is above recommended 36%',
  //         document: 'bank_statement.pdf'
  //       },
  //       {
  //         type: 'success',
  //         title: 'Employment History Verified',
  //         description: '3+ years consistent employment with current employer',
  //         document: 'employment_letter.pdf'
  //       }
  //     ])
  //     setIsAnalyzing(false);
  //     setAnalysisComplete(true);
  //     toast({
  //       title: "Analysis Complete",
  //       description: "Document analysis has been completed successfully",
  //     });
  //   }, 2000);
  // };

  const onRunAnalysis = async () => {
    const results = await runAnalysis()
    setAnalysisItems(results)
  }
  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analysis Results</h3>
        <div className="flex gap-2">
          <Button
            onClick={onRunAnalysis}
            disabled={isAnalysisRunning || files.length === 0}
            size="sm"
          >
            {isAnalysisRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Analyze
          </Button>
          <Button
            onClick={exportToPDF}
            disabled={analysisItems.length === 0}
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <AnalysisContent isAnalyzing={isAnalysisRunning} />
    </Card>
  );
};