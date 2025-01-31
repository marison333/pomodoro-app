import PomodoroTimer from "@/components/PomodoroTimer";

export default function Home() {
  return (
    <div className="container max-w-5xl mx-auto">
      <main className="mt-8 mx-auto">
        <h1 className="text-center font-bold text-3xl">Pomodoro Timer</h1>
        <PomodoroTimer />
      </main>
    </div>
  );
}
