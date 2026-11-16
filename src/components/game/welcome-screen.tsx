"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  Bomb,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Skull,
  Sparkles,
  Timer,
  Trophy,
  User,
  UserCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/lib/game/store";
import { MODULE_INFO } from "@/lib/game/config";
import { isValidName, sanitizeName, setPlayerName, notifyNameChanged, useStoredPlayerName } from "@/lib/game/player";
import { useToast } from "@/hooks/use-toast";
import { MuteButton } from "./mute-button";
import { ShareButton } from "./share-button";
import { StatsPanel } from "./stats-panel";
import { sfx } from "@/lib/game/sounds";
import type { ModuleId } from "@/data/questions";

const MODULES: ModuleId[] = ["M1", "M2"];

/** Tarjeta para registrar el nombre de agente que aparecerá en el ranking global. */
function AgentNameCard() {
  const { toast } = useToast();
  const storedName = useStoredPlayerName();
  const [draft, setDraft] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const name = draft ?? storedName ?? "";

  const handleSave = () => {
    setTouched(true);
    const clean = sanitizeName(name);
    if (!isValidName(clean)) return;
    setPlayerName(clean);
    setDraft(null);
    notifyNameChanged();
    sfx.play("select");
    toast({
      title: "Nombre de agente registrado",
      description: `Tus resultados en el ranking se guardarán como ${clean}.`,
    });
  };

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-red-500/15 text-red-400">
            {storedName ? <UserCheck className="size-4" aria-hidden /> : <User className="size-4" aria-hidden />}
          </span>
          <div>
            <p className="text-sm font-bold text-zinc-100">Nombre de agente</p>
            <p className="mt-0.5 max-w-md text-xs leading-relaxed text-zinc-500">
              {storedName
                ? `Registrado como ${storedName}. Así aparecerás en el ranking global cuando compartas el juego.`
                : "Registra tu nombre para aparecer en el ranking global que verán todos los que jueguen este enlace."}
            </p>
          </div>
        </div>
        <div className="flex w-full max-w-sm gap-2 sm:w-auto">
          <Input
            value={name}
            onChange={(e) => {
              setDraft(e.target.value);
              setTouched(false);
            }}
            maxLength={20}
            placeholder="AGENTE-VALIENTE-77"
            aria-label="Nombre de agente para el ranking"
            autoComplete="off"
            spellCheck={false}
            className="h-10 border-white/15 bg-zinc-900/80 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-red-500"
          />
          <Button
            onClick={handleSave}
            disabled={!isValidName(name)}
            className="h-10 bg-red-600 px-4 font-mono text-xs font-bold tracking-wider text-white hover:bg-red-500 disabled:opacity-60"
          >
            {storedName ? "ACTUALIZAR" : "REGISTRAR"}
          </Button>
        </div>
      </div>
      {touched && !isValidName(name) && (
        <p className="mt-2 text-xs text-red-400">
          El nombre debe tener entre 2 y 20 caracteres.
        </p>
      )}
    </div>
  );
}

export function WelcomeScreen() {
  const selectedModule = useGameStore((s) => s.module);
  const setModule = useGameStore((s) => s.setModule);
  const goBombSelect = useGameStore((s) => s.goBombSelect);
  const openRanking = useGameStore((s) => s.openRanking);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="game-grid-bg">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-md bg-red-500/15 text-red-500">
              <Bomb className="size-4" aria-hidden />
            </span>
            <span className="font-mono text-sm font-bold tracking-widest text-zinc-100">
              OPERACIÓN PAES
            </span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegación">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-zinc-400 hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() => scrollTo("como-jugar")}
            >
              Cómo jugar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
              onClick={openRanking}
            >
              <Trophy className="size-4 text-amber-400" aria-hidden />
              Ranking
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-zinc-400 hover:bg-white/10 hover:text-white sm:inline-flex"
              onClick={() => scrollTo("estadisticas")}
            >
              Estadísticas
            </Button>
            <ShareButton
              variant="ghost"
              size="icon"
              iconOnly
              label="Compartir juego"
              className="size-8 text-zinc-400 hover:bg-white/10 hover:text-white"
            />
            <MuteButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-red-500/40 bg-red-500/10 font-mono text-red-300"
            >
              <span className="game-pulse mr-1 inline-block size-1.5 rounded-full bg-red-500" />
              SIMULADOR DE DESACTIVACIÓN · PAES 2026
            </Badge>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Desactiva la bomba
              <span className="block text-red-500">resolviendo la PAES</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Como en <em>Keep Talking and Nobody Explodes</em>: una bomba, un cronómetro y cinco
              módulos que solo ceden ante ejercicios de Matemática tipo PAES. Elige entre preguntas
              del <strong className="text-zinc-200">Módulo 1</strong> o{" "}
              <strong className="text-zinc-200">Módulo 2</strong>, escoge tu bomba por eje temático
              y demuestra que nadie explota.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => {
                  sfx.play("select");
                  scrollTo("elegir-modulo");
                }}
                className="h-12 bg-red-600 px-7 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/40 hover:bg-red-500"
              >
                <Sparkles className="mr-2 size-4" aria-hidden />
                INICIAR MISIÓN
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={openRanking}
                className="h-12 border-amber-500/40 bg-amber-500/10 px-7 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
              >
                <Trophy className="mr-2 size-4" aria-hidden />
                Ranking global
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => scrollTo("estadisticas")}
                className="h-12 px-7 text-sm font-semibold text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                Ver estadísticas
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="game-float overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-red-950/40">
              <Image
                src="/bombs/hero.png"
                alt="Bomba con temporizador digital y fórmulas matemáticas flotando"
                width={1344}
                height={768}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="game-glow-ring pointer-events-none absolute inset-0 rounded-2xl" />
          </motion.div>
        </section>

        {/* Paso 1: elegir módulo */}
        <section id="elegir-modulo" className="scroll-mt-20 py-10">
          <header className="mb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Paso 1 de 2
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              ¿Qué tipo de preguntas quieres desactivar?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              La PAES de Matemática tiene dos módulos. Ambos evalúan los cinco ejes temáticos, pero
              el M2 incluye los contenidos de 3° y 4° medio.
            </p>
          </header>

          <AgentNameCard />

          <div className="grid gap-5 md:grid-cols-2">
            {MODULES.map((m, i) => {
              const info = MODULE_INFO[m];
              const active = selectedModule === m;
              return (
                <motion.button
                  key={m}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  aria-pressed={active}
                  aria-label={`Seleccionar ${info.label}`}
                  onClick={() => setModule(m)}
                  className={`group relative flex h-full flex-col rounded-2xl border p-5 text-left transition-all sm:p-6 ${
                    active
                      ? "border-red-500/70 bg-red-500/10 shadow-lg shadow-red-950/30"
                      : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`font-mono text-3xl font-black ${
                          active ? "text-red-400" : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      >
                        {m}
                      </span>
                      <h3 className="mt-1 text-base font-semibold text-zinc-100">{info.label}</h3>
                    </div>
                    <span
                      className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${
                        active
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-zinc-600 text-transparent"
                      }`}
                      aria-hidden
                    >
                      <CheckCircle2 className="size-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{info.description}</p>
                  <p className="mt-3 border-t border-white/10 pt-3 font-mono text-[11px] leading-relaxed text-zinc-500">
                    {info.detail}
                  </p>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    5 bombas · 5 ejes temáticos · 5 alternativas por pregunta
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              size="lg"
              onClick={goBombSelect}
              className="h-12 bg-red-600 px-8 text-sm font-bold tracking-wide text-white shadow-lg shadow-red-900/40 hover:bg-red-500"
            >
              Elegir bomba del módulo {selectedModule}
              <ChevronRight className="ml-1 size-5" aria-hidden />
            </Button>
          </div>
        </section>

        {/* Cómo jugar */}
        <section id="como-jugar" className="scroll-mt-20 py-10">
          <header className="mb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Manual del agente
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Cómo se desactiva</h2>
          </header>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ClipboardList,
                title: "1 · Elige módulo y bomba",
                text: "M1 o M2, y luego la bomba del eje temático: Números, Álgebra, Geometría, Probabilidad o Funciones.",
              },
              {
                icon: Timer,
                title: "2 · Corre el reloj",
                text: "Tienes entre 5:30 y 7:30 minutos para desactivar los 5 módulos del artefacto.",
              },
              {
                icon: BookOpenCheck,
                title: "3 · Responde bien",
                text: "Cada módulo se desactiva con una pregunta PAES correcta. Puedes abrir el manual de campo… pero el reloj sigue corriendo.",
              },
              {
                icon: Bomb,
                title: "4 · No explotes",
                text: "Cada error resta tiempo y suma un fallo. Con 3 fallos, o si el tiempo llega a cero, la bomba explota.",
              },
            ].map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-red-500/15 text-red-400">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-bold text-zinc-100">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{step.text}</p>
              </motion.li>
            ))}
          </ol>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/15 bg-white/5 font-mono text-zinc-300">
              <Skull className="mr-1 size-3 text-red-400" /> 3 fallos = explosión
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-white/5 font-mono text-zinc-300">
              <Zap className="mr-1 size-3 text-amber-400" /> −15s / −20s por error
            </Badge>
            <Badge variant="outline" className="border-white/15 bg-white/5 font-mono text-zinc-300">
              <Timer className="mr-1 size-3 text-red-400" /> 5 módulos por bomba
            </Badge>
          </div>
        </section>

        {/* Estadísticas */}
        <section id="estadisticas" className="scroll-mt-20 py-10 pb-14">
          <header className="mb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Cuartel general
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Estadísticas del agente
            </h2>
          </header>
          <StatsPanel />
        </section>
      </main>
    </div>
  );
}
