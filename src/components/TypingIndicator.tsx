import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start animate-chat-message-in">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-gradient-forest text-primary-foreground text-xs">
          🌱
        </AvatarFallback>
      </Avatar>

      <Card className="p-3 bg-chat-ai border-0 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-typing-indicator" />
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-typing-indicator [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-typing-indicator [animation-delay:0.4s]" />
        </div>
      </Card>
    </div>
  );
}