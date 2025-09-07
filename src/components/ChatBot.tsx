import { Bot, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { useToast } from '../hooks/use-toast';

interface ChatInterfaceProps {
  clientName: string;
  documents: File[];
  loanAmount: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatInterface = ({ clientName, documents, loanAmount }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your AI assistant ready to help analyze ${clientName}'s mortgage application. I can discuss the document analysis results, answer questions about affordability, and provide insights based on the ${documents.length} document(s) you've uploaded.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate Ollama API call - in real app this would call your backend
    setTimeout(() => {
      const responses = [
        `Based on the analysis of ${clientName}'s documents, I can see several key factors affecting their loan eligibility for $${loanAmount.toLocaleString()}.`,
        `The debt-to-income ratio appears to be a concern. With the requested loan amount of $${loanAmount.toLocaleString()}, this might impact approval chances.`,
        `From the documents provided, the employment history looks stable. This is a positive factor for the mortgage application.`,
        `I'd recommend reviewing the credit report more closely. The score might need improvement before proceeding with this loan amount.`,
        `Would you like me to elaborate on any specific aspect of the analysis? I can provide more details about income verification, credit assessment, or debt calculations.`
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bot className="h-4 w-4" />
          <span>Ollama Connected</span>
        </div>
      </div>

      <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4 pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </Avatar>
              <div
                className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'
                  }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <Bot className="h-4 w-4" />
              </Avatar>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask about the analysis results..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};