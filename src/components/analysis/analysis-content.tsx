import { useClientContext } from '../client-screen';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { AnalysisItemCard } from './analysis-item';
import { AnalysisLoading } from './analysis-loading';
import { NoFilesOrAnalysis } from './no-files';


export const AnalysisContent = ({ isAnalyzing }: { isAnalyzing: boolean }) => {
  const { files, loanAmount, analysisItems } = useClientContext();


  const affordabilityScore = Math.max(0, Math.min(100,
    85 - (loanAmount > 400000 ? 20 : 0) - (analysisItems.filter(a => a.type === 'concern').length * 10)
  ));

  if (isAnalyzing) {
    return <AnalysisLoading />
  }

  if (files.length === 0 || analysisItems.length === 0) {
    return <NoFilesOrAnalysis noFiles={files.length === 0} />
  }


  return (

    <ScrollArea className="h-[500px]">
      <div className="space-y-6">
        {/* Affordability Score */}
        <div className="p-4 bg-accent rounded-lg">
          <h4 className="font-semibold mb-2">Affordability Assessment</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Loan Amount: ${loanAmount.toLocaleString()}</span>
                <span className={affordabilityScore >= 70 ? 'text-success' : affordabilityScore >= 50 ? 'text-warning' : 'text-destructive'}>
                  {affordabilityScore}%
                </span>
              </div>
              <Progress value={affordabilityScore} className="h-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {affordabilityScore >= 70
              ? 'Client appears to be able to afford this loan amount'
              : affordabilityScore >= 50
                ? 'Client may face challenges with this loan amount'
                : 'Client likely cannot afford this loan amount'
            }
          </p>
        </div>

        {/* Analysis Items */}
        <div className="space-y-3">
          <h4 className="font-semibold">Document Analysis</h4>
          {analysisItems.map((item, index) => (
            <AnalysisItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </ScrollArea>

  );
};