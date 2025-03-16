"use client";

import React, { useState, useEffect, useRef } from "react";
import TaskSidebar from "@/components/Sidebar";
import Timer from "@/components/Timer";

interface Task {
  id: number;
  description: string;
  timestamp: Date;
  mode: "work" | "break";
  completed: boolean;
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [currentTask, setCurrentTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => loadStoredTasks());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTask(e.target.value);
  };

  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentTask.trim()) {
      const newTask: Task = {
        id: Date.now(),
        description: currentTask,
        timestamp: new Date(),
        mode: mode,
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setCurrentTask("");
    }
  };

  const calculateProgress = () => {
    const totalTime = mode === "work" ? WORK_TIME : BREAK_TIME;
    const currentTime = minutes * 60 + seconds;
    const progress = ((totalTime - currentTime) / totalTime) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  useEffect(() => {
    audioRef.current = new Audio("/notification.wav");
  }, []);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  };

  function handleStartPause() {
    setIsRunning(!isRunning);
  }

  function handleReset() {
    setIsRunning(false);
    setMode("work");
    setMinutes(25);
    setSeconds(0);
  }

  useEffect(() => {
    if (!isRunning) return;

    const timerInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timerInterval);
        playNotification();

        if (tasks.length > 0) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.completed ? task : { ...task, completed: true }
            )
          );
        }

        if (mode === "work") {
          setMode("break");
          setMinutes(5);
        } else {
          setMode("work");
          setMinutes(25);
        }
        setSeconds(0);
        setIsRunning(false);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isRunning, minutes, seconds, mode, tasks.length]);

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <TaskSidebar tasks={tasks} handleDeleteTask={handleDeleteTask} />
      <Timer
        mode={mode}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
        currentTask={currentTask}
        handleTaskChange={handleTaskChange}
        handleTaskSubmit={handleTaskSubmit}
        handleStartPause={handleStartPause}
        handleReset={handleReset}
        calculateProgress={calculateProgress}
      />
    </div>
  );
}

function loadStoredTasks(): Task[] {
  if (typeof window !== "undefined") {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      return JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        timestamp: new Date(task.timestamp),
      }));
    }
  }
  return [];
}

