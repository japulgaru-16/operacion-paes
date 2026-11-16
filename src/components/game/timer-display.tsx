"use client";

interface TimerDisplayProps {
  remainingMs: number;
  totalSeconds: number;
}

export function TimerDisplay({ remainingMs, totalSeconds }: TimerDisplayProps) {
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  const frac = totalSeconds > 0 ? Math.min(1, Math.max(0, remainingMs / (totalSeconds * 1000))) : 0;

  const danger = totalSec <= 60;
  const warning = !danger && frac <= 0.5;

  const colorClass = danger
    ? "text-red-500 game-timer game-timer-blink"
    : warning
      ? "text-amber-400 game-timer game-timer-amber"
      : "text-zinc-100 game-timer";

  return (
    <div
      className="rounded-xl border border-white/10 bg-zinc-950 p-4 text-center"
      role="timer"
      aria-label={`Tiempo restante: ${minutes} minutos ${seconds} segundos`}
      aria-live="off"
    >
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
        DETONACIÓN EN
      </p>
      <p
        className={`font-mono text-6xl font-black tabular-nums leading-none sm:text-7xl ${colorClass}`}
      >
        {minutes}:{String(seconds).padStart(2, "0")}
      </p>
      <div
        className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(frac * 100)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${
            danger ? "bg-red-500" : warning ? "bg-amber-400" : "bg-emerald-400"
          }`}
          style={{ width: `${frac * 100}%` }}
        />
      </div>
    </div>
  );
}
