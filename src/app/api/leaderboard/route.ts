import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_MODULES = ["M1", "M2"] as const;
const MAX_ENTRIES = 25;
/** Cuántas partidas traer antes de deduplicar por jugador (mejor puntaje). */
const FETCH_WINDOW = 400;

/**
 * GET /api/leaderboard?module=M1|M2
 *
 * Ranking global por dificultad (módulo PAES). Devuelve el mejor puntaje
 * de cada agente dentro de la dificultad elegida, más un resumen por
 * dificultad para las pestañas M1 / M2.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleParam = searchParams.get("module") ?? "M1";
    if (!VALID_MODULES.includes(moduleParam as (typeof VALID_MODULES)[number])) {
      return NextResponse.json(
        { error: "Dificultad inválida (usar M1 o M2)" },
        { status: 400 },
      );
    }
    const moduleId = moduleParam as (typeof VALID_MODULES)[number];

    // Mejores partidas de la dificultad elegida, ordenadas por puntaje
    const topCandidates = await db.gameResult.findMany({
      where: { module: moduleId },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: FETCH_WINDOW,
      select: {
        id: true,
        playerName: true,
        module: true,
        eje: true,
        won: true,
        strikes: true,
        timeUsed: true,
        timeLeft: true,
        score: true,
        createdAt: true,
      },
    });

    // Deduplicar por agente conservando su mejor puntaje
    const seen = new Map<string, (typeof topCandidates)[number]>();
    for (const row of topCandidates) {
      const key = row.playerName.trim().toLowerCase();
      if (!seen.has(key)) seen.set(key, row);
    }

    const entries = [...seen.values()]
      .sort((a, b) => b.score - a.score || +new Date(a.createdAt) - +new Date(b.createdAt))
      .slice(0, MAX_ENTRIES)
      .map((row, i) => ({
        rank: i + 1,
        playerName: row.playerName,
        score: row.score,
        module: row.module,
        eje: row.eje,
        won: row.won,
        strikes: row.strikes,
        timeUsed: row.timeUsed,
        createdAt: row.createdAt.toISOString(),
      }));

    // Resumen por dificultad (para las pestañas M1 / M2)
    const summaries = await Promise.all(
      VALID_MODULES.map(async (m) => {
        const [games, wins, playerGroups, best] = await Promise.all([
          db.gameResult.count({ where: { module: m } }),
          db.gameResult.count({ where: { module: m, won: true } }),
          db.gameResult.groupBy({
            by: ["playerName"],
            where: { module: m },
          }),
          db.gameResult.findFirst({
            where: { module: m },
            orderBy: { score: "desc" },
            select: { score: true },
          }),
        ]);
        return {
          games,
          wins,
          players: playerGroups.length,
          bestScore: best?.score ?? null,
        };
      }),
    );

    return NextResponse.json({
      difficulty: moduleId,
      entries,
      summary: {
        M1: summaries[0],
        M2: summaries[1],
      },
    });
  } catch (error) {
    console.error("[api/leaderboard]", error);
    return NextResponse.json(
      { error: "Error interno al obtener el ranking" },
      { status: 500 },
    );
  }
}
