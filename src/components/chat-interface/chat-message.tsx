import { Bot, User } from 'lucide-react';
import { Message } from '../../lib/persistence';
import { Avatar } from '../ui/avatar';




export const ChatMessage = ({ message }: { message: Message }) => {

  if (message.role === 'system') {
    return null
  }
  return (

    <div
      key={message.id}
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {message.role === 'user' ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </Avatar>
      <div
        className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'
          }`}
      >
        <div
          className={`inline-block p-3 rounded-lg ${message.role === 'user'
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

  );
};