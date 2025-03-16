export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export interface TimerSettings {
  pomodoro: number; // Duration in minutes
  shortBreak: number; // Duration in minutes
  longBreak: number; // Duration in minutes
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number; // Number of pomodoros before a long break
  soundEnabled: boolean;
}

export interface TimerState {
  mode: TimerMode;
  timeRemaining: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  completedPomodoros: number;
  pomodorosUntilLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  mode: TimerMode;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  completed: boolean;
}
