"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  Gamepad2,
  RefreshCw,
  Share2,
  ShieldCheck,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGameStore } from "@/lib/game/store";
import { getBomb, MODULE_INFO } from "@/lib/game/config";
import {
  formatTime,
  type LeaderboardEntry,
  type LeaderboardResponse,
} from "@/lib/game/types";
import { useStoredPlayerName } from "@/lib/game/player";
import { shareLink } from "@/lib/game/share";
import { useToast } from "@/hooks/use-toast";
import { MuteButton } from "./mute-button";
import type { ModuleId } from "@/data/questions";

const DIFFICULTIES: { id: ModuleId; label: string; hint: string }[] = [
  { id: "M1", label: "M1 · Estándar", hint: "Módulo Común (7° Básico a 2° Medio)" },
  { id: "M2", label: "M2 · Científica", hint: "Módulo Científico (suma 3° y 4° Medio)" },
];

async function fetchLeaderboard(module: ModuleId): Promise<LeaderboardResponse> {
  const res = await fetch(`/api/leaderboard?module=${module}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener el ranking");
  return res.json();
}

const PODIUM_STYLES = [
  {
    ring: "border-amber-500/60",
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    label: "1°",
    icon: Crown,
  },
  {
    ring: "border-zinc-400/50",
    bg: "bg-zinc-400/10",
    text: "text-zinc-200",
    label: "2°",
    icon: Trophy,
  },
  {
    ring: "border-orange-700/60",
    bg: "bg-orange-700/15",
    text: "text-orange-300",
    label: "3°",
    icon: Trophy,
  },
];

function PodiumCard({
  entry,
  isYou,
}: {
  entry: LeaderboardEntry;
  isYou: boolean;
}) {
  const bomb = getBomb(entry.eje);
  const style = PODIUM_STYLES[entry.rank - 1];
  const Icon = style.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (entry.rank - 1) * 0.08 }}
      className={`relative flex flex-col items-center rounded-2xl border p-4 text-center ${style.ring} ${style.bg} ${
        entry.rank === 1 ? "sm:-translate-y-3 sm:p-5" : ""
      }`}
    >
      <Icon className={`size-6 ${style.text}`} aria-hidden />
      <p className="mt-2 truncate font-mono text-sm font-bold text-zinc-100">
        {entry.playerName}
      </p>
      {isYou && (
        <Badge variant="outline" className="mt-1 border-red-500/50 bg-red-500/10 px-1.5 py-0 font-mono text-[9px] text-red-300">
          TÚ
        </Badge>
      )}
      <p className={`mt-2 font-mono text-2xl font-black ${style.text}`}>
        {entry.score.toLocaleString("es-CL")}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
        {bomb.ejeLabel} · {formatTime(entry.timeUsed)}
      </p>
    </motion.div>
  );
}

function LeaderboardRow({
  entry,
  isYou,
}: {
  entry: LeaderboardEntry;
  isYou: boolean;
}) {
  const bomb = getBomb(entry.eje);
  return (
    <li
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
        isYou
          ? "border-red-500/50 bg-red-500/10"
          : "border-white/5 bg-zinc-900/60"
      }`}
    >
      <span className="w-7 shrink-0 text-center font-mono text-sm font-bold text-zinc-500">
        {entry.rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-semibold text-zinc-100">
          <span className="truncate">{entry.playerName}</span>
          {isYou && (
            <Badge variant="outline" className="shrink-0 border-red-500/50 bg-red-500/10 px-1.5 py-0 font-mono text-[9px] text-red-300">
              TÚ
            </Badge>
          )}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: bomb.accent.hex }}
            aria-hidden
          />
          {bomb.ejeLabel}
          <span aria-hidden>·</span>
          <Timer className="size-3" aria-hidden />
          {formatTime(entry.timeUsed)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-mono text-sm font-bold text-zinc-100">
          {entry.score.toLocaleString("es-CL")}
        </span>
        <Badge
          variant="outline"
          className={`px-1.5 py-0 font-mono text-[9px] ${
            entry.won
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-300"
          }`}
        >
          {entry.won ? "DESACTIVADA" : "EXPLOTÓ"}
        </Badge>
      </div>
    </li>
  );
}

export function LeaderboardScreen() {
  const storeModule = useGameStore((s) => s.module);
  const closeRanking = useGameStore((s) => s.closeRanking);
  const [difficulty, setDifficulty] = useState<ModuleId>(storeModule);
  const myName = useStoredPlayerName();
  const { toast } = useToast();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["leaderboard", difficulty],
    queryFn: () => fetchLeaderboard(difficulty),
    refetchOnMount: "always",
  });

  const handleShare = async () => {
    const outcome = await shareLink(
      "¿Puedes desactivar la bomba antes que yo? Juega Operación PAES:",
    );
    if (outcome === "copied") {
      toast({
        title: "Enlace copiado",
        description:
          "Compártelo y cualquiera que juegue con ese enlace aparecerá en este ranking.",
      });
    } else if (outcome === "failed") {
      toast({
        title: "No se pudo copiar el enlace",
        description: "Copia manualmente la URL del navegador.",
        variant: "destructive",
      });
    }
  };

  const summary = data?.summary[difficulty];
  const entries = data?.entries ?? [];
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const isYou = (e: LeaderboardEntry) =>
    myName !== null && e.playerName.trim().toLowerCase() === myName.toLowerCase();
  const kpis = summary
    ? [
        { icon: Gamepad2, label: "Partidas", value: String(summary.games) },
        { icon: ShieldCheck, label: "Desactivadas", value: String(summary.wins) },
        { icon: Users, label: "Agentes", value: String(summary.players) },
        {
          icon: Trophy,
          label: "Mejor puntaje",
          value: summary.bestScore !== null ? summary.bestScore.toLocaleString("es-CL") : "—",
        },
      ]
    : [];

  return (
    <div className="game-grid-bg min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeRanking}
            className="gap-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Volver
          </Button>
          <span className="font-mono text-sm font-bold tracking-widest text-zinc-100">
            RANKING GLOBAL
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Compartir juego"
              onClick={() => void handleShare()}
              className="size-8 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <Share2 className="size-4" aria-hidden />
            </Button>
            <MuteButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6">
        <div className="py-8 text-center sm:py-10">
          <h1 className="font-mono text-3xl font-black tracking-widest text-white sm:text-4xl">
            RANKING GLOBAL
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
            Los mejores agentes que han jugado en este enlace, separados por
            dificultad. Desactiva bombas con cero fallos para escalar puestos.
          </p>
        </div>

        {/* Selector de dificultad */}
        <Tabs
          value={difficulty}
          onValueChange={(v) => setDifficulty(v as ModuleId)}
          className="flex flex-col items-center"
        >
          <TabsList className="grid h-auto w-full max-w-md grid-cols-2">
            {DIFFICULTIES.map((d) => (
              <TabsTrigger
                key={d.id}
                value={d.id}
                className="flex h-auto flex-col gap-0.5 py-2 font-mono"
              >
                <span className="text-sm font-bold">{d.label}</span>
                <span className="hidden text-[10px] font-normal text-zinc-500 sm:block">
                  {d.hint}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section className="mt-8" aria-label="Resumen de la dificultad">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full bg-white/5" />
              ))}
            </div>
          ) : summary ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3.5"
                >
                  <div className="flex items-center gap-2 text-zinc-400">
                    <kpi.icon className="size-4" aria-hidden />
                    <span className="text-[11px] font-medium uppercase tracking-wider">
                      {kpi.label}
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-xl font-bold text-zinc-100">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-center text-sm text-zinc-400">
              No se pudo cargar el resumen de {difficulty}.
            </p>
          )}
        </section>

        {/* Podio + tabla */}
        <section className="mt-8" aria-label="Mejores puntajes">
          {isLoading ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 w-full bg-white/5" />
                ))}
              </div>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full bg-white/5" />
              ))}
            </div>
          ) : isError || !data ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-sm text-zinc-400">
                No se pudo cargar el ranking. Intenta de nuevo.
              </p>
              <Button
                onClick={() => void refetch()}
                variant="outline"
                className="mt-4 border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="mr-2 size-4" aria-hidden />
                Reintentar
              </Button>
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
              <Trophy className="mx-auto size-10 text-zinc-600" aria-hidden />
              <p className="mt-3 font-mono text-sm font-bold text-zinc-300">
                Aún no hay agentes en {difficulty}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-zinc-500">
                {MODULE_INFO[difficulty].label} · Nadie ha jugado esta dificultad
                todavía. Desactiva una bomba y serás el primero del tablero.
              </p>
              <Button
                onClick={closeRanking}
                className="mt-5 h-10 bg-red-600 px-6 font-mono text-xs font-bold tracking-wider text-white hover:bg-red-500"
              >
                JUGAR AHORA
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {podium.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {podium.map((e) => (
                    <PodiumCard key={e.playerName} entry={e} isYou={isYou(e)} />
                  ))}
                </div>
              )}

              {rest.length > 0 && (
                <ul className="game-scroll max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                  {rest.map((e) => (
                    <LeaderboardRow key={e.playerName} entry={e} isYou={isYou(e)} />
                  ))}
                </ul>
              )}

              {entries.length === 1 && (
                <p className="text-center text-xs text-zinc-500">
                  Un solo agente en el tablero. ¡Comparte el juego para sumar rivales!
                </p>
              )}
            </div>
          )}

          {!isLoading && !isError && entries.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <Button
                onClick={() => void refetch()}
                disabled={isFetching}
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                  aria-hidden
                />
                Actualizar
              </Button>
            </div>
          )}
        </section>

        {/* Compartir */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-zinc-200">
            Desafía a otros agentes
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-500">
            Todos los que jueguen con este enlace comparten el mismo ranking
            global. Comparte la misión y compara puntajes por dificultad.
          </p>
          <Button
            onClick={() => void handleShare()}
            className="mt-4 h-11 bg-red-600 px-6 font-mono text-xs font-bold tracking-wider text-white hover:bg-red-500"
          >
            <Share2 className="mr-2 size-4" aria-hidden />
            COMPARTIR JUEGO
          </Button>
        </section>
      </main>
    </div>
  );
}
