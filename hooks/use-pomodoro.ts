import { useState, useEffect, useRef, useCallback } from "react";
import {
  TimerMode,
  TimerSettings,
  TimerState,
  PomodoroSession,
} from "@/lib/types";

const DEFAULT_SETTINGS: TimerSettings = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  longBreakInterval: 4,
  soundEnabled: true,
};

export function usePomodoro() {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>({
    mode: "pomodoro",
    timeRemaining: DEFAULT_SETTINGS.pomodoro * 60,
    isActive: false,
    isPaused: false,
    completedPomodoros: 0,
    pomodorosUntilLongBreak: DEFAULT_SETTINGS.longBreakInterval,
  });
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmSound = useRef<HTMLAudioElement | null>(null);
  const currentSessionRef = useRef<PomodoroSession | null>(null);

  // Initialize audio on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmSound.current = new Audio("/sounds/alarm.wav");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate time for selected mode
  const getTimeForMode = useCallback(
    (mode: TimerMode): number => {
      switch (mode) {
        case "pomodoro":
          return settings.pomodoro * 60;
        case "shortBreak":
          return settings.shortBreak * 60;
        case "longBreak":
          return settings.longBreak * 60;
        default:
          return settings.pomodoro * 60;
      }
    },
    [settings]
  );

  // Change timer mode
  const changeMode = useCallback(
    (mode: TimerMode) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setTimerState((prev) => ({
        ...prev,
        mode,
        timeRemaining: getTimeForMode(mode),
        isActive: false,
        isPaused: false,
      }));
    },
    [getTimeForMode]
  );

  // Start timer
  const startTimer = useCallback(() => {
    if (timerState.isPaused) {
      setTimerState((prev) => ({ ...prev, isPaused: false, isActive: true }));
    } else {
      // Create new session when starting
      const newSession: PomodoroSession = {
        id: Date.now().toString(),
        mode: timerState.mode,
        startTime: new Date(),
        endTime: null,
        duration: getTimeForMode(timerState.mode),
        completed: false,
      };

      currentSessionRef.current = newSession;
      setTimerState((prev) => ({ ...prev, isActive: true }));
    }

    intervalRef.current = setInterval(() => {
      setTimerState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(intervalRef.current!);

          // Play sound if enabled
          if (settings.soundEnabled && alarmSound.current) {
            alarmSound.current
              .play()
              .catch((err) => console.error("Error playing sound:", err));
          }

          // Complete the current session
          if (currentSessionRef.current) {
            const completedSession: PomodoroSession = {
              ...currentSessionRef.current,
              endTime: new Date(),
              completed: true,
            };
            setSessions((prev) => [...prev, completedSession]);
            currentSessionRef.current = null;
          }

          // Handle session completion based on current mode
          if (prev.mode === "pomodoro") {
            const newCompletedPomodoros = prev.completedPomodoros + 1;
            const newPomodorosUntilLongBreak = prev.pomodorosUntilLongBreak - 1;

            // Determine if we should take a long break or short break
            const nextMode: TimerMode =
              newPomodorosUntilLongBreak <= 0 ? "longBreak" : "shortBreak";

            // Reset pomodoros until long break if needed
            const resetCounter = newPomodorosUntilLongBreak <= 0;

            return {
              ...prev,
              isActive: settings.autoStartBreaks,
              timeRemaining: getTimeForMode(nextMode),
              mode: nextMode,
              completedPomodoros: newCompletedPomodoros,
              pomodorosUntilLongBreak: resetCounter
                ? settings.longBreakInterval
                : newPomodorosUntilLongBreak,
            };
          } else {
            // After break, start a new pomodoro if auto-start is enabled
            return {
              ...prev,
              isActive: settings.autoStartPomodoros,
              timeRemaining: getTimeForMode("pomodoro"),
              mode: "pomodoro",
            };
          }
        }

        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);
  }, [timerState, settings, getTimeForMode]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimerState((prev) => ({ ...prev, isPaused: true, isActive: false }));
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Cancel current session
    if (currentSessionRef.current) {
      currentSessionRef.current = null;
    }

    setTimerState((prev) => ({
      ...prev,
      timeRemaining: getTimeForMode(prev.mode),
      isActive: false,
      isPaused: false,
    }));
  }, [getTimeForMode]);

  // Update settings
  const updateSettings = useCallback(
    (newSettings: Partial<TimerSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };

        // If we're updating the time for the current mode, also update the time remaining
        if (
          (timerState.mode === "pomodoro" &&
            newSettings.pomodoro !== undefined) ||
          (timerState.mode === "shortBreak" &&
            newSettings.shortBreak !== undefined) ||
          (timerState.mode === "longBreak" &&
            newSettings.longBreak !== undefined)
        ) {
          resetTimer();
        }

        return updated;
      });
    },
    [timerState.mode, resetTimer]
  );

  // Format time for display (mm:ss)
  const formatTime = useCallback(() => {
    const minutes = Math.floor(timerState.timeRemaining / 60);
    const seconds = timerState.timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timerState.timeRemaining]);

  return {
    settings,
    timerState,
    sessions,
    displayTime: formatTime(),
    actions: {
      startTimer,
      pauseTimer,
      resetTimer,
      changeMode,
      updateSettings,
    },
  };
}
