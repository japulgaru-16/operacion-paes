/**
 * Seed: carga el banco de preguntas estilo PAES a la base de datos.
 * Uso: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { QUESTIONS } from "../src/data/questions";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.question.count();
  if (existing > 0) {
    console.log(`La base ya contiene ${existing} preguntas. Seed omitido.`);
    return;
  }

  const rows = QUESTIONS.map((q) => ({
    module: q.module,
    eje: q.eje,
    enunciado: q.enunciado,
    alternativas: JSON.stringify(q.alternativas),
    respuesta: q.respuesta,
    explicacion: q.explicacion,
  }));

  // SQLite tiene un límite de variables por insert; dividimos en lotes.
  const BATCH = 40;
  for (let i = 0; i < rows.length; i += BATCH) {
    await prisma.question.createMany({ data: rows.slice(i, i + BATCH) });
  }

  console.log(`Seed completado: ${rows.length} preguntas insertadas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
