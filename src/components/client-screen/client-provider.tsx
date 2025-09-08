import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { AnalysisItemI } from '../analysis/analysis.interfaces';

export interface AttachedFile {
  id: string;
  name: string;
  file: File;
  fileText: string;
  preview?: string;
  selected: boolean;
  fileAnalysisSummaryJson?: string;
}


export interface Message {
  id: string;
  content: string;
  role: "user" | "bot" | "system";
  timestamp: Date;
}

interface ClientContextProps {
  name: string;
  loanAmount: number;
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
  clientData: ClientDataI
}

export const ClientContextProvider = ({
  children,
  clientData,
}: ClientProviderProps) => {
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [analysisItems, setAnalysisItems] = useState<AnalysisItemI[]>([])
  const [affordabilityScore, setAffordabilityScore] = useState(0)
  const [chatMessages, setChatMessages] = useState<Message[]>([{
    id: "1",
    content: "You are a helpful assigtant for a UK based mortgage broker. Your role is to analyse the documents and information submitted by the broker and determine if the client can be safely lended to. You should amongs other things verify consistency of provided information, their expenditure and any concerning spending and whether they can afford the morgage",
    role: "system",
    timestamp: new Date(),
  },
  {
    id: "2",
    content: "Hello! I'm your AI Mortgage Broker assistant. You can attach the document you want to analyse for you clients on the left. Please include any other information like the clients name, how much they are looking to borrow and the value of the property they are looking to buy in the chat ",
    role: "bot",
    timestamp: new Date(),
  }])
  const [activeDocuments, setActiveDocuments] = useState<string[]>([]);

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
      name: clientData.name,
      loanAmount: clientData.loanAmount,
      files, addFiles,
      chatMessages, addChatMessages,
      activeDocuments,
      toggleIsActive,
      removeFile,
      analysisItems,
      setAnalysisItems,
      affordabilityScore,
      setAffordabilityScore,
      updateFileAnalysis
    };
  }, [clientData, files, addFiles, chatMessages, addChatMessages, toggleIsActive, activeDocuments, removeFile, analysisItems,
    setAnalysisItems, affordabilityScore, setAffordabilityScore, updateFileAnalysis]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
