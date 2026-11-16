"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bomb, Loader2, Skull, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGameStore, cancelAdvance, scheduleAdvance } from "@/lib/game/store";
import { sfx } from "@/lib/game/sounds";
import { BombVisual } from "./bomb-visual";
import { TimerDisplay } from "./timer-display";
import { QuestionCard } from "./question-card";
import { ManualDialog } from "./manual-dialog";
import { MuteButton } from "./mute-button";

export function GameScreen() {
  const phase = useGameStore((s) => s.phase);
  const bomb = useGameStore((s) => s.bomb);
  const moduleId = useGameStore((s) => s.module);
  const queue = useGameStore((s) => s.queue);
  const queueIndex = useGameStore((s) => s.queueIndex);
  const modules = useGameStore((s) => s.modules);
  const currentModule = useGameStore((s) => s.currentModule);
  const strikes = useGameStore((s) => s.strikes);
  const selected = useGameStore((s) => s.selected);
  const feedback = useGameStore((s) => s.feedback);
  const remainingMs = useGameStore((s) => s.remainingMs);
  const totalSeconds = useGameStore((s) => s.totalSeconds);
  const lastPenalty = useGameStore((s) => s.lastPenalty);
  const answered = useGameStore((s) => s.answered);
  const loading = useGameStore((s) => s.loading);
  const answer = useGameStore((s) => s.answer);
  const tick = useGameStore((s) => s.tick);
  const abort = useGameStore((s) => s.abort);

  const lastSecondRef = useRef<number>(-1);

  // Reloj: tic cada 200 ms + sonidos de cuenta regresiva
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      tick();
      const s = useGameStore.getState();
      const sec = Math.ceil(s.remainingMs / 1000);
      if (sec !== lastSecondRef.current) {
        lastSecondRef.current = sec;
        if (sec > 0 && sec <= 10) sfx.play("urgent");
        else if (sec > 10 && sec <= 30) sfx.play("tick");
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase, tick]);

  // Avance automático tras feedback (mientras se muestra la explicación)
  useEffect(() => {
    if (feedback === "correct") scheduleAdvance(2100);
    else if (feedback === "wrong") scheduleAdvance(3600);
    return () => cancelAdvance();
  }, [feedback]);

  // Limpieza al desmontar
  useEffect(() => cancelAdvance, []);

  if (!bomb || phase !== "playing") return null;

  if (loading) {
    return (
      <div className="game-grid-bg grid min-h-screen place-items-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="size-10 animate-spin text-red-500" aria-hidden />
          <p className="font-mono text-sm tracking-widest text-zinc-400">
            ARMANDO EL ARTEFACTO {bomb.codename}…
          </p>
        </div>
      </div>
    );
  }

  const question = queue[queueIndex] ?? null;
  const defusedCount = modules.filter((m) => m === "defused").length;
  const totalSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const miniTimer = `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, "0")}`;

  return (
    <div className="game-grid-bg relative flex min-h-screen flex-col">
      {/* Destello rojo por error (se reproduce una vez por respuesta incorrecta) */}
      {feedback === "wrong" && (
        <div
          key={`flash-${answered}`}
          className="game-flash pointer-events-none fixed inset-0 z-50 bg-red-600/35"
          aria-hidden
        />
      )}

      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-2.5 sm:px-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abortar desactivación"
                className="size-9 shrink-0 text-zinc-400 hover:bg-red-500/15 hover:text-red-400"
              >
                <Unplug className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/15 bg-zinc-950 text-zinc-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  ¿Abortar la desactivación?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  La bomba {bomb.codename} quedará activa y esta partida no se guardará en las
                  estadísticas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white">
                  Seguir desactivando
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-500"
                  onClick={abort}
                >
                  Abortar misión
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs font-bold tracking-widest text-zinc-200 sm:text-sm">
              {bomb.name}
            </p>
            <p className="truncate text-[10px] text-zinc-500">
              {bomb.codename} · Eje {bomb.ejeLabel} · Módulo {moduleId}
            </p>
          </div>

          {/* Timer compacto móvil */}
          <p
            className={`font-mono text-lg font-black tabular-nums lg:hidden ${
              totalSec <= 60 ? "text-red-500" : "text-zinc-200"
            }`}
            aria-hidden
          >
            {miniTimer}
          </p>

          {/* Strikes */}
          <div className="hidden items-center gap-1.5 sm:flex" aria-label={`${strikes} fallos de 3`}>
            <Skull className="size-4 text-zinc-600" aria-hidden />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`size-2.5 rounded-full border transition ${
                  i < strikes
                    ? "game-pulse border-red-400 bg-red-500 shadow-[0_0_8px_#ef4444]"
                    : "border-zinc-700 bg-zinc-800"
                }`}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <ManualDialog bomb={bomb} module={moduleId} />
          </div>
          <MuteButton />
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Columna del artefacto */}
          <div className="order-2 space-y-4 lg:order-1 lg:sticky lg:top-24">
            <TimerDisplay remainingMs={remainingMs} totalSeconds={totalSeconds} />

            <div className={feedback === "wrong" ? "game-shake" : undefined}>
              <BombVisual
                modules={modules}
                currentModule={currentModule}
                wires={bomb.wires}
                accent={bomb.accent}
                codename={bomb.codename}
                strikes={strikes}
              />
            </div>

            {/* Leyenda de progreso */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bomb className="size-4 text-zinc-500" aria-hidden />
                <span className="font-mono text-xs text-zinc-400">
                  {defusedCount}/{modules.length} módulos desactivados
                </span>
              </div>
              <Badge
                variant="outline"
                className={`font-mono ${
                  strikes >= 2
                    ? "border-red-500/40 bg-red-500/10 text-red-300"
                    : "border-white/15 bg-white/5 text-zinc-300"
                }`}
              >
                {3 - strikes} vidas
              </Badge>
            </div>
          </div>

          {/* Columna de la pregunta */}
          <div className="order-1 flex flex-col gap-4 lg:order-2">
            <QuestionCard
              question={question}
              moduleNumber={currentModule + 1}
              moduleCount={modules.length}
              selected={selected}
              feedback={feedback}
              accent={bomb.accent}
              penalty={bomb.penalty[moduleId]}
              onAnswer={answer}
            />
            <div className="md:hidden">
              <ManualDialog bomb={bomb} module={moduleId} />
            </div>
          </div>
        </div>
      </main>

      {/* Penalización flotante */}
      <AnimatePresence>
        {feedback === "wrong" && (
          <motion.div
            key={`penalty-${answered}`}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 font-mono text-2xl font-black text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            aria-live="polite"
          >
            −{lastPenalty}s
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
