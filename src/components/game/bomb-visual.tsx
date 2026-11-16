"use client";

import type { AccentStyle } from "@/lib/game/config";

interface BombVisualProps {
  /** Estado de cada módulo/cable */
  modules: Array<"armed" | "defused">;
  /** Índice del módulo en curso */
  currentModule: number;
  /** Colores de los cables */
  wires: string[];
  /** Acento de la bomba */
  accent: AccentStyle;
  /** Código de la bomba */
  codename: string;
  /** Errores cometidos (0-3) */
  strikes: number;
}

interface WireGeometry {
  x0: number;
  x1: number;
  xm: number;
  y0: number;
  y1: number;
  ym: number;
}

const WIRE_START_X = [58, 114, 190, 266, 322];
const WIRE_END_X = [158, 174, 190, 206, 222];
const WIRE_TOP_Y = 34;
const WIRE_END_Y = 146;
const WIRE_MID_Y = 92;

function wireGeometry(i: number): WireGeometry {
  const x0 = WIRE_START_X[i];
  const x1 = WIRE_END_X[i];
  return {
    x0,
    x1,
    xm: (x0 + x1) / 2,
    y0: WIRE_TOP_Y,
    y1: WIRE_END_Y,
    ym: WIRE_MID_Y,
  };
}

export function BombVisual({
  modules,
  currentModule,
  wires,
  accent,
  codename,
  strikes,
}: BombVisualProps) {
  const defusedCount = modules.filter((m) => m === "defused").length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
      <svg
        viewBox="0 0 380 410"
        className="h-auto w-full"
        role="img"
        aria-label={`Bomba ${codename}: ${defusedCount} de 5 módulos desactivados, ${strikes} fallos`}
      >
        <defs>
          <radialGradient id="bombMetal" cx="0.38" cy="0.32" r="0.9">
            <stop offset="0%" stopColor="#4b4b52" />
            <stop offset="55%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#131316" />
          </radialGradient>
          <linearGradient id="bombShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Marco del panel */}
        <rect
          x="1"
          y="1"
          width="378"
          height="408"
          rx="16"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.08"
        />
        {[24, 356].map((x) =>
          [24, 386].map((y) => (
            <circle key={`screw-${x}-${y}`} cx={x} cy={y} r="3" fill="#3f3f46" />
          )),
        )}

        {/* Indicador de fallos (esquina inferior derecha, lejos de los cables) */}
        <text
          x="314"
          y="354"
          textAnchor="middle"
          fill="#71717a"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          letterSpacing="2"
        >
          FALLOS
        </text>
        {[0, 1, 2].map((i) => {
          const cx = 292 + i * 22;
          const used = i < strikes;
          return (
            <rect
              key={`strike-${i}`}
              x={cx - 7}
              y={372 - 7}
              width="14"
              height="14"
              rx="3"
              transform={`rotate(45 ${cx} 372)`}
              fill={used ? "#ef4444" : "#27272a"}
              stroke={used ? "#fca5a5" : "#3f3f46"}
              strokeWidth="1.5"
              style={used ? { filter: "drop-shadow(0 0 6px #ef4444)" } : undefined}
            />
          );
        })}

        {/* Cables */}
        {modules.map((status, i) => {
          const g = wireGeometry(i);
          const color = wires[i % wires.length];
          const cut = status === "defused";
          const leftCtrl1 = g.x0;
          const leftCtrl2 = (g.x0 + g.xm) / 2 + 4;
          const rightCtrl1 = (g.xm + g.x1) / 2 - 4;
          const rightCtrl2 = g.x1;
          return (
            <g key={`wire-${i}`}>
              {/* Media inferior (hacia la bomba) */}
              <path
                d={`M ${g.xm},${g.ym} C ${rightCtrl1},${g.ym + 14} ${rightCtrl2},${g.y1 - 22} ${g.x1},${g.y1}`}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                opacity={cut ? 0.25 : 0.9}
              />
              {/* Media superior (desde el terminal); al cortar se separa */}
              <path
                d={`M ${g.x0},${g.y0} C ${leftCtrl1},${g.y0 + 30} ${leftCtrl2},${g.ym - 16} ${g.xm},${g.ym}`}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                className={cut ? "game-wire-cut" : undefined}
                style={{ transformOrigin: `${g.xm}px ${g.ym}px` }}
              />
              {/* Terminal superior */}
              <rect
                x={g.x0 - 9}
                y={g.y0 - 10}
                width="18"
                height="10"
                rx="2"
                fill="#27272a"
                stroke={color}
                strokeOpacity="0.8"
                strokeWidth="1.5"
              />
              {/* Chispa al cortar */}
              {cut && (
                <>
                  <circle
                    cx={g.xm}
                    cy={g.ym}
                    r="3"
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="2"
                    className="game-spark-circle"
                  />
                  <circle cx={g.xm} cy={g.ym} r="2.5" fill="#fde68a" opacity="0.8" />
                </>
              )}
            </g>
          );
        })}

        {/* Placa de conexiones */}
        <rect x="140" y="142" width="100" height="14" rx="3" fill="#3f3f46" stroke="#52525b" />

        {/* Resplandor pulsante */}
        <circle
          cx="190"
          cy="292"
          r="118"
          fill={accent.hex}
          opacity="0.06"
          className="game-pulse"
        />

        {/* Manija */}
        <path
          d="M 148 202 A 42 42 0 0 1 232 202"
          fill="none"
          stroke="#52525b"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Tapa */}
        <rect x="168" y="194" width="44" height="24" rx="5" fill="#27272a" stroke="#52525b" />

        {/* Cuerpo */}
        <circle
          cx="190"
          cy="292"
          r="92"
          fill="url(#bombMetal)"
          stroke="#52525b"
          strokeWidth="2"
        />
        <ellipse cx="158" cy="254" rx="36" ry="22" fill="url(#bombShine)" />

        {/* Pantalla del módulo */}
        <rect
          x="136"
          y="262"
          width="108"
          height="42"
          rx="6"
          fill="#09090b"
          stroke={accent.hex}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <text
          x="190"
          y="289"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontWeight="bold"
          fontSize="19"
          fill={accent.hex}
          letterSpacing="3"
        >
          {defusedCount}/5
        </text>
        <text
          x="190"
          y="300"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="7.5"
          fill="#71717a"
          letterSpacing="2.5"
        >
          MÓDULOS FUERA
        </text>

        {/* LEDs de módulos */}
        {modules.map((status, i) => {
          const cx = 150 + i * 21;
          const active = i === currentModule && status === "armed";
          return (
            <g key={`led-${i}`}>
              <circle
                cx={cx}
                cy="340"
                r="6.5"
                fill={status === "defused" ? accent.hex : "#7f1d1d"}
                stroke={status === "defused" ? accent.hex : "#b91c1c"}
                strokeWidth="1"
                className={active ? "game-pulse" : undefined}
                style={
                  status === "defused"
                    ? { filter: `drop-shadow(0 0 5px ${accent.hex})` }
                    : undefined
                }
              />
              <text
                x={cx}
                y="358"
                textAnchor="middle"
                fontSize="8"
                fontFamily="ui-monospace, monospace"
                fill={status === "defused" ? "#a1a1aa" : "#52525b"}
              >
                {i + 1}
              </text>
            </g>
          );
        })}

        {/* Código */}
        <text
          x="190"
          y="396"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#52525b"
          letterSpacing="4"
        >
          {codename}
        </text>
      </svg>
    </div>
  );
}
