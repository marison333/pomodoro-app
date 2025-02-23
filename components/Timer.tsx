import React from "react";

interface TimerProps {
  mode: "work" | "break";
  minutes: number;
  seconds: number;
  isRunning: boolean;
  currentTask: string;
  handleTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleStartPause: () => void;
  handleReset: () => void;
  calculateProgress: () => number;
}

const Timer: React.FC<TimerProps> = ({
  mode,
  minutes,
  seconds,
  isRunning,
  currentTask,
  handleTaskChange,
  handleTaskSubmit,
  handleStartPause,
  handleReset,
  calculateProgress,
}) => {
  return (
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
          <a className="underline text-blue-600" href="">
            Marison
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Timer;
