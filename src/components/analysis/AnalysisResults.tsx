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
    try {
      console.log('Starting analysis...')
      const results = await runAnalysis()
      console.log('Analysis completed, setting results:', results)
      setAnalysisItems(results)
    } catch (error) {
      console.error('Analysis failed:', error)
      // Set a simple error result to show the user what happened
      setAnalysisItems([{
        type: 'error',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred during analysis',
        document: 'System'
      }])
    }
  }

  const onExportPDF = async () => {
    await exportToPDF()
  }
  return (
    <Card className="p-4 sm:p-6 h-full overflow-hidden flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-3 lg:gap-0">
        <h3 className="text-lg font-semibold">Analysis Results</h3>
        <div className="flex flex-col lg:flex-row gap-2">
          <Button
            onClick={onRunAnalysis}
            disabled={isAnalysisRunning || files.length === 0}
            size="sm"
            className="w-full lg:w-auto"
          >
            {isAnalysisRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Analyze
          </Button>
          <Button
            onClick={onExportPDF}
            disabled={analysisItems.length === 0}
            size="sm"
            variant="outline"
            className="w-full lg:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <AnalysisContent isAnalyzing={isAnalysisRunning} />
      </div>
    </Card>
  );
};