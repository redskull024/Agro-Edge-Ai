import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Message } from "./ChatInterface";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.type === "ai";
  const isSystem = message.type === "system";

  return (
    <div
      className={cn(
        "flex gap-3 animate-chat-message-in",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-gradient-forest text-primary-foreground text-xs">
            🌱
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] space-y-2",
          isAI && "order-2"
        )}
      >
        <Card
          className={cn(
            "p-3 border-0 shadow-sm",
            isAI ? "bg-chat-ai" : "bg-chat-user text-primary-foreground",
            isSystem && "bg-muted"
          )}
        >
          {message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt="Uploaded crop image"
                className="rounded-lg max-w-full h-auto max-h-48 object-cover"
              />
            </div>
          )}
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {message.sensorData && (
            <div className="mt-3 p-2 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{message.sensorData.type}</span>
                <Badge
                  variant={
                    message.sensorData.status === "good"
                      ? "default"
                      : message.sensorData.status === "warning"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {message.sensorData.value}
                </Badge>
              </div>
            </div>
          )}
        </Card>

        <div
          className={cn(
            "text-xs text-muted-foreground px-1",
            !isAI && "text-right"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {!isAI && !isSystem && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}