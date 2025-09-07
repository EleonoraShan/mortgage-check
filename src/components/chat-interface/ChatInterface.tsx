import { Bot } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useClientContext } from '../client-screen';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { ChatMessageLoading } from './chat-message-loading';




export const ChatInterface = () => {
  const { chatMessages } = useClientContext();

  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);


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
          {chatMessages.map((message) => (
            <ChatMessage message={message} />
          ))}
          {isLoading && (
            <ChatMessageLoading />
          )}
        </div>
      </ScrollArea>

      <ChatInput setIsLoading={setIsLoading} isLoading={isLoading} />
    </Card>
  );
};