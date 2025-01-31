"use client";

import { useState, useEffect } from "react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");

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
