import { Bot } from "lucide-react"
import { Avatar } from "../ui/avatar"

export const ChatMessageLoading = () => {
  return (
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
  )
}