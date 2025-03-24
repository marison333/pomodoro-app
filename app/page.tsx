"use client";

import { useState, useEffect } from "react";
import Timer from "@/components/pomodoro/timer";
import Settings from "@/components/pomodoro/settings";
import History from "@/components/pomodoro/history";
import { usePomodoro } from "@/hooks/use-pomodoro";

export default function Home() {
  const { settings, timerState, displayTime, sessions, actions } =
    usePomodoro();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
          <div className="flex space-x-2">
            <History sessions={sessions} />
            <Settings
              settings={settings}
              onUpdateSettings={actions.updateSettings}
            />
          </div>
        </div>
        <Timer
          settings={settings}
          timerState={timerState}
          displayTime={displayTime}
          actions={actions}
        />
      </div>
    </main>
  );
}
