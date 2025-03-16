import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Controls from "./controls";
import { usePomodoro } from "@/hooks/use-pomodoro";
import { TimerMode } from "@/lib/types";

export default function Timer() {
  const { settings, timerState, displayTime, actions } = usePomodoro();

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalTime = (() => {
      switch (timerState.mode) {
        case "pomodoro":
          return settings.pomodoro * 60;
        case "shortBreak":
          return settings.shortBreak * 60;
        case "longBreak":
          return settings.longBreak * 60;
        default:
          return settings.pomodoro * 60;
      }
    })();

    return Math.round(
      ((totalTime - timerState.timeRemaining) / totalTime) * 100
    );
  };

  const modeLabels: Record<TimerMode, string> = {
    pomodoro: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center space-x-4 mb-6">
          {(["pomodoro", "shortBreak", "longBreak"] as TimerMode[]).map(
            (mode) => (
              <button
                key={mode}
                onClick={() => actions.changeMode(mode)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  timerState.mode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {modeLabels[mode]}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-7xl font-bold mb-8">{displayTime}</h2>

          <Progress value={calculateProgress()} className="w-full h-2 mb-8" />

          <div className="flex items-center justify-center">
            <Controls
              isActive={timerState.isActive}
              isPaused={timerState.isPaused}
              onStart={actions.startTimer}
              onPause={actions.pauseTimer}
              onReset={actions.resetTimer}
            />
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            <p>Completed Pomodoros: {timerState.completedPomodoros}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
