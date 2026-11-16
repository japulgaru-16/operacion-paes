"use client";

/**
 * Utilidad para compartir el juego (o un resultado) usando la Web Share
 * API cuando está disponible, con respaldo de portapapeles. Comparte
 * siempre la URL pública actual, de modo que cualquier persona que
 * reciba el enlace pueda jugar y aparecer en el mismo ranking global.
 */

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

export async function shareLink(text: string): Promise<ShareOutcome> {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = "Operación PAES · Desactiva la Bomba";

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      // cualquier otro error de share → intentar portapapeles
    }
  }

  try {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${url}`.trim());
      return "copied";
    }
  } catch {
    // sin permiso de portapapeles → fallback con execCommand
  }

  // Último recurso para navegadores sin clipboard API
  try {
    const el = document.createElement("textarea");
    el.value = `${text} ${url}`.trim();
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok ? "copied" : "failed";
  } catch {
    return "failed";
  }
}
