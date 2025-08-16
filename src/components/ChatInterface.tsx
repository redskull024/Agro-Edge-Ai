import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send, Mic, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { QuickActions } from "./QuickActions";
import { SensorAlerts } from "./SensorAlerts";
import { useToast } from "@/hooks/use-toast";
import { dialogueSystem } from "@/lib/dialogue";

export interface Message {
  id: string;
  type: "ai" | "user" | "system";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  imageUrl?: string;
  sensorData?: {
    type: string;
    value: string;
    status: "good" | "warning" | "danger";
  };
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      type: "ai",
      content: dialogueSystem.getWelcomeMessage(),
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Simulate initial sensor alerts
    setTimeout(() => {
      const sensorAlert = dialogueSystem.generateSensorAlert();
      if (sensorAlert) {
        addMessage(sensorAlert);
      }
    }, 3000);

    // Set up periodic sensor updates
    const interval = setInterval(() => {
      const alert = dialogueSystem.generateRandomAlert();
      if (alert) {
        addMessage(alert);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const response = dialogueSystem.generateResponse(userMessage);
      setIsTyping(false);
      addMessage({
        type: "ai",
        content: response,
      });
    }, 1000 + Math.random() * 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage({
      type: "user",
      content: inputValue.trim(),
    });

    simulateAIResponse(inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addMessage({
        type: "user",
        content: "I uploaded an image of my crops. Can you help diagnose what's wrong?",
        imageUrl,
      });

      // AI response to image
      setTimeout(() => {
        const response = dialogueSystem.generateImageAnalysisResponse();
        addMessage({
          type: "ai",
          content: response,
        });
      }, 2000);

      toast({
        title: "Image uploaded",
        description: "I'm analyzing your crop image...",
      });
    }
  };

  const handleQuickAction = (action: string) => {
    addMessage({
      type: "user",
      content: action,
    });
    simulateAIResponse(action);
  };

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice recording stopped" : "Voice recording started",
      description: isListening ? "Processing your message..." : "Speak now...",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-chat-bg">
      {/* Header */}
      <div className="p-4 bg-gradient-forest border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-primary-foreground">
              🌱 AgroEdge AI Assistant
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Your friendly farm companion
            </p>
          </div>
          <SensorAlerts />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Input Area */}
      <Card className="m-4 mt-0 p-4 border-t">
        <div className="flex gap-2 items-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVoiceRecording}
              className={cn(
                "shrink-0",
                isListening && "bg-accent text-accent-foreground"
              )}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Ask me about your farm..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </Card>
    </div>
  );
}