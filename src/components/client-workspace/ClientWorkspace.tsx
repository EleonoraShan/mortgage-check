import { AnalysisResults } from '../analysis/AnalysisResults';
import { ChatInterface } from '../chat-interface/ChatInterface';
import { ClientDetails } from '../client-details';
import { DocumentManager } from '../document-manages/DocumentManager';


export const ClientWorkspace = () => {
  return (
    <div className="flex flex-1 overflow-hidden p-4 lg:p-6">
      {/* Perfect center symmetry with no gap - panels touch in the middle */}
      <div className="flex flex-1 min-w-0">
        {/* Left Panel - Documents and Client Info */}
        <div className="flex flex-col flex-1 min-w-0 pr-2 lg:pr-3">
          <div className="space-y-4 lg:space-y-6 flex-1 overflow-y-auto">
            <ClientDetails />
            <DocumentManager />
          </div>
        </div>

        {/* Right Panel - Analysis Results */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden pl-2 lg:pl-3">
          <AnalysisResults />
        </div>

        {/* Right Panel - Chat Interface - COMMENTED OUT */}
        {/* <div className="flex-1 overflow-y-auto">
          <ChatInterface />
        </div> */}
      </div>
    </div>
  );
};