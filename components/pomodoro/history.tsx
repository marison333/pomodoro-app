// components/pomodoro/history.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PomodoroSession, TimerMode } from "@/lib/types";

interface HistoryProps {
  sessions: PomodoroSession[];
}

export default function History({ sessions }: HistoryProps) {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getModeLabel = (mode: TimerMode): string => {
    switch (mode) {
      case "pomodoro":
        return "Focus";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return mode;
    }
  };

  // Group sessions by day
  const sessionsByDay = sessions.reduce(
    (acc, session) => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    },
    {} as Record<string, PomodoroSession[]>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HistoryIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Session History</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {Object.keys(sessionsByDay).length > 0 ? (
            Object.entries(sessionsByDay)
              .sort(
                (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
              )
              .map(([date, daySessions]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{date}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daySessions
                        .sort(
                          (a, b) =>
                            new Date(b.startTime).getTime() -
                            new Date(a.startTime).getTime()
                        )
                        .map((session) => (
                          <TableRow key={session.id}>
                            <TableCell>
                              {new Date(session.startTime).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>{getModeLabel(session.mode)}</TableCell>
                            <TableCell>
                              {formatDuration(session.duration)}
                            </TableCell>
                            <TableCell>
                              {session.completed ? "Completed" : "Incomplete"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No sessions yet. Complete a pomodoro to see history.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
