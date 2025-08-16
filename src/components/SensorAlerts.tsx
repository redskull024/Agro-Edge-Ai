import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Thermometer, Droplets, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SensorData {
  id: string;
  type: string;
  value: string;
  status: "good" | "warning" | "danger";
  icon: React.ReactNode;
  timestamp: Date;
}

export function SensorAlerts() {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "temp",
      type: "Temperature",
      value: "24°C",
      status: "good",
      icon: <Thermometer className="h-3 w-3" />,
      timestamp: new Date(),
    },
    {
      id: "moisture",
      type: "Soil Moisture",
      value: "15%",
      status: "warning",
      icon: <Droplets className="h-3 w-3" />,
      timestamp: new Date(),
    },
    {
      id: "ph",
      type: "Soil pH",
      value: "6.8",
      status: "good",
      icon: <Zap className="h-3 w-3" />,
      timestamp: new Date(),
    },
  ]);

  const [hasNewAlerts, setHasNewAlerts] = useState(false);

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const random = Math.random();
          let newStatus: "good" | "warning" | "danger" = sensor.status;
          let newValue = sensor.value;

          // Occasionally change sensor values
          if (random < 0.3) {
            if (sensor.id === "temp") {
              const temp = 20 + Math.random() * 15;
              newValue = `${temp.toFixed(1)}°C`;
              newStatus = temp > 30 ? "warning" : temp > 35 ? "danger" : "good";
            } else if (sensor.id === "moisture") {
              const moisture = Math.random() * 100;
              newValue = `${moisture.toFixed(0)}%`;
              newStatus = moisture < 20 ? "danger" : moisture < 40 ? "warning" : "good";
            } else if (sensor.id === "ph") {
              const ph = 5.5 + Math.random() * 3;
              newValue = ph.toFixed(1);
              newStatus = ph < 6 || ph > 8 ? "warning" : "good";
            }

            if (newStatus !== sensor.status) {
              setHasNewAlerts(true);
            }

            return {
              ...sensor,
              value: newValue,
              status: newStatus,
              timestamp: new Date(),
            };
          }
          return sensor;
        })
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const alertCount = sensors.filter(s => s.status !== "good").length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative border-white/20 text-primary-foreground hover:bg-white/10",
            hasNewAlerts && "animate-pulse-gentle"
          )}
          onClick={() => setHasNewAlerts(false)}
        >
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {alertCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Live Sensor Data</h4>
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                {sensor.icon}
                <span className="text-sm font-medium">{sensor.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{sensor.value}</span>
                <Badge
                  variant={
                    sensor.status === "good"
                      ? "default"
                      : sensor.status === "warning"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {sensor.status}
                </Badge>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}