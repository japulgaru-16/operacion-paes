"use client";

import { useState } from "react";
import { BookOpen, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BombConfig } from "@/lib/game/config";
import type { ModuleId } from "@/data/questions";

interface ManualDialogProps {
  bomb: BombConfig;
  module: ModuleId;
}

export function ManualDialog({ bomb, module }: ManualDialogProps) {
  const [open, setOpen] = useState(false);
  const sections = bomb.manual[module];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-9 border-white/15 bg-white/5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <BookOpen className="mr-1.5 size-4" aria-hidden />
          Manual de campo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-hidden border-white/15 bg-zinc-950 text-zinc-100 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono text-lg text-white">
            <BookOpen className="size-5 text-red-500" aria-hidden />
            Manual de campo · {bomb.ejeLabel}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-xs text-amber-300">
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
            Consultar el manual NO detiene el cronómetro de detonación.
          </DialogDescription>
        </DialogHeader>

        <div className="game-scroll -mx-1 max-h-[55vh] space-y-4 overflow-y-auto px-1 py-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <h4 className={`font-mono text-xs font-bold uppercase tracking-widest ${bomb.accent.text}`}>
                {section.title}
              </h4>
              <ul className="mt-2 space-y-1.5">
                {section.formulas.map((f) => (
                  <li
                    key={f}
                    className="rounded border border-white/5 bg-zinc-950 px-2.5 py-1.5 font-mono text-[13px] leading-relaxed text-zinc-200"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="pt-1 text-center text-[11px] text-zinc-500">
            Contenido basado en las Tablas de Especificaciones DEMRE · PAES {module}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
