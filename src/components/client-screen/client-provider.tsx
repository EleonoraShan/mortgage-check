import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { AnalysisItemI } from '../analysis/analysis.interfaces';
import { ClientDataI } from './client.interfaces';
import { 
  saveClientSessionToStorage, 
  loadClientSessionFromStorage, 
  getDefaultSessionData,
  Message 
} from '../../lib/persistence';

export interface AttachedFile {
  id: string;
  name: string;
  file: File;
  fileText: string;
  preview?: string;
  selected: boolean;
  fileAnalysisSummaryJson?: string;
}


// Message interface moved to persistence.ts

interface ClientContextProps {
  clientId: string;
  name: string;
  loanAmount: number;
  depositAmount: number;
  employmentStatus: string;
  currentRole: string;
  company: string;
  propertyType: string;
  status: string;
  files: AttachedFile[];
  addFiles: (newFiles: AttachedFile[]) => void;
  removeFile: (newFiles: string) => void;
  chatMessages: Message[];
  addChatMessages: (newMessage: Message) => void
  activeDocuments: string[]
  toggleIsActive: (id: string) => void
  analysisItems: AnalysisItemI[]
  setAnalysisItems: React.Dispatch<React.SetStateAction<AnalysisItemI[]>>
  affordabilityScore: number
  setAffordabilityScore: React.Dispatch<React.SetStateAction<number>>
  updateFileAnalysis: (id: string, analysis: string) => void
  updateClient: (clientId: string, updates: Partial<ClientDataI>) => void
}
export const ClientContext = createContext<ClientContextProps | undefined>(
  undefined,
);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      'useClientContext must be used within an ClientContextProvider provider',
    );
  }
  return context;
};

interface ClientProviderProps extends PropsWithChildren {
  clientData: ClientDataI;
  updateClient: (clientId: string, updates: Partial<ClientDataI>) => void;
}

export const ClientContextProvider = ({
  children,
  clientData,
  updateClient,
}: ClientProviderProps) => {
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [analysisItems, setAnalysisItems] = useState<AnalysisItemI[]>([])
  const [affordabilityScore, setAffordabilityScore] = useState(0)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [activeDocuments, setActiveDocuments] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load session data from localStorage when client changes
  useEffect(() => {
    const sessionData = loadClientSessionFromStorage(clientData.id);
    if (sessionData) {
      setFiles(sessionData.files);
      setChatMessages(sessionData.chatMessages);
      setActiveDocuments(sessionData.activeDocuments);
      setAnalysisItems(sessionData.analysisItems);
      setAffordabilityScore(sessionData.affordabilityScore);
    } else {
      // Initialize with default data if no session exists
      const defaultData = getDefaultSessionData();
      setFiles(defaultData.files);
      setChatMessages(defaultData.chatMessages);
      setActiveDocuments(defaultData.activeDocuments);
      setAnalysisItems(defaultData.analysisItems);
      setAffordabilityScore(defaultData.affordabilityScore);
    }
    setIsInitialized(true);
  }, [clientData.id]);

  // Save session data to localStorage whenever any session data changes
  useEffect(() => {
    if (isInitialized) {
      const sessionData = {
        files,
        chatMessages,
        activeDocuments,
        analysisItems,
        affordabilityScore
      };
      saveClientSessionToStorage(clientData.id, sessionData);
    }
  }, [files, chatMessages, activeDocuments, analysisItems, affordabilityScore, clientData.id, isInitialized]);

  const addFiles = (newFiles: AttachedFile[]) => setFiles((current) => [...current, ...newFiles])
  const addChatMessages = (newMessage: Message) => setChatMessages((current) => [...current, newMessage])

  const toggleIsActive = useCallback((id: string) => {
    if (activeDocuments.includes(id)) {
      setActiveDocuments((current) => current.filter((d) => d !== id))
    } else {
      setActiveDocuments((current) => [...current, id])
    }
  }, [setActiveDocuments, activeDocuments])

  const updateFileAnalysis = (id: string, analysis: string) => {
    setFiles((files) => files.map((file) => {
      if (file.id !== id) {
        return file
      }

      return { ...file, fileAnalysisSummaryJson: analysis }
    }))
  }

  const removeFile = useCallback((fileId: string) => setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId)), [files])
  const value = useMemo(() => {
    return {
      clientId: clientData.id,
      name: clientData.name,
      loanAmount: clientData.loanAmount,
      depositAmount: clientData.depositAmount,
      employmentStatus: clientData.employmentStatus,
      currentRole: clientData.currentRole,
      company: clientData.company,
      propertyType: clientData.propertyType,
      status: clientData.status,
      files, addFiles,
      chatMessages, addChatMessages,
      activeDocuments,
      toggleIsActive,
      removeFile,
      analysisItems,
      setAnalysisItems,
      affordabilityScore,
      setAffordabilityScore,
      updateFileAnalysis,
      updateClient
    };
  }, [clientData, files, addFiles, chatMessages, addChatMessages, toggleIsActive, activeDocuments, removeFile, analysisItems,
    setAnalysisItems, affordabilityScore, setAffordabilityScore, updateFileAnalysis, updateClient]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
