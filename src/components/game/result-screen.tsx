"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bomb,
  CheckCircle2,
  Home,
  Loader2,
  RotateCcw,
  Send,
  Share2,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/lib/game/store";
import { formatTime } from "@/lib/game/types";
import { isValidName, sanitizeName, useStoredPlayerName } from "@/lib/game/player";
import { shareLink } from "@/lib/game/share";
import { useToast } from "@/hooks/use-toast";
import { MuteButton } from "./mute-button";

export function ResultScreen() {
  const phase = useGameStore((s) => s.phase);
  const won = phase === "won";
  const bomb = useGameStore((s) => s.bomb);
  const moduleId = useGameStore((s) => s.module);
  const strikes = useGameStore((s) => s.strikes);
  const totalSeconds = useGameStore((s) => s.totalSeconds);
  const remainingMs = useGameStore((s) => s.remainingMs);
  const score = useGameStore((s) => s.score);
  const loseReason = useGameStore((s) => s.loseReason);
  const newRecord = useGameStore((s) => s.newRecord);
  const modules = useGameStore((s) => s.modules);
  const retry = useGameStore((s) => s.retry);
  const loading = useGameStore((s) => s.loading);
  const goBombSelect = useGameStore((s) => s.goBombSelect);
  const goHome = useGameStore((s) => s.goHome);
  const resultPayload = useGameStore((s) => s.resultPayload);
  const resultSaved = useGameStore((s) => s.resultSaved);
  const savingResult = useGameStore((s) => s.savingResult);
  const rankInfo = useGameStore((s) => s.rankInfo);
  const submitResult = useGameStore((s) => s.submitResult);
  const openRanking = useGameStore((s) => s.openRanking);

  const { toast } = useToast();
  const storedName = useStoredPlayerName();
  const [draft, setDraft] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const name = draft ?? storedName ?? "";

  // Guardado automático si ya hay un nombre de agente registrado
  useEffect(() => {
    if (storedName && resultPayload && !resultSaved && !savingResult) {
      void submitResult(storedName);
    }
  }, [storedName, resultPayload, resultSaved, savingResult, submitResult]);

  if (!bomb || (phase !== "won" && phase !== "lost")) return null;

  const defusedCount = modules.filter((m) => m === "defused").length;
  const timeUsed = won
    ? Math.max(1, totalSeconds - Math.floor(remainingMs / 1000))
    : loseReason === "time"
      ? totalSeconds
      : Math.max(1, totalSeconds - Math.floor(remainingMs / 1000));

  const fallosTexto = strikes === 0 ? "cero fallos" : `${strikes} ${strikes === 1 ? "fallo" : "fallos"}`;
  const resultMessage = won
    ? `Desactivaste ${bomb.name} con ${fallosTexto}. ¡Nadie explotó hoy!`
    : loseReason === "time"
      ? "El cronómetro llegó a cero y el detonador hizo su trabajo."
      : "Tres fallos activaron el mecanismo de seguridad del detonador.";

  const cleanName = sanitizeName(name);
  const nameValid = isValidName(name);

  const handleSubmit = () => {
    setTouched(true);
    if (!nameValid) return;
    void submitResult(cleanName);
  };

  const handleShare = async () => {
    const text = won
      ? `¡Desactivé ${bomb.name} (${moduleId}) en Operación PAES con ${score.toLocaleString("es-CL")} pts y ${fallosTexto}! ¿Puedes hacerlo mejor?`
      : `La bomba ${bomb.name} (${moduleId}) me explotó en Operación PAES... ¿tú logras desactivarla?`;
    const outcome = await shareLink(text);
    if (outcome === "copied") {
      toast({
        title: "Resultado copiado",
        description: "Pega el enlace donde quieras y desafía a tus amigos.",
      });
    } else if (outcome === "failed") {
      toast({
        title: "No se pudo compartir",
        description: "Copia manualmente la URL del navegador.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="game-grid-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Fondo según resultado */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${
          won
            ? "bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.16),transparent_60%)]"
        }`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full max-w-xl rounded-2xl border bg-zinc-950/90 p-6 text-center sm:p-8 ${
          won ? "border-emerald-500/40" : "border-red-500/40 game-shake"
        }`}
      >
        <div className="absolute right-4 top-4">
          <MuteButton />
        </div>

        {/* Ícono principal */}
        <div className="mx-auto grid size-20 place-items-center rounded-full border sm:size-24">
          {won ? (
            <div className="grid size-full place-items-center rounded-full border-emerald-500/40 bg-emerald-500/10">
              <ShieldCheck className="size-10 text-emerald-400 sm:size-12" aria-hidden />
            </div>
          ) : (
            <div className="game-pulse grid size-full place-items-center rounded-full border-red-500/40 bg-red-500/10">
              <Bomb className="size-10 text-red-500 sm:size-12" aria-hidden />
            </div>
          )}
        </div>

        <h1
          className={`mt-5 font-mono text-2xl font-black tracking-widest sm:text-3xl ${
            won ? "text-emerald-400" : "text-red-500"
          }`}
        >
          {won ? "BOMBA DESACTIVADA" : "LA BOMBA EXPLOTÓ"}
        </h1>

        <p className="mt-2 text-sm text-zinc-400">{resultMessage}</p>

        {won && newRecord && (
          <Badge
            variant="outline"
            className="game-count-pop mt-4 gap-1.5 border-amber-500/50 bg-amber-500/10 font-mono text-amber-300"
          >
            <Trophy className="size-3.5" aria-hidden />
            ¡NUEVO RÉCORD DE VELOCIDAD!
          </Badge>
        )}

        {/* Métricas */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Timer className="mx-auto size-4 text-zinc-500" aria-hidden />
            <p className="mt-1.5 font-mono text-xl font-bold text-zinc-100">
              {formatTime(timeUsed)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Tiempo usado</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <Zap className="mx-auto size-4 text-zinc-500" aria-hidden />
            <p className="mt-1.5 font-mono text-xl font-bold text-zinc-100">{strikes}/3</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Fallos</p>
          </div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-1">
            <Target className="mx-auto size-4 text-zinc-500" aria-hidden />
            <p
              className={`game-count-pop mt-1.5 font-mono text-xl font-bold ${
                won ? "text-emerald-400" : "text-zinc-100"
              }`}
            >
              {score.toLocaleString("es-CL")}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Puntaje</p>
          </div>
        </div>

        {!won && (
          <p className="mt-3 font-mono text-xs text-zinc-500">
            Módulos desactivados antes de la explosión: {defusedCount}/5 · {bomb.ejeLabel} ·{" "}
            {moduleId}
          </p>
        )}

        {/* Registro en el ranking global */}
        {resultSaved ? (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <p className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-emerald-300">
              <Trophy className="size-4" aria-hidden />
              PUNTAJE REGISTRADO EN {moduleId}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {rankInfo
                ? `Puesto #${rankInfo.rank} de ${rankInfo.totalPlayers} ${
                    rankInfo.totalPlayers === 1 ? "agente" : "agentes"
                  } en el ranking de esta dificultad.`
                : "Tu puntaje ya aparece en el ranking global."}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
            <label
              htmlFor="agent-name"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              <User className="size-3.5 text-red-400" aria-hidden />
              Registra tu nombre para el ranking global
            </label>
            <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setTouched(false);
                }}
                maxLength={20}
                placeholder="AGENTE-VALIENTE-77"
                className="h-11 border-white/15 bg-zinc-900/80 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                onClick={handleSubmit}
                disabled={savingResult || !nameValid}
                className="h-11 bg-red-600 px-5 font-mono text-xs font-bold tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
              >
                {savingResult ? (
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="mr-2 size-4" aria-hidden />
                )}
                {savingResult ? "GUARDANDO…" : "GUARDAR"}
              </Button>
            </div>
            {touched && !nameValid && (
              <p className="mt-2 text-xs text-red-400">
                El nombre debe tener entre 2 y 20 caracteres.
              </p>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              Con este nombre aparecerás en el ranking de {moduleId} visible para todos
              los que jueguen este enlace.
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => void retry()}
            disabled={loading}
            className="h-11 bg-red-600 px-6 font-mono text-sm font-bold tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
          >
            <RotateCcw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} aria-hidden />
            {loading ? "ARMANDO…" : "REINTENTAR"}
          </Button>
          <Button
            onClick={goBombSelect}
            variant="outline"
            className="h-11 border-white/15 bg-white/5 px-6 font-mono text-sm font-semibold tracking-wider text-zinc-200 hover:bg-white/10 hover:text-white"
          >
            <CheckCircle2 className="mr-2 size-4" aria-hidden />
            OTRA BOMBA
          </Button>
          <Button
            onClick={goHome}
            variant="ghost"
            className="h-11 px-6 font-mono text-sm font-semibold tracking-wider text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <Home className="mr-2 size-4" aria-hidden />
            MENÚ
          </Button>
        </div>

        <div className="mt-3 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={openRanking}
            variant="outline"
            className="h-10 border-amber-500/40 bg-amber-500/10 px-5 font-mono text-xs font-bold tracking-wider text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
          >
            <Trophy className="mr-2 size-4" aria-hidden />
            VER RANKING {moduleId}
          </Button>
          <Button
            onClick={() => void handleShare()}
            variant="outline"
            className="h-10 border-white/15 bg-white/5 px-5 font-mono text-xs font-semibold tracking-wider text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <Share2 className="mr-2 size-4" aria-hidden />
            COMPARTIR RESULTADO
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
