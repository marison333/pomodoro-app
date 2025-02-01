"use client";

import { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // New constant for total duration in seconds
  const WORK_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60;  // 5 minutes in seconds

  // Calculate progress percentage
  const calculateProgress = () => {
    // Determine total time based on current mode
    const totalTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
    // Calculate current time
    const currentTime = (minutes * 60) + seconds;
    // Calculate remaining percentage
    const progress = ((totalTime - currentTime) / totalTime) * 100;
    // Ensure progress stays between 0 and 100
    return Math.min(100, Math.max(0, progress));
  };

  // Initialize our audio element when the component mounts
  useEffect(() => {
    audioRef.current = new Audio('/notification.wav');
  }, []);

  const playNotification = () => {
    // Safety check to ensure audio is loaded
    if (audioRef.current) {
      // Reset the audio to the start
      audioRef.current.currentTime = 0;
      // Play the sound
      audioRef.current.play().catch(error => {
        console.log('Error playing audio:', error);
      });
    }
  };

  // Previous handler functions remain the same
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
    // Only set up the timer if 'isRunning' is true
    if (!isRunning) return;

    // Set up an interval that runs every 1000ms (1 second)
    const timerInterval = setInterval(() => {
      // If it has seconds remaining, just decrease seconds
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      // If It's at 0 seconds but have minutes remaining
      else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
      // If both minutes and seconds are 0, switch modes
      else {
        // Clears the interval first
        clearInterval(timerInterval);

        // Play notification when timer ends
        playNotification();

        // Switch modes and reset time
        if (mode === "work") {
          setMode("break");
          setMinutes(5); // 5-minute break
        } else {
          setMode("work");
          setMinutes(25); // 25-minute session
        }
        setSeconds(0);
        setIsRunning(false);
      }
    }, 1000);

    // Cleanup function that runs when the effect is re-run or component unmounts
    return () => clearInterval(timerInterval);
  }, [isRunning, minutes, seconds, mode]); // Dependencies array

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "work" ? "Work Time" : "Break Time"}
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
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
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
  );
}
