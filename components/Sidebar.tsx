import React from "react";

type Task = {
  id: number;
  description: string;
  timestamp: Date;
  mode: "work" | "break";
  completed: boolean;
}

interface SidebarProps {
  tasks: Task[];
  handleDeleteTask: (id: number) => void;
}

const TaskSidebar: React.FC<SidebarProps> = ({
  tasks,
  handleDeleteTask,
}) => {
  return (
    <div className="w-96 bg-white shadow-lg overflow-hidden border-r border-gray-200 rounded-lg">
      <aside className="p-6 h-full flex flex-col">
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
      </aside>
    </div>
  );
};

export default TaskSidebar;
