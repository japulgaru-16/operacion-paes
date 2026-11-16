"use client";

import { Share2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { shareLink } from "@/lib/game/share";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  /** Texto que acompaña al enlace al compartir. */
  text?: string;
  /** Descripción del toast al copiar (opcional). */
  description?: string;
  iconOnly?: boolean;
  label?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}

/**
 * Botón que comparte el enlace público del juego con la Web Share API,
 * con respaldo de portapapeles. Sirve para que cualquiera que reciba el
 * enlace juegue y aparezca en el mismo ranking global.
 */
export function ShareButton({
  text,
  description,
  iconOnly = false,
  label = "Compartir juego",
  variant = "ghost",
  size = "sm",
  className,
}: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const outcome = await shareLink(
      text ??
        "Juega Operación PAES: desactiva bombas resolviendo ejercicios tipo PAES de Matemática (M1 y M2).",
    );
    if (outcome === "copied") {
      toast({
        title: "Enlace copiado",
        description:
          description ??
            "Compártelo: quien juegue con este enlace verá y compartirá el mismo ranking global.",
      });
    } else if (outcome === "failed") {
      toast({
        title: "No se pudo compartir",
        description: "Copia manualmente la URL del navegador.",
        variant: "destructive",
      });
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size="icon"
        aria-label={label}
        onClick={() => void handleShare()}
        className={className}
      >
        <Share2 className="size-4" aria-hidden />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => void handleShare()}
      className={className}
    >
      <Share2 className="mr-1.5 size-4" aria-hidden />
      {label}
    </Button>
  );
}
