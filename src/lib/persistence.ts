import { AnalysisItemI } from '../components/analysis/analysis.interfaces';
import { AttachedFile } from '../components/client-screen/client-provider';
import { ClientDataI } from '../components/client-screen/client.interfaces';

export interface Message {
  id: string;
  content: string;
  role: "user" | "bot" | "system";
  timestamp: Date;
}

export interface ClientSessionData {
  files: AttachedFile[];
  chatMessages: Message[];
  activeDocuments: string[];
  analysisItems: AnalysisItemI[];
  affordabilityScore: number;
}

const id = 'a1'

const STORAGE_KEYS = {
  CLIENTS: `mortgage-check-clients-${id}`,
  ACTIVE_CLIENT: `mortgage-check-active-client-${id}`,
  CLIENT_SESSION: (clientId: string) => `mortgage-check-session-${clientId}-${id}`,
  WELCOME_SEEN: `mortgage-check-welcome-seen-${id}`,
};

// Client data persistence
export const saveClientsToStorage = (clients: ClientDataI[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (error) {
    console.error('Failed to save clients to localStorage:', error);
  }
};

export const loadClientsFromStorage = (): ClientDataI[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load clients from localStorage:', error);
  }
  return [];
};

export const saveActiveClientToStorage = (clientId: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CLIENT, clientId);
  } catch (error) {
    console.error('Failed to save active client to localStorage:', error);
  }
};

export const loadActiveClientFromStorage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CLIENT);
  } catch (error) {
    console.error('Failed to load active client from localStorage:', error);
    return null;
  }
};

// Client session data persistence
export const saveClientSessionToStorage = (clientId: string, sessionData: ClientSessionData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION(clientId), JSON.stringify(sessionData));
  } catch (error) {
    console.error('Failed to save client session to localStorage:', error);
  }
};

export const loadClientSessionFromStorage = (clientId: string): ClientSessionData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CLIENT_SESSION(clientId));
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      if (parsed.chatMessages) {
        parsed.chatMessages = parsed.chatMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load client session from localStorage:', error);
  }
  return null;
};

export const clearClientSessionFromStorage = (clientId: string) => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CLIENT_SESSION(clientId));
  } catch (error) {
    console.error('Failed to clear client session from localStorage:', error);
  }
};

// App-level flags
export const saveWelcomeSeenToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.WELCOME_SEEN, 'true');
  } catch (error) {
    console.error('Failed to save welcome seen flag to localStorage:', error);
  }
};

export const loadWelcomeSeenFromStorage = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN) === 'true';
  } catch (error) {
    console.error('Failed to load welcome seen flag from localStorage:', error);
    return false;
  }
};

// Default session data
export const getDefaultSessionData = (): ClientSessionData => ({
  files: [],
  chatMessages: [
    {
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
    }
  ],
  activeDocuments: [],
  analysisItems: [],
  affordabilityScore: 0
});

