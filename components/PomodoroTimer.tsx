"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  const [tasks, setTasks] = useState<Task[]>([]);
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
              task.completed ? task : { ...task, completed: true },
            ),
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
      {/* Sidebar Task List */}
      <div className="w-96 bg-white shadow-lg overflow-hidden border-r border-gray-200 rounded-lg">
        <div className="p-6 h-full flex flex-col">
          <h1 className="text-3xl font-bold mb-4">Pomodoro Timer</h1>
          <h3 className="text-xl font-bold mb-4">Task History</h3>
          <div className="overflow-y-auto flex-1">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks added yet</p>
            ) : (
              <div className="space-y-3 pb-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-lg p-4 ${
                      task.completed ? "bg-green-50" : "bg-yellow-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`font-medium ${task.completed ? "line-through" : ""}`}
                      >
                        {task.description}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      {task.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="ml-2 inline-block px-2 py-1 rounded-full text-xs bg-gray-200">
                        {task.mode} session
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Timer Section */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {mode === "work" ? "Work Time" : "Break Time"}
              </h2>

              <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    mode === "work" ? "bg-blue-500" : "bg-green-500"
                  }`}
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>

              <div className="text-6xl font-bold mb-6">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>

              <form onSubmit={handleTaskSubmit} className="mb-6">
                <input
                  type="text"
                  value={currentTask}
                  onChange={handleTaskChange}
                  placeholder="What are you working on?"
                  className="w-full p-2 border rounded mb-2"
                  disabled={isRunning}
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
                  disabled={isRunning || !currentTask.trim()}
                >
                  Set Task
                </button>
              </form>

              <div className="space-x-4">
                <button
                  onClick={handleStartPause}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  {isRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 text-center">
          <p>
            Build by{" "}
            <Link className="underline text-blue-600" href="">
              Marison
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
