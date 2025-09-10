import { Send } from 'lucide-react';
import ollama from 'ollama/browser'
import { useState } from 'react';
import { useClientContext } from '../client-screen';
import { Message } from '../../lib/persistence';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getModelName } from '../../config/model-config';


export const ChatInput = ({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { chatMessages, addChatMessages } = useClientContext();

  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    addChatMessages(userMessage);
    setInputMessage('');
    setIsLoading(true);

    const response = await ollama.chat({
      model: getModelName(),
      messages: chatMessages,
    })
    const responseString = response.message.content;

    addChatMessages({
      id: Date.now().toString(),
      role: 'bot',
      content: responseString,
      timestamp: new Date()
    })

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
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
  );
};