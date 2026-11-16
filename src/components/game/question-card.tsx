"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Scissors, XCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccentStyle } from "@/lib/game/config";
import type { GameQuestion } from "@/lib/game/store";

const LETTERS = ["A", "B", "C", "D", "E"] as const;

interface QuestionCardProps {
  question: GameQuestion | null;
  moduleNumber: number;
  moduleCount: number;
  selected: number | null;
  feedback: "idle" | "correct" | "wrong";
  accent: AccentStyle;
  penalty: number;
  onAnswer: (index: number) => void;
}

export function QuestionCard({
  question,
  moduleNumber,
  moduleCount,
  selected,
  feedback,
  accent,
  penalty,
  onAnswer,
}: QuestionCardProps) {
  if (!question) {
    return (
      <div className="grid min-h-64 place-items-center rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <p className="font-mono text-sm text-zinc-500">CARGANDO MÓDULO…</p>
      </div>
    );
  }

  const locked = feedback !== "idle";

  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Pregunta ${moduleNumber} de ${moduleCount}`}
      className="flex flex-col rounded-xl border border-white/10 bg-zinc-900/60"
    >
      {/* Cabecera */}
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span
            className={cn("rounded-md border px-2 py-1 font-mono text-[11px] font-bold tracking-widest", accent.badge)}
          >
            MÓDULO {moduleNumber} DE {moduleCount}
          </span>
          <span className="hidden font-mono text-[11px] text-zinc-600 sm:inline">
            #PAES-{String(question.id).padStart(4, "0")}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          Marca la alternativa
        </span>
      </header>

      {/* Enunciado */}
      <div className="game-scroll max-h-44 overflow-y-auto px-4 py-4 sm:px-5">
        <p className="text-base leading-relaxed text-zinc-100 sm:text-lg">{question.enunciado}</p>
      </div>

      {/* Alternativas */}
      <div
        className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5"
        role="group"
        aria-label="Alternativas"
      >
        {question.alternativas.map((alt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.respuesta;
          const revealCorrect = locked && isCorrect;
          const wrongSelected = locked && isSelected && !isCorrect;

          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              aria-label={`Alternativa ${LETTERS[i]}: ${alt}`}
              onClick={() => onAnswer(i)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition sm:text-[15px]",
                "border-white/10 bg-white/[0.04] text-zinc-200",
                !locked && "hover:border-white/30 hover:bg-white/10",
                locked && "cursor-default",
                revealCorrect &&
                  "border-emerald-500/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_18px_-4px_rgba(16,185,129,0.4)]",
                wrongSelected && "border-red-500/70 bg-red-500/15 text-red-100",
                locked && !revealCorrect && !wrongSelected && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-md border font-mono text-xs font-bold",
                  revealCorrect
                    ? "border-emerald-400 bg-emerald-500 text-white"
                    : wrongSelected
                      ? "border-red-400 bg-red-500 text-white"
                      : "border-white/15 bg-white/5 text-zinc-400",
                )}
                aria-hidden
              >
                {LETTERS[i]}
              </span>
              <span className="leading-snug">{alt}</span>
              {revealCorrect && (
                <CheckCircle2 className="ml-auto size-4 shrink-0 text-emerald-400" aria-hidden />
              )}
              {wrongSelected && <XCircle className="ml-auto size-4 shrink-0 text-red-400" aria-hidden />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "m-4 mt-0 flex items-start gap-3 rounded-lg border p-3 sm:m-5 sm:mt-0",
                feedback === "correct"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-red-500/40 bg-red-500/10",
              )}
              role="status"
            >
              {feedback === "correct" ? (
                <Scissors className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
              ) : (
                <Zap className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden />
              )}
              <div className="min-w-0">
                <p
                  className={cn(
                    "font-mono text-xs font-bold uppercase tracking-wider",
                    feedback === "correct" ? "text-emerald-300" : "text-red-300",
                  )}
                >
                  {feedback === "correct"
                    ? "Cable cortado · módulo desactivado"
                    : `Fallo registrado · −${penalty}s y +1 strike`}
                </p>
                {feedback === "wrong" && (
                  <p className="mt-0.5 text-xs font-medium text-red-200">
                    Respuesta correcta: {LETTERS[question.respuesta]}){" "}
                    {question.alternativas[question.respuesta]}
                  </p>
                )}
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">{question.explicacion}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
