"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bomb,
  ChevronRight,
  Loader2,
  Skull,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGameStore } from "@/lib/game/store";
import { BOMBS, MODULE_INFO } from "@/lib/game/config";
import { formatTime, type StatsResponse } from "@/lib/game/types";
import { sfx } from "@/lib/game/sounds";
import { MuteButton } from "./mute-button";
import type { ModuleId } from "@/data/questions";

async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
}

export function BombSelectScreen() {
  const moduleId = useGameStore((s) => s.module);
  const setModule = useGameStore((s) => s.setModule);
  const startGame = useGameStore((s) => s.startGame);
  const goHome = useGameStore((s) => s.goHome);
  const loading = useGameStore((s) => s.loading);
  const loadError = useGameStore((s) => s.loadError);
  const startingEje = useGameStore((s) => s.bomb?.eje ?? null);

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchOnMount: "always",
  });

  const info = MODULE_INFO[moduleId];

  return (
    <div className="game-grid-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Volver al inicio"
              onClick={goHome}
              className="size-9 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span className="font-mono text-sm font-bold tracking-widest text-zinc-100">
              ELIGE TU ARTEFACTO
            </span>
          </div>
          <MuteButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        {/* Selector de módulo rápido */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Paso 2 de 2 · Módulo {moduleId}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Selecciona la bomba a desactivar
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-400">{info.description}</p>
          </div>
          <div
            role="radiogroup"
            aria-label="Cambiar módulo de preguntas"
            className="flex rounded-lg border border-white/15 bg-white/5 p-1"
          >
            {(["M1", "M2"] as ModuleId[]).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={moduleId === m}
                onClick={() => setModule(m)}
                className={`rounded-md px-4 py-2 font-mono text-sm font-bold transition ${
                  moduleId === m
                    ? "bg-red-600 text-white shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {loadError && (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {loadError} — intenta nuevamente.
          </p>
        )}

        {/* Bombas */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {BOMBS.map((bomb, i) => {
            const record = stats?.bombs.find((b) => b.module === moduleId && b.eje === bomb.eje);
            const time = bomb.time[moduleId];
            const penalty = bomb.penalty[moduleId];
            const isStarting = loading && startingEje === bomb.eje;

            return (
              <motion.article
                key={bomb.eje}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-zinc-900/70 transition-colors ${bomb.accent.border} hover:border-white/30`}
              >
                {/* Imagen */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={bomb.image}
                    alt={`Ilustración de la bomba ${bomb.name} (${bomb.ejeLabel})`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  <Badge
                    variant="outline"
                    className={`absolute left-3 top-3 font-mono text-[11px] ${bomb.accent.badge}`}
                  >
                    {bomb.codename}
                  </Badge>
                  {record?.bestTime != null && (
                    <Badge
                      variant="outline"
                      className="absolute right-3 top-3 border-white/20 bg-zinc-950/70 font-mono text-[11px] text-amber-300"
                    >
                      <Trophy className="mr-1 size-3" /> Récord {formatTime(record.bestTime)}
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className={`text-xs font-bold uppercase tracking-[0.2em] ${bomb.accent.text}`}>
                      EJE · {bomb.ejeLabel}
                    </p>
                    <h2 className="text-lg font-black tracking-wide text-white">{bomb.name}</h2>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs leading-relaxed text-zinc-400">{bomb.description}</p>

                  <ul className="mt-3 space-y-1.5">
                    {bomb.topics[moduleId].slice(0, 3).map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span
                          className="mt-1.5 inline-block size-1 shrink-0 rounded-full"
                          style={{ backgroundColor: bomb.accent.hex }}
                          aria-hidden
                        />
                        {t}
                      </li>
                    ))}
                    {bomb.topics[moduleId].length > 3 && (
                      <li className="pl-3 text-[11px] text-zinc-500">
                        + {bomb.topics[moduleId].length - 3} temas del eje
                      </li>
                    )}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/15 bg-white/5 font-mono text-[11px] text-zinc-300"
                    >
                      <Timer className="mr-1 size-3 text-red-400" />
                      {formatTime(time)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/15 bg-white/5 font-mono text-[11px] text-zinc-300"
                    >
                      <Zap className="mr-1 size-3 text-amber-400" />−{penalty}s por error
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/15 bg-white/5 font-mono text-[11px] text-zinc-300"
                    >
                      <Skull className="mr-1 size-3 text-red-400" />3 fallos
                    </Badge>
                  </div>

                  <div className="mt-5 flex-1" />

                  <Button
                    disabled={loading}
                    onClick={() => {
                      sfx.init();
                      void startGame(bomb);
                    }}
                    className="h-11 w-full bg-zinc-100 font-mono text-sm font-black tracking-wider text-zinc-950 transition hover:bg-white disabled:opacity-60"
                    style={
                      !loading
                        ? { boxShadow: `0 8px 24px -8px ${bomb.accent.hex}55` }
                        : undefined
                    }
                  >
                    {isStarting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                        ARMANDO…
                      </>
                    ) : (
                      <>
                        <Bomb className="mr-2 size-4" aria-hidden />
                        DESACTIVAR
                        <ChevronRight className="ml-1 size-4" aria-hidden />
                      </>
                    )}
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
