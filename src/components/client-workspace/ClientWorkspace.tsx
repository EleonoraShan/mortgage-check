import { AnalysisResults } from '../analysis/AnalysisResults';
import { ChatInterface } from '../chat-interface/ChatInterface';
import { ClientDetails } from '../client-details';
import { DocumentManager } from '../document-manages/DocumentManager';


export const ClientWorkspace = () => {
  return (
    <div className="flex flex-1 overflow-hidden grid grid-cols-3 gap-6 p-6">
      {/* Left Panel - Documents and Client Info */}
      <div className="flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* flex flex-1 flex-row grid grid-row-2 gap-6 */}
        <div className='space-y-6'>

          <ClientDetails />

          <DocumentManager />

        </div>
      </div>

      {/* Middle Panel - Analysis Results */}
      <div className="flex-1 overflow-y-auto">
        <AnalysisResults />
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 overflow-y-auto">
        <ChatInterface />
      </div>
    </div>
  );
};