"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Flame, Gamepad2, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBomb } from "@/lib/game/config";
import { useGameStore } from "@/lib/game/store";
import { formatTime, type StatsResponse } from "@/lib/game/types";

async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener estadísticas");
  return res.json();
}

export function StatsPanel() {
  const openRanking = useGameStore((s) => s.openRanking);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 w-full bg-white/5" />
        <Skeleton className="h-24 w-full bg-white/5" />
        <Skeleton className="h-24 w-full bg-white/5" />
        <Skeleton className="h-24 w-full bg-white/5" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
        No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.
      </p>
    );
  }

  const bestScore = data.bombs.reduce((acc, b) => Math.max(acc, b.bestScore ?? 0), 0);

  const kpis = [
    {
      icon: Gamepad2,
      label: "Misiones jugadas",
      value: String(data.totals.games),
    },
    {
      icon: Flame,
      label: "Bombas desactivadas",
      value: String(data.totals.wins),
    },
    {
      icon: Activity,
      label: "Tasa de éxito",
      value: `${Math.round(data.totals.winRate * 100)}%`,
    },
    {
      icon: Trophy,
      label: "Mejor puntaje",
      value: bestScore > 0 ? bestScore.toLocaleString("es-CL") : "—",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-2 text-zinc-400">
              <kpi.icon className="size-4" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Récords por bomba */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Récords por bomba
            </h4>
          </div>
          {data.bombs.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">
              Aún no hay misiones registradas. ¡Desactiva tu primera bomba!
            </p>
          ) : (
            <ul className="game-scroll max-h-72 space-y-2 overflow-y-auto pr-2">
              {data.bombs.map((b) => {
                const bomb = getBomb(b.eje);
                return (
                  <li
                    key={`${b.module}-${b.eje}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-zinc-900/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-200">
                        {bomb.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {b.module} · {bomb.ejeLabel}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {b.bestTime !== null ? (
                        <span className={`font-mono text-sm font-semibold ${bomb.accent.text}`}>
                          {formatTime(b.bestTime)}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-600">sin desactivar</span>
                      )}
                      <span className="text-[11px] text-zinc-500">
                        {b.wins}/{b.games} éxitos
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Últimas misiones */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Últimas misiones
          </h4>
          {data.recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">Sin registros todavía.</p>
          ) : (
            <ul className="game-scroll max-h-72 space-y-2 overflow-y-auto pr-2">
              {data.recent.map((g) => {
                const bomb = getBomb(g.eje);
                return (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-zinc-900/60 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-zinc-200">
                        <span className="font-semibold text-zinc-100">{g.playerName}</span>
                        <span className="text-zinc-500"> · </span>
                        {bomb.name} <span className="text-xs text-zinc-500">({g.module})</span>
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(g.createdAt).toLocaleString("es-CL", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-400">
                        {formatTime(g.timeUsed)}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          g.won
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/40 bg-red-500/10 text-red-300"
                        }
                      >
                        {g.won ? "DESACTIVADA" : "EXPLOTÓ"}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={openRanking}
          variant="outline"
          className="h-11 border-amber-500/40 bg-amber-500/10 px-6 font-mono text-xs font-bold tracking-wider text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
        >
          <Trophy className="mr-2 size-4" aria-hidden />
          VER RANKING GLOBAL POR DIFICULTAD
        </Button>
      </div>
    </div>
  );
}
