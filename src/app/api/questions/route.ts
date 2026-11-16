import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { QUESTIONS, EJES } from "@/data/questions";

export const dynamic = "force-dynamic";

const VALID_MODULES = ["M1", "M2"] as const;

/** Garantiza que el banco de preguntas esté cargado (idempotente). */
async function ensureSeeded() {
  const count = await db.question.count();
  if (count > 0) return;
  const rows = QUESTIONS.map((q) => ({
    module: q.module,
    eje: q.eje,
    enunciado: q.enunciado,
    alternativas: JSON.stringify(q.alternativas),
    respuesta: q.respuesta,
    explicacion: q.explicacion,
  }));
  const BATCH = 40;
  for (let i = 0; i < rows.length; i += BATCH) {
    await db.question.createMany({ data: rows.slice(i, i + BATCH) });
  }
}

interface QuestionRow {
  id: number;
  enunciado: string;
  alternativas: string;
  respuesta: number;
  explicacion: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("module") ?? "M1";
    const eje = searchParams.get("eje") ?? "numeros";
    const limitRaw = Number(searchParams.get("limit") ?? "10");
    const limit = Math.min(Math.max(Number.isFinite(limitRaw) ? limitRaw : 10, 1), 20);

    if (!VALID_MODULES.includes(moduleId as (typeof VALID_MODULES)[number])) {
      return NextResponse.json({ error: "Módulo inválido (usar M1 o M2)" }, { status: 400 });
    }
    if (!EJES.includes(eje as (typeof EJES)[number])) {
      return NextResponse.json(
        { error: `Eje inválido (usar: ${EJES.join(", ")})` },
        { status: 400 },
      );
    }

    await ensureSeeded();

    const rows = await db.$queryRaw<QuestionRow[]>`
      SELECT id, enunciado, alternativas, respuesta, explicacion
      FROM Question
      WHERE module = ${moduleId} AND eje = ${eje}
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    const questions = rows.map((row) => {
      let alternativas: string[] = [];
      try {
        const parsed: unknown = JSON.parse(row.alternativas);
        if (Array.isArray(parsed)) alternativas = parsed.map(String);
      } catch {
        alternativas = [];
      }
      return {
        id: row.id,
        enunciado: row.enunciado,
        alternativas,
        respuesta: row.respuesta,
        explicacion: row.explicacion,
      };
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No hay preguntas disponibles para esta combinación" },
        { status: 404 },
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("[api/questions]", error);
    return NextResponse.json({ error: "Error interno al obtener preguntas" }, { status: 500 });
  }
}
