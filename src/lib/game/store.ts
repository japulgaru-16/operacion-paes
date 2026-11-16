"use client";

import { create } from "zustand";
import type { Eje, ModuleId } from "@/data/questions";
import { BOMBS, MAX_STRIKES, MODULES_PER_BOMB, type BombConfig } from "./config";
import { sfx } from "./sounds";
import { isValidName, setPlayerName } from "./player";
import type { RankInfo } from "./types";

/** Pregunta tal como llega desde la API */
export interface GameQuestion {
  id: number;
  enunciado: string;
  alternativas: string[];
  respuesta: number;
  explicacion: string;
}

/** Resultado de una partida, listo para el ranking global. */
export interface ResultPayload {
  module: ModuleId;
  eje: Eje;
  won: boolean;
  strikes: number;
  timeLeft: number;
  timeUsed: number;
  score: number;
}

export type Phase = "welcome" | "bomb-select" | "playing" | "won" | "lost" | "ranking";
export type RankingOrigin = "welcome" | "bomb-select" | "won" | "lost";
export type LoseReason = "strikes" | "time" | null;
export type Feedback = "idle" | "correct" | "wrong";

interface GameState {
  phase: Phase;
  module: ModuleId;
  bomb: BombConfig | null;

  // Preguntas
  queue: GameQuestion[];
  queueIndex: number;
  loading: boolean;
  loadError: string | null;

  // Progreso
  modules: Array<"armed" | "defused">;
  currentModule: number;
  strikes: number;
  selected: number | null;
  feedback: Feedback;
  lastPenalty: number;

  // Reloj
  totalSeconds: number;
  endsAt: number;
  remainingMs: number;

  // Estadísticas de la partida
  answered: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  loseReason: LoseReason;
  newRecord: boolean;

  // Resultado pendiente de guardar en el ranking global
  resultPayload: ResultPayload | null;
  resultSaved: boolean;
  savingResult: boolean;
  rankInfo: RankInfo | null;
  rankingFrom: RankingOrigin;

  // Acciones
  setModule: (m: ModuleId) => void;
  goHome: () => void;
  goBombSelect: () => void;
  startGame: (bomb: BombConfig) => Promise<void>;
  answer: (index: number) => void;
  nextAfterFeedback: () => void;
  tick: () => void;
  abort: () => void;
  retry: () => Promise<void>;
  submitResult: (playerName: string) => Promise<void>;
  openRanking: () => void;
  closeRanking: () => void;
}

/** Índice de la próxima pregunta en la cola (circular si se agota). */
function nextQuestionIndex(state: GameState): number {
  const n = state.queue.length;
  if (n === 0) return 0;
  return (state.queueIndex + 1) % n;
}

function computeScore(
  won: boolean,
  timeLeftSec: number,
  strikes: number,
  modulesDefused: number,
): number {
  if (won) return 800 + timeLeftSec * 8 + (MAX_STRIKES - strikes) * 150;
  return modulesDefused * 120;
}

async function fetchQuestions(module: ModuleId, eje: Eje, limit: number): Promise<GameQuestion[]> {
  const res = await fetch(
    `/api/questions?module=${module}&eje=${eje}&limit=${limit}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("No se pudo cargar el banco de preguntas");
  const json = (await res.json()) as { questions: GameQuestion[] };
  return json.questions;
}

export async function saveResult(payload: {
  playerName: string;
  module: ModuleId;
  eje: Eje;
  won: boolean;
  strikes: number;
  timeLeft: number;
  timeUsed: number;
  score: number;
}): Promise<{ newRecord: boolean; rankInfo: RankInfo | null }> {
  try {
    const res = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { newRecord: false, rankInfo: null };
    const json = (await res.json()) as {
      newRecord?: boolean;
      rank?: number;
      totalPlayers?: number;
    };
    return {
      newRecord: Boolean(json.newRecord),
      rankInfo:
        typeof json.rank === "number"
          ? { rank: json.rank, totalPlayers: json.totalPlayers ?? 0 }
          : null,
    };
  } catch {
    return { newRecord: false, rankInfo: null };
  }
}

let advanceTimer: ReturnType<typeof setTimeout> | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  phase: "welcome",
  module: "M1",
  bomb: null,

  queue: [],
  queueIndex: 0,
  loading: false,
  loadError: null,

  modules: Array.from({ length: MODULES_PER_BOMB }, () => "armed" as const),
  currentModule: 0,
  strikes: 0,
  selected: null,
  feedback: "idle",
  lastPenalty: 0,

  totalSeconds: 0,
  endsAt: 0,
  remainingMs: 0,

  answered: 0,
  correctCount: 0,
  wrongCount: 0,
  score: 0,
  loseReason: null,
  newRecord: false,

  resultPayload: null,
  resultSaved: false,
  savingResult: false,
  rankInfo: null,
  rankingFrom: "welcome",

  setModule: (m) => {
    sfx.play("select");
    set({ module: m });
  },

  goHome: () => {
    set({ phase: "welcome", bomb: null });
  },

  goBombSelect: () => {
    sfx.play("click");
    set({ phase: "bomb-select" });
  },

  startGame: async (bomb) => {
    const { module } = get();
    set({ loading: true, loadError: null, bomb });
    try {
      const questions = await fetchQuestions(module, bomb.eje, 10);
      const totalSeconds = bomb.time[module];
      sfx.play("start");
      set({
        phase: "playing",
        queue: questions,
        queueIndex: 0,
        loading: false,
        modules: Array.from({ length: MODULES_PER_BOMB }, () => "armed" as const),
        currentModule: 0,
        strikes: 0,
        selected: null,
        feedback: "idle",
        lastPenalty: 0,
        totalSeconds,
        endsAt: Date.now() + totalSeconds * 1000,
        remainingMs: totalSeconds * 1000,
        answered: 0,
        correctCount: 0,
        wrongCount: 0,
        score: 0,
        loseReason: null,
        newRecord: false,
        resultPayload: null,
        resultSaved: false,
        savingResult: false,
        rankInfo: null,
      });
    } catch (e) {
      set({
        loading: false,
        loadError: e instanceof Error ? e.message : "Error al cargar preguntas",
      });
    }
  },

  answer: (index) => {
    const s = get();
    if (s.phase !== "playing" || s.feedback !== "idle" || s.queue.length === 0) return;
    const q = s.queue[s.queueIndex];
    const correct = index === q.respuesta;
    const mod = s.module;
    const bomb = s.bomb;
    if (!bomb) return;

    if (correct) {
      const modules = [...s.modules];
      modules[s.currentModule] = "defused";
      sfx.play("cut");
      set({
        selected: index,
        feedback: "correct",
        modules,
        answered: s.answered + 1,
        correctCount: s.correctCount + 1,
      });
    } else {
      const penalty = bomb.penalty[mod];
      sfx.play("wrong");
      set({
        selected: index,
        feedback: "wrong",
        strikes: s.strikes + 1,
        lastPenalty: penalty,
        answered: s.answered + 1,
        wrongCount: s.wrongCount + 1,
        endsAt: s.endsAt - penalty * 1000,
        remainingMs: Math.max(0, s.remainingMs - penalty * 1000),
      });
    }
  },

  nextAfterFeedback: () => {
    const s = get();
    if (s.phase !== "playing" || s.feedback === "idle") return;

    const allDefused = s.modules.every((m) => m === "defused");
    const exploded = s.strikes >= MAX_STRIKES;

    if (allDefused) {
      const timeLeftSec = Math.floor(s.remainingMs / 1000);
      const timeUsed = Math.max(1, s.totalSeconds - timeLeftSec);
      const score = computeScore(true, timeLeftSec, s.strikes, s.modules.length);
      sfx.play("defuse");
      set({
        phase: "won",
        score,
        feedback: "idle",
        selected: null,
        resultPayload: {
          module: s.module,
          eje: s.bomb?.eje ?? "numeros",
          won: true,
          strikes: s.strikes,
          timeLeft: timeLeftSec,
          timeUsed,
          score,
        },
      });
      return;
    }

    if (exploded) {
      const timeLeftSec = Math.floor(s.remainingMs / 1000);
      const timeUsed = Math.max(1, s.totalSeconds - Math.max(0, timeLeftSec));
      const defused = s.modules.filter((m) => m === "defused").length;
      const score = computeScore(false, 0, s.strikes, defused);
      sfx.play("explode");
      set({
        phase: "lost",
        score,
        loseReason: "strikes",
        feedback: "idle",
        selected: null,
        resultPayload: {
          module: s.module,
          eje: s.bomb?.eje ?? "numeros",
          won: false,
          strikes: s.strikes,
          timeLeft: 0,
          timeUsed,
          score,
        },
      });
      return;
    }

    // Continuar: siempre se avanza a la siguiente pregunta de la cola
    sfx.play("click");
    set({
      feedback: "idle",
      selected: null,
      queueIndex: nextQuestionIndex(s),
      currentModule: s.modules.findIndex((m) => m === "armed"),
    });
  },

  tick: () => {
    const s = get();
    if (s.phase !== "playing") return;
    const remaining = Math.max(0, s.endsAt - Date.now());
    set({ remainingMs: remaining });
    if (remaining <= 0) {
      const timeUsed = s.totalSeconds;
      const defused = s.modules.filter((m) => m === "defused").length;
      const score = computeScore(false, 0, s.strikes, defused);
      sfx.play("explode");
      set({
        phase: "lost",
        loseReason: "time",
        score,
        remainingMs: 0,
        feedback: "idle",
        selected: null,
        resultPayload: {
          module: s.module,
          eje: s.bomb?.eje ?? "numeros",
          won: false,
          strikes: s.strikes,
          timeLeft: 0,
          timeUsed,
          score,
        },
      });
    }
  },

  abort: () => {
    sfx.play("click");
    if (advanceTimer) clearTimeout(advanceTimer);
    set({ phase: "bomb-select", feedback: "idle", selected: null });
  },

  retry: async () => {
    const { bomb } = get();
    if (!bomb) return;
    const target = BOMBS.find((b) => b.eje === bomb.eje) ?? bomb;
    await get().startGame(target);
  },

  submitResult: async (playerName) => {
    const s = get();
    if (!s.resultPayload || s.resultSaved || s.savingResult) return;
    const clean = setPlayerName(playerName);
    if (!isValidName(clean)) return;
    set({ savingResult: true });
    const { newRecord, rankInfo } = await saveResult({
      ...s.resultPayload,
      playerName: clean,
    });
    set({ resultSaved: true, savingResult: false, newRecord, rankInfo });
  },

  openRanking: () => {
    sfx.play("click");
    const s = get();
    const from: RankingOrigin =
      s.phase === "won" || s.phase === "lost" || s.phase === "bomb-select"
        ? s.phase
        : "welcome";
    set({ phase: "ranking", rankingFrom: from });
  },

  closeRanking: () => {
    sfx.play("click");
    set((s) => ({ phase: s.rankingFrom }));
  },
}));

/** Programa el avance automático tras el feedback, con sonido de tic-tac urgente. */
export function scheduleAdvance(delayMs: number) {
  if (advanceTimer) clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    useGameStore.getState().nextAfterFeedback();
  }, delayMs);
}

export function cancelAdvance() {
  if (advanceTimer) clearTimeout(advanceTimer);
}
