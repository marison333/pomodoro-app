import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getTitle(mode: string): string {
  switch (mode) {
    case "pomodoro":
      return "Focus Time";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
    default:
      return "Pomodoro Timer";
  }
}
