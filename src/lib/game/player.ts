"use client";

import { useSyncExternalStore } from "react";

/**
 * Gestión del nombre del agente (identidad del jugador para el ranking
 * global). Se guarda en localStorage para que las siguientes partidas
 * se registren automáticamente con el mismo nombre.
 */

const STORAGE_KEY = "operacion-paes:agent-name";

const ADJECTIVES = [
  "AUDAZ",
  "SILENCIOSO",
  "PRECISO",
  "TEMPLADO",
  "RÁPIDO",
  "LEGIÓN",
  "SIGILOSO",
  "VALIENTE",
];

/** Genera un nombre de agente aleatorio (sugerencia inicial). */
export function randomCodename(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = 10 + Math.floor(Math.random() * 89);
  return `AGENTE-${adj}-${num}`;
}

/** Sanitiza y normaliza un nombre ingresado por el jugador. */
export function sanitizeName(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20)
    .replace(/[*_`~<>{}[\]\\|]/g, "");
}

export function isValidName(name: string): boolean {
  const n = sanitizeName(name);
  return n.length >= 2 && n.length <= 20;
}

export function getPlayerName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const clean = sanitizeName(raw);
    return clean.length >= 2 ? clean : null;
  } catch {
    return null;
  }
}

export function setPlayerName(name: string): string {
  const clean = sanitizeName(name);
  if (typeof window !== "undefined" && clean.length >= 2) {
    try {
      window.localStorage.setItem(STORAGE_KEY, clean);
    } catch {
      // almacenamiento no disponible: se juega sin identidad persistida
    }
  }
  return clean;
}

/**
 * Notifica a los suscriptores que el nombre persistido cambió.
 * (window.localStorage no emite eventos en la misma pestaña)
 */
export function notifyNameChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("storage"));
}

/**
 * Hook para leer el nombre persistido sin setState en efectos.
 * Usa useSyncExternalStore: seguro en SSR y sin desajustes de hidratación.
 */
export function useStoredPlayerName(): string | null {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => getPlayerName(),
    () => null,
  );
}
