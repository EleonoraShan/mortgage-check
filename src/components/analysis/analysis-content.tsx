import { useClientContext } from '../client-screen';
import { ScrollArea } from '../ui/scroll-area';
import { AnalysisItemCard } from './analysis-item';
import { AnalysisLoading } from './analysis-loading';
import { NoFilesOrAnalysis } from './no-files';


export const AnalysisContent = ({ isAnalyzing }: { isAnalyzing: boolean }) => {
  const { files, activeDocuments, analysisItems } = useClientContext();

  if (isAnalyzing) {
    return <AnalysisLoading />
  }

  // Check if there's an error item (analysis failed)
  const hasError = analysisItems.some(item => item.risk_status === 'Insufficient Information' && item.title === 'Analysis Failed');

  console.log({ analysisItems, files, activeDocuments })

  if (((files.length === 0 || activeDocuments.length === 0) && analysisItems.length === 0) || analysisItems.length === 0 || hasError) {
    return <NoFilesOrAnalysis noFiles={files.length === 0} />
  }


  return (
    <ScrollArea className="h-full">
      <div className="space-y-3">
        {analysisItems.map((item, index) => (
          <AnalysisItemCard key={index} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
};