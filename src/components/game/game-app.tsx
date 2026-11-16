"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGameStore } from "@/lib/game/store";
import { sfx } from "@/lib/game/sounds";
import { WelcomeScreen } from "./welcome-screen";
import { BombSelectScreen } from "./bomb-select-screen";
import { GameScreen } from "./game-screen";
import { ResultScreen } from "./result-screen";
import { LeaderboardScreen } from "./leaderboard-screen";

const SCREENS = {
  welcome: WelcomeScreen,
  "bomb-select": BombSelectScreen,
  playing: GameScreen,
  won: ResultScreen,
  lost: ResultScreen,
  ranking: LeaderboardScreen,
} as const;

export function GameApp() {
  const phase = useGameStore((s) => s.phase);
  const Screen = SCREENS[phase];

  // Inicializa el contexto de audio en el primer gesto del usuario.
  useEffect(() => {
    const unlock = () => sfx.init();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  return (
    <div className="flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
