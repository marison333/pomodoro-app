import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

interface ControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default function Controls({
  isActive,
  isPaused,
  onStart,
  onPause,
  onReset,
}: ControlsProps) {
  return (
    <div className="flex space-x-2">
      {!isActive ? (
        <Button onClick={onStart} size="lg" className="w-24">
          <Play className="mr-2 h-4 w-4" />
          {isPaused ? "Resume" : "Start"}
        </Button>
      ) : (
        <Button
          onClick={onPause}
          size="lg"
          variant="secondary"
          className="w-24"
        >
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}
      <Button onClick={onReset} size="lg" variant="outline">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
