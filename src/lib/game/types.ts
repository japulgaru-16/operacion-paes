import type { Eje, ModuleId } from "@/data/questions";

/** Estadísticas agregadas por bomba (módulo + eje). */
export interface BombStat {
  module: ModuleId;
  eje: Eje;
  games: number;
  wins: number;
  bestTime: number | null;
  bestScore: number | null;
}

export interface RecentGame {
  id: number;
  playerName: string;
  module: ModuleId;
  eje: Eje;
  won: boolean;
  strikes: number;
  timeUsed: number;
  timeLeft: number;
  score: number;
  createdAt: string;
}

export interface StatsResponse {
  bombs: BombStat[];
  recent: RecentGame[];
  totals: { games: number; wins: number; winRate: number };
}

/** Ranking global por dificultad (módulo PAES). */
export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  module: ModuleId;
  eje: Eje;
  won: boolean;
  strikes: number;
  timeUsed: number;
  createdAt: string;
}

export interface DifficultySummary {
  games: number;
  wins: number;
  players: number;
  bestScore: number | null;
}

export interface LeaderboardResponse {
  difficulty: ModuleId;
  entries: LeaderboardEntry[];
  summary: Record<ModuleId, DifficultySummary>;
}

export interface RankInfo {
  rank: number;
  totalPlayers: number;
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
