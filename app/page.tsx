import PomodoroTimer from "@/components/PomodoroTimer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container max-w-5xl mx-auto">
      <main className="mt-8 mx-auto">
        <h1 className="text-center font-bold text-3xl">Pomodoro Timer</h1>
        <PomodoroTimer />
        <p className="text-center my-1.5">
          Build by{" "}
          <Link
            className="underline text-blue-600"
            href="https://github.com/marison333"
          >
            Marison Sol
          </Link>
        </p>
      </main>
    </div>
  );
}
