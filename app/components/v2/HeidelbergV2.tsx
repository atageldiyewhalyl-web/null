import { motion, useReducedMotion } from "motion/react";

/*
 * Heidelberg for the city page hero (12 Nov 2026): the Brückentor of the Alte Brücke with its two round towers and
 * dark baroque helmets, the red sandstone bridge arches over the Neckar, and the castle ruin on the wooded slope behind.
 * Simplified, drawn in code. Motion: hill and castle first, then the bridge and the gate build up from the river,
 * then the water ripples and the towers' flag waves. Reduced motion: still.
 */

const SAND = "#c97b5d"; // red Neckar sandstone
const SAND_2 = "#b2664a";
const SAND_3 = "#93523b";
const WALL = "#f2e8da"; // the gate towers' light render
const WALL_2 = "#e0d2bf";
const SLATE = "#46505e";
const SLATE_2 = "#5c6878";
const HILL = "#b9d2a6";
const HILL_2 = "#a3c28f";
const WINDOW = "#4f6680";
const WATER = "#dbeaff";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeidelbergV2({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const part = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.75, delay: 0.15 + i * 0.13, ease: EASE } };
  const after = 0.15 + 7 * 0.13 + 0.35;

  // one round gate tower with its bulb helmet, centred on x
  const gateTower = (x: number) => (
    <g>
      <rect x={x - 26} y="214" width="52" height="236" fill={WALL} />
      <rect x={x - 26} y="214" width="12" height="236" fill={WALL_2} />
      <rect x={x - 28} y="206" width="56" height="10" rx="2" fill={WALL_2} />
      {/* baroque helmet: bulb, neck, small lantern, spire */}
      <path d={`M${x - 30} 208 C ${x - 30} 172, ${x - 12} 168, ${x - 10} 152 L${x + 10} 152 C ${x + 12} 168, ${x + 30} 172, ${x + 30} 208 Z`} fill={SLATE} />
      <path d={`M${x - 22} 204 C ${x - 22} 180, ${x - 10} 174, ${x - 8} 160`} fill="none" stroke={SLATE_2} strokeWidth="3" strokeLinecap="round" />
      <rect x={x - 6} y="134" width="12" height="20" fill={SLATE} />
      <path d={`M${x - 9} 136 Q${x} 112 ${x + 9} 136 Z`} fill={SLATE} />
      <rect x={x - 1.5} y="96" width="3" height="20" fill={SLATE} />
      <circle cx={x} cy="96" r="3" fill="#d9b25c" />
      {[250, 300, 350].map((y) => (
        <rect key={y} x={x - 4} y={y} width="8" height="14" rx="4" fill={WINDOW} />
      ))}
    </g>
  );

  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Das Brückentor der Alten Brücke in Heidelberg über dem Neckar, dahinter das Schloss am Hang">
      {/* the wooded slope of the Königstuhl */}
      <motion.g {...part(0)}>
        <path d="M-10 300 C 40 230, 90 180, 160 150 S 280 120, 330 140 V380 H-10 Z" fill={HILL} />
        <path d="M-10 340 C 60 290, 140 250, 210 240 S 300 230, 330 236 V380 H-10 Z" fill={HILL_2} />
      </motion.g>

      {/* the castle ruin on the slope (right of the gate, as seen from the north bank) */}
      <motion.g {...part(1)}>
        <g transform="translate(22 -14)">
        <rect x="214" y="148" width="72" height="48" fill={SAND} />
        <path d="M214 148 V140 h8 v8 h8 v-8 h8 v8 h8 v-8 h8 v8" fill={SAND} />
        <rect x="232" y="120" width="26" height="76" fill={SAND_2} />
        <path d="M232 120 l4 -8 l4 6 l5 -10 l4 8 l5 -4 l4 8 Z" fill={SAND_2} />
        {[220, 266].map((x) => (
          <path key={x} d={`M${x} 176 V166 a5 5 0 0 1 10 0 V176 Z`} fill={SAND_3} />
        ))}
        <rect x="238" y="134" width="6" height="10" fill={SAND_3} />
        <rect x="268" y="156" width="16" height="40" fill={SAND_2} />
        </g>
      </motion.g>

      {/* the Neckar */}
      <motion.g {...part(2)}>
        <rect x="0" y="468" width="320" height="92" rx="6" fill="#cfe2fb" />
        <rect x="0" y="474" width="320" height="10" fill={WATER} />
        {[0, 1, 2].map((k) => (
          <motion.path
            key={k}
            d={`M${40 + k * 86} ${506 + k * 13} h46`}
            stroke="#b4d3ff"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ opacity: reduce ? 0.6 : 0, x: 0 }}
            animate={reduce ? {} : { opacity: [0, 0.9, 0], x: [0, -24] }}
            transition={reduce ? {} : { duration: 3.4, repeat: Infinity, delay: after + k * 0.9, ease: "easeInOut" }}
          />
        ))}
      </motion.g>

      {/* the Alte Brücke: sandstone arches on piers */}
      <motion.g {...part(3)}>
        <rect x="-4" y="414" width="328" height="12" fill={SAND_2} />
        <rect x="-4" y="406" width="328" height="8" fill={SAND} />
        {Array.from({ length: 33 }, (_, k) => (
          <rect key={k} x={-2 + k * 10} y="398" width="4" height="8" fill={SAND} />
        ))}
        {[-40, 70, 250, 360].map((cx) => (
          <path key={cx} d={`M${cx - 52} 426 H${cx + 52} V474 H${cx + 40} a40 34 0 0 0 -80 0 H${cx - 52} Z`} fill={SAND} />
        ))}
        {[18, 122, 198, 302].map((x) => (
          <path key={x} d={`M${x - 8} 474 l8 -10 l8 10 Z`} fill={SAND_3} />
        ))}
      </motion.g>

      {/* the gate between the towers, with its arch */}
      <motion.g {...part(4)}>
        <rect x="126" y="276" width="68" height="150" fill={SAND} />
        <rect x="126" y="270" width="68" height="8" fill={SAND_2} />
        <path d="M138 426 V364 a22 22 0 0 1 44 0 V426 Z" fill={SAND_3} />
        <path d="M144 426 V366 a16 16 0 0 1 32 0 V426 Z" fill="#6e3d2c" />
        <rect x="150" y="296" width="20" height="26" rx="2" fill={WINDOW} />
        <path d="M126 270 L160 252 L194 270 Z" fill={SAND_2} />
      </motion.g>

      {/* the two round towers with their dark helmets */}
      <motion.g {...part(5)}>{gateTower(108)}</motion.g>
      <motion.g {...part(6)}>{gateTower(212)}</motion.g>

      {/* a pennant on the left spire */}
      <motion.path
        d="M110 98 L130 104 L110 110 Z"
        fill="#007aff"
        style={{ transformOrigin: "110px 104px" }}
        initial={{ opacity: reduce ? 1 : 0, scaleX: 1 }}
        animate={reduce ? {} : { opacity: 1, scaleX: [1, 0.75, 1] }}
        transition={reduce ? {} : { opacity: { duration: 0.4, delay: after }, scaleX: { duration: 1.6, repeat: Infinity, delay: after, ease: "easeInOut" } }}
      />
    </svg>
  );
}
