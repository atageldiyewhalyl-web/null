import { motion, useReducedMotion } from "motion/react";

/*
 * The Mannheim Wasserturm, drawn in code for the Mannheim city page hero (Halyl, 11–12 Nov 2026, after a photo of the tower).
 * Simplified but true to the shape: a stout round tower of red sandstone on a terrace; the shaft ringed by tall arches
 * between pilasters with small windows high up; a wide frieze with garlands under a heavy crown cornice; a green-grey
 * bell-shaped copper roof with dormers; a lantern with a balcony; Amphitrite on top. In front: the fountain basin of
 * Friedrichsplatz with a fan of arching jets.
 * Motion: the tower builds itself from the terrace up, then the fountains play and the water ripples. Reduced motion: still.
 */

const STONE = "#e7b48e"; // lit sandstone
const STONE_2 = "#d69c74"; // sandstone in shade
const STONE_3 = "#bd8058"; // mouldings and deep shade
const STONE_4 = "#a96d4a"; // darkest recesses
const ROOF = "#5f7f74"; // weathered copper
const ROOF_2 = "#4d6a60";
const ROOF_3 = "#7d9a8f";
const WINDOW = "#4f6680";
const WATER = "#dbeaff";
const JET = "#9cc6ff";
const EASE = [0.22, 1, 0.36, 1] as const;

// the four arches seen on the front of the shaft (x of each arch's left edge, width 24)
const ARCHES = [106, 134, 162, 190];
const PILASTERS = [102, 130, 158, 186, 214];

export default function WasserturmV2({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const part = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.75, delay: 0.15 + i * 0.12, ease: EASE } };
  const after = 0.15 + 8 * 0.12 + 0.35; // when the tower stands

  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Der Mannheimer Wasserturm am Friedrichsplatz mit Wasserspielen">
      {/* fountain basin */}
      <motion.g {...part(0)}>
        <ellipse cx="160" cy="520" rx="156" ry="24" fill="#cfe2fb" />
        <ellipse cx="160" cy="516" rx="140" ry="16" fill={WATER} />
        {[0, 1, 2].map((k) => (
          <motion.ellipse
            key={k}
            cx="160"
            cy="516"
            fill="none"
            stroke="#b4d3ff"
            strokeWidth="1.4"
            initial={{ rx: 30, ry: 3, opacity: 0 }}
            animate={reduce ? { rx: 100, ry: 11, opacity: 0.45 } : { rx: [30, 136], ry: [3, 15], opacity: [0, 0.8, 0] }}
            transition={reduce ? { duration: 0 } : { duration: 3.6, repeat: Infinity, delay: after + k * 1.2, ease: "easeOut" }}
          />
        ))}
      </motion.g>

      {/* terrace with balustrade, and the plinth */}
      <motion.g {...part(1)}>
        <rect x="52" y="458" width="216" height="26" rx="2" fill={STONE_2} />
        <rect x="52" y="452" width="216" height="6" rx="1" fill={STONE_3} />
        {Array.from({ length: 21 }, (_, k) => (
          <rect key={k} x={57 + k * 10} y="440" width="4" height="12" rx="1.5" fill={STONE_2} />
        ))}
        <rect x="52" y="436" width="216" height="5" rx="1" fill={STONE_3} />
        <rect x="84" y="404" width="152" height="54" rx="2" fill={STONE_2} />
        <rect x="84" y="404" width="152" height="6" fill={STONE_3} />
        <path d="M150 458 V438 a10 10 0 0 1 20 0 V458 Z" fill={STONE_4} />
      </motion.g>

      {/* the round shaft: tall arches between pilasters, small windows high up */}
      <motion.g {...part(2)}>
        <rect x="98" y="244" width="124" height="162" fill={STONE} />
        {/* the cylinder: darker towards both edges */}
        <rect x="98" y="244" width="10" height="162" fill={STONE_2} />
        <rect x="212" y="244" width="10" height="162" fill={STONE_2} />
        {ARCHES.map((x) => (
          <g key={x}>
            <path d={`M${x + 2} 398 V268 a10 10 0 0 1 20 0 V398 Z`} fill={STONE_2} />
            <path d={`M${x + 6} 394 V284 a6 6 0 0 1 12 0 V394 Z`} fill={STONE_3} opacity="0.55" />
            <path d={`M${x + 8} 300 V288 a4 4 0 0 1 8 0 V300 Z`} fill={WINDOW} />
            <rect x={x + 8} y="352" width="8" height="12" rx="1" fill={WINDOW} opacity="0.75" />
          </g>
        ))}
        {PILASTERS.map((x) => (
          <rect key={x} x={x} y="252" width="4" height="152" fill={STONE_3} opacity="0.7" />
        ))}
        <rect x="96" y="398" width="128" height="8" fill={STONE_3} />
      </motion.g>

      {/* band and the wide frieze with garlands */}
      <motion.g {...part(3)}>
        <rect x="94" y="232" width="132" height="14" fill={STONE_3} />
        <rect x="96" y="194" width="128" height="40" fill={STONE_2} />
        {Array.from({ length: 8 }, (_, k) => (
          <path key={k} d={`M${100 + k * 15.5} 204 q7.75 12 15.5 0`} fill="none" stroke={STONE_4} strokeWidth="2.2" strokeLinecap="round" />
        ))}
        {Array.from({ length: 9 }, (_, k) => (
          <circle key={k} cx={100 + k * 15.5} cy="203" r="2.4" fill={STONE_4} />
        ))}
        {Array.from({ length: 16 }, (_, k) => (
          <rect key={k} x={99 + k * 8} y="222" width="4" height="7" fill={STONE_3} />
        ))}
      </motion.g>

      {/* heavy crown cornice */}
      <motion.g {...part(4)}>
        <rect x="88" y="180" width="144" height="16" rx="2" fill={STONE_3} />
        <rect x="92" y="176" width="136" height="6" rx="1" fill={STONE_2} />
        {Array.from({ length: 17 }, (_, k) => (
          <rect key={k} x={92 + k * 8} y="190" width="4" height="5" fill={STONE_4} />
        ))}
      </motion.g>

      {/* bell-shaped copper roof with dormers */}
      <motion.g {...part(5)}>
        <path d="M98 178 C 102 150, 128 134, 140 118 C 146 110, 148 100, 149 90 L171 90 C 172 100, 174 110, 180 118 C 192 134, 218 150, 222 178 Z" fill={ROOF} />
        <path d="M160 90 V178" stroke={ROOF_2} strokeWidth="1.4" />
        {[[-1, 128], [1, 192]].map(([d, x]) => (
          <path key={x} d={`M${x} 178 C ${x + d * -4} 150, ${160 + d * 14} 130, ${160 + d * 8} 92`} fill="none" stroke={ROOF_2} strokeWidth="1.4" />
        ))}
        <path d="M104 160 C 116 146, 130 136, 140 120" fill="none" stroke={ROOF_3} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {[130, 160, 190].map((x) => (
          <g key={x}>
            <path d={`M${x - 7} 156 V146 L${x} 138 L${x + 7} 146 V156 Z`} fill={ROOF_3} />
            <rect x={x - 3.5} y="145" width="7" height="9" rx="1" fill={WINDOW} />
          </g>
        ))}
      </motion.g>

      {/* lantern with its balcony */}
      <motion.g {...part(6)}>
        <rect x="140" y="84" width="40" height="5" rx="1" fill={ROOF_2} />
        {Array.from({ length: 7 }, (_, k) => (
          <rect key={k} x={142 + k * 6} y="77" width="2" height="7" fill={ROOF_2} />
        ))}
        <rect x="140" y="75" width="40" height="3" rx="1" fill={ROOF_2} />
        <rect x="148" y="52" width="24" height="24" fill={ROOF} />
        {[151, 158, 165].map((x) => (
          <path key={x} d={`M${x} 72 V61 a2.5 2.5 0 0 1 5 0 V72 Z`} fill={WINDOW} />
        ))}
        <path d="M145 53 Q160 38 175 53 Z" fill={ROOF_2} />
        <rect x="156" y="36" width="8" height="8" rx="1" fill={ROOF_2} />
      </motion.g>

      {/* Amphitrite on top */}
      <motion.g {...part(7)}>
        <circle cx="160" cy="13" r="4" fill={ROOF_2} />
        <path d="M156 18 h8 l2.5 18 h-13 Z" fill={ROOF_2} />
        <path d="M163 21 l8 -8" stroke={ROOF_2} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M172 2 V26 M168 6 l4 -4 l4 4" fill="none" stroke={ROOF_2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>

      {/* the fountains: a fan of arching jets in the middle, straight jets along the rim */}
      {[
        "M160 512 Q 128 452 104 506",
        "M160 512 Q 192 452 216 506",
        "M160 512 Q 140 440 124 504",
        "M160 512 Q 180 440 196 504",
        "M150 512 Q 120 470 84 510",
        "M170 512 Q 200 470 236 510",
      ].map((d, k) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={JET}
          strokeWidth="2.6"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.85 : 0 }}
          animate={reduce ? {} : { pathLength: [0, 1, 1], opacity: [0, 0.95, 0] }}
          transition={reduce ? {} : { duration: 2.6, repeat: Infinity, delay: after + (k % 3) * 0.35, ease: "easeOut", times: [0, 0.55, 1] }}
        />
      ))}
      {[60, 92, 228, 260, 160].map((x, k) => (
        <motion.path
          key={x}
          d={`M${x} 516 V${x === 160 ? 470 : 494}`}
          stroke={JET}
          strokeWidth={x === 160 ? 3.2 : 2.4}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.8 : 0 }}
          animate={reduce ? {} : { pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
          transition={reduce ? {} : { duration: 2, repeat: Infinity, delay: after + 0.2 + k * 0.25, ease: "easeOut", times: [0, 0.5, 1] }}
        />
      ))}
    </svg>
  );
}
