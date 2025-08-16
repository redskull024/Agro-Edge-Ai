import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Thermometer, Droplets, Sprout, Users } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const quickActions = [
    {
      icon: <Thermometer className="h-4 w-4" />,
      label: "Check weather",
      action: "What's the weather looking like for my crops today?",
    },
    {
      icon: <Droplets className="h-4 w-4" />,
      label: "Soil moisture",
      action: "How's my soil moisture levels?",
    },
    {
      icon: <Sprout className="h-4 w-4" />,
      label: "Growth tips",
      action: "Any tips for better crop growth?",
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Expert help",
      action: "I need help from an expert",
    },
  ];

  return (
    <Card className="mx-4 mb-2 p-3 border-t-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickActions.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onAction(item.action)}
            className="h-auto p-3 flex flex-col gap-1 text-xs hover:bg-accent/50"
          >
            {item.icon}
            <span className="text-center leading-tight">{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}