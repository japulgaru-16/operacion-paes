import { Bomb, ShieldAlert } from "lucide-react";
import { ShareButton } from "./share-button";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950/95">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-200">
          <Bomb className="size-4 text-red-500" aria-hidden />
          <span>OPERACIÓN PAES · Desactiva la Bomba</span>
        </div>
        <p className="max-w-2xl text-xs leading-relaxed text-zinc-500">
          Simulador de estudio para la prueba de Matemática PAES 2026 (Módulos M1 y M2). Contenido
          basado en los ejes temáticos de las Tablas de Especificaciones DEMRE.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ShareButton
            variant="outline"
            size="sm"
            label="Compartir juego"
            className="h-8 border-white/15 bg-white/5 text-xs text-zinc-300 hover:bg-white/10 hover:text-white"
          />
          <p className="flex items-center gap-1.5 text-[11px] text-zinc-600">
            <ShieldAlert className="size-3" aria-hidden />
            Juego con fines educativos · Sin afiliación oficial con DEMRE · Hecho en Chile
          </p>
        </div>
      </div>
    </footer>
  );
}
