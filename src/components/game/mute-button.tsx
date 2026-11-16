"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sfx } from "@/lib/game/sounds";

/** Botón de sonido persistente (usa localStorage vía useSyncExternalStore). */
export function MuteButton() {
  const muted = useSyncExternalStore(sfx.subscribe, sfx.getMuted, () => false);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={muted ? "Activar sonido" : "Silenciar"}
      title={muted ? "Activar sonido" : "Silenciar"}
      className="size-9 shrink-0 border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
      onClick={() => {
        const next = sfx.toggleMute();
        if (!next) sfx.play("click");
      }}
    >
      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
    </Button>
  );
}
