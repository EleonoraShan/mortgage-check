import { AnalysisResults } from '../analysis/AnalysisResults';
import { ClientDetails } from '../client-details';
import { DocumentManager } from '../document-manages/DocumentManager';


export const ClientWorkspace = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden p-4 lg:p-6">
      {/* Two columns (50/50): Left (ClientDetails + DocumentManager), Right (AnalysisResults) */}
      <div className="flex flex-1 min-w-0 gap-4 lg:gap-6">
        {/* Left Column - Client Details + Document Manager (stacked) */}
        <div className="flex flex-col basis-1/2 min-w-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-4 lg:space-y-6 pr-1">
              <ClientDetails />
              <DocumentManager />
            </div>
          </div>
        </div>

        {/* Right Column - Analysis Results */}
        <div className="flex flex-col basis-1/2 min-w-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="pl-1">
              <AnalysisResults />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};