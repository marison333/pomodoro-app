"use client";

import React, { useState, useEffect, useRef } from "react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTask, setCurrentTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // handles task input changes
  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTask(e.target.value);
  }

  // Handles task submissions
  const handleTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentTask.trim()) {
      const newTask: Task = {
        id: Date.now(),
        description: currentTask,
        timestamp: new Date(),
        mode: mode,
        completed: false
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      setCurrentTask(""); // clears input after submission
    }
  };

  // for progress bar
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const calculateProgress = () => {
    const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
    const currentTime = (minutes * 60) + seconds;
    const progress = ((totalTime - currentTime) / totalTime) * 100;

    return Math.min(100, Math.max(0, progress));
  };

  // Initialize our audio element when the component mounts
  useEffect(() => {
    audioRef.current = new Audio('/notification.wav');
  }, []);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Error playing audio:', error);
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
        // Clears the interval first then plays audio
        clearInterval(timerInterval);
        playNotification();

        if (tasks.length > 0) {
          setTasks(prevTasks =>
          prevTasks.map(task =>
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
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {mode === 'work' ? 'Work Time' : 'Break Time'}
          </h2>

          {/* Progress bar container */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
            {/* Actual progress bar */}
            <div
                className={`h-full rounded-full transition-all duration-1000 ${
                    mode === 'work' ? 'bg-blue-500' : 'bg-green-500'
                }`}
                style={{ width: `${calculateProgress()}%` }}
            />
          </div>

          <div className="text-6xl font-bold mb-6">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          {/* Task input form */}
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

          {/* Timer controls */}
          <div className="space-x-4 mb-8">
            <button
                onClick={handleStartPause}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Reset
            </button>
          </div>

          {/* Task list section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Task List</h3>
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks added yet</p>
            ) : (
                <div className="space-y-2">
                  {tasks.map(task => (
                      <div
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded ${
                              task.completed
                                  ? 'bg-green-100'
                                  : 'bg-yellow-100'
                          }`}
                      >
                        <div className="justify-items-start">
                          <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                          <div className="text-sm text-gray-600">
                            {task.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {task.mode} session
                          </div>
                        </div>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
