/**
 * prepare-prisma.mjs — Prepara Prisma según el entorno.
 *
 * - Desarrollo local (DATABASE_URL=file:...): mantiene SQLite y genera el cliente.
 * - Producción en Vercel con Neon Postgres (DATABASE_URL=postgres...):
 *     1. Cambia el provider del schema a "postgresql".
 *     2. Genera el cliente Prisma para Postgres.
 *     3. Crea las tablas en la nube (idempotente: no toca datos existentes).
 *
 * Se ejecuta automáticamente antes de `next build` (ver script "build" en package.json).
 * En Vercel, la base de datos se configura como variable de entorno
 * DATABASE_URL en el dashboard, nunca dentro del código (queda fuera del repo).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "..", "prisma", "schema.prisma");

const rawUrl = process.env.DATABASE_URL ?? "";
const isPostgres = /^postgres(ql)?:\/\//i.test(rawUrl);

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: path.resolve(__dirname, "..") });
}

function setProvider(provider) {
  const schema = readFileSync(schemaPath, "utf8");
  const updated = schema.replace(
    /provider\s*=\s*"(sqlite|postgresql|mysql)"/,
    `provider = "${provider}"`,
  );
  if (updated === schema) return false;
  writeFileSync(schemaPath, updated);
  return true;
}

if (!existsSync(schemaPath)) {
  console.error("[prepare-prisma] No se encontró prisma/schema.prisma");
  process.exit(1);
}

if (isPostgres) {
  console.log("[prepare-prisma] Detectada base de datos Postgres (Neon/Vercel).");
  const changed = setProvider("postgresql");
  console.log(
    changed
      ? "[prepare-prisma] Schema cambiado a postgresql."
      : "[prepare-prisma] Schema ya estaba en postgresql.",
  );
  // Genera el cliente para Postgres y crea las tablas si no existen (idempotente).
  run("npx prisma generate");
  run("npx prisma db push --accept-data-loss");
} else {
  console.log("[prepare-prisma] Entorno local detectado (SQLite).");
  setProvider("sqlite");
  run("npx prisma generate");
}

console.log("[prepare-prisma] Listo.");
