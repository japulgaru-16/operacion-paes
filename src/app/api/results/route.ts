import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ANON = "Anónimo";

const bodySchema = z.object({
  playerName: z.string().trim().max(20).optional(),
  module: z.enum(["M1", "M2"]),
  eje: z.enum(["numeros", "algebra", "geometria", "probabilidad", "funciones"]),
  won: z.boolean(),
  strikes: z.number().int().min(0).max(3),
  timeLeft: z.number().int().min(0).max(7200),
  timeUsed: z.number().int().min(0).max(7200),
  score: z.number().int().min(0).max(100000),
});

export async function POST(req: NextRequest) {
  try {
    const json: unknown = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const data = parsed.data;
    const playerName =
      data.playerName && data.playerName.length >= 2 ? data.playerName : ANON;

    // ¿Es un récord? (mejor tiempo de desactivación registrado antes de esta partida)
    const previousBest = await db.gameResult.findFirst({
      where: { module: data.module, eje: data.eje, won: true },
      orderBy: { timeUsed: "asc" },
      select: { timeUsed: true },
    });
    const newRecord =
      data.won && (!previousBest || data.timeUsed < previousBest.timeUsed);

    await db.gameResult.create({ data: { ...data, playerName } });

    // Puesto del agente en el ranking de la dificultad (mejor puntaje por jugador)
    const bestPerPlayer = await db.gameResult.groupBy({
      by: ["playerName"],
      where: { module: data.module },
      _max: { score: true },
    });
    const myBest =
      bestPerPlayer.find((p) => p.playerName === playerName)?._max.score ??
      data.score;
    const betterPlayers = bestPerPlayer.filter(
      (p) => p.playerName !== playerName && (p._max.score ?? 0) > myBest,
    ).length;

    return NextResponse.json({
      ok: true,
      newRecord,
      rank: betterPlayers + 1,
      totalPlayers: bestPerPlayer.length,
    });
  } catch (error) {
    console.error("[api/results]", error);
    return NextResponse.json(
      { error: "Error interno al guardar el resultado" },
      { status: 500 },
    );
  }
}
