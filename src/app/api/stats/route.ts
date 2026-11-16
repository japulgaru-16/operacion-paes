import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [grouped, recent] = await Promise.all([
      db.gameResult.groupBy({
        by: ["module", "eje"],
        _count: { _all: true },
        where: {},
      }),
      db.gameResult.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
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
      }),
    ]);

    // Agregados por bomba: partidas, victorias, mejor tiempo y mejor puntaje
    const wins = await db.gameResult.groupBy({
      by: ["module", "eje"],
      where: { won: true },
      _count: { _all: true },
      _min: { timeUsed: true },
      _max: { score: true },
    });

    const winMap = new Map(
      wins.map((w) => [
        `${w.module}:${w.eje}`,
        { wins: w._count._all, bestTime: w._min.timeUsed, bestScore: w._max.score },
      ]),
    );

    const bombs = grouped.map((g) => {
      const key = `${g.module}:${g.eje}`;
      const w = winMap.get(key);
      return {
        module: g.module,
        eje: g.eje,
        games: g._count._all,
        wins: w?.wins ?? 0,
        bestTime: w?.bestTime ?? null,
        bestScore: w?.bestScore ?? null,
      };
    });

    const totalGames = bombs.reduce((acc, b) => acc + b.games, 0);
    const totalWins = bombs.reduce((acc, b) => acc + b.wins, 0);

    return NextResponse.json({
      bombs,
      recent,
      totals: { games: totalGames, wins: totalWins, winRate: totalGames > 0 ? totalWins / totalGames : 0 },
    });
  } catch (error) {
    console.error("[api/stats]", error);
    return NextResponse.json({ error: "Error interno al obtener estadísticas" }, { status: 500 });
  }
}
