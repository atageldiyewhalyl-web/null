import { motion, useReducedMotion } from "motion/react";

/*
 * Frankfurt for the city page hero (12 Nov 2026): the skyline seen from the Main, drawn in code, simplified.
 * Back to front: Messeturm with its pyramid top, Westend Tower, Commerzbank Tower (tallest, stepped top and mast),
 * Main Tower (round, with the mast), the EZB double tower; in front the Kaiserdom's sandstone tower and the stepped
 * gables of the Römer; the Eiserner Steg across the Main. Motion: the city builds itself from the river up, then
 * the water ripples and a few windows light up. Reduced motion: still.
 */

const GLASS = "#9fbfe3";
const GLASS_2 = "#7fa5d2";
const GLASS_3 = "#c4d8f0";
const STEEL = "#5c7290";
const DOM = "#c47e66";
const DOM_2 = "#a9654f";
const GABLE = "#f1e3cf";
const GABLE_2 = "#c9604a";
const WATER = "#dbeaff";
const EASE = [0.22, 1, 0.36, 1] as const;

export default function FrankfurtSkylineV2({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const part = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.75, delay: 0.15 + i * 0.12, ease: EASE } };
  const after = 0.15 + 8 * 0.12 + 0.35;
  const rows = (x: number, w: number, top: number, bottom: number, step = 12, fill = GLASS_3) =>
    Array.from({ length: Math.floor((bottom - top) / step) }, (_, k) => <rect key={k} x={x} y={top + k * step} width={w} height="2.2" fill={fill} opacity="0.75" />);

  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Die Frankfurter Skyline am Main mit Commerzbank Tower, Main Tower, Messeturm, Kaiserdom, Römer und Eisernem Steg">
      {/* the Main */}
      <motion.g {...part(0)}>
        <rect x="0" y="470" width="320" height="90" rx="6" fill="#cfe2fb" />
        <rect x="0" y="476" width="320" height="10" fill={WATER} />
        {[0, 1, 2].map((k) => (
          <motion.path
            key={k}
            d={`M${30 + k * 90} ${505 + k * 14} h50`}
            stroke="#b4d3ff"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ opacity: reduce ? 0.6 : 0, x: 0 }}
            animate={reduce ? {} : { opacity: [0, 0.9, 0], x: [0, 26] }}
            transition={reduce ? {} : { duration: 3.2, repeat: Infinity, delay: after + k * 0.9, ease: "easeInOut" }}
          />
        ))}
      </motion.g>

      {/* Messeturm: slim tower with a pyramid top (far left) */}
      <motion.g {...part(1)}>
        <rect x="34" y="110" width="40" height="330" fill={GLASS_2} />
        <path d="M34 110 L54 66 L74 110 Z" fill={STEEL} />
        <rect x="52" y="48" width="4" height="20" fill={STEEL} />
        {rows(38, 32, 122, 430, 14)}
      </motion.g>

      {/* Westend Tower */}
      <motion.g {...part(2)}>
        <rect x="80" y="168" width="40" height="272" fill={GLASS} />
        <path d="M80 168 Q100 150 120 168 Z" fill={GLASS_3} />
        {rows(84, 32, 180, 430)}
      </motion.g>

      {/* Commerzbank Tower: the tallest, stepped crown and mast */}
      <motion.g {...part(3)}>
        <rect x="126" y="70" width="52" height="370" fill={GLASS_2} />
        <rect x="132" y="52" width="40" height="20" fill={GLASS} />
        <rect x="140" y="38" width="24" height="16" fill={STEEL} />
        <rect x="150" y="6" width="4" height="34" fill={STEEL} />
        {[100, 180, 260, 340].map((y) => (
          <rect key={y} x="126" y={y} width="52" height="18" fill={GLASS_3} opacity="0.55" />
        ))}
        {rows(130, 44, 82, 430, 10)}
      </motion.g>

      {/* Main Tower: round glass tower with a mast */}
      <motion.g {...part(4)}>
        <rect x="186" y="104" width="40" height="336" rx="20" fill={GLASS} />
        <rect x="186" y="128" width="40" height="312" fill={GLASS} />
        <rect x="204" y="62" width="4" height="44" fill={STEEL} />
        <rect x="186" y="128" width="12" height="312" fill={GLASS_3} opacity="0.5" />
        {rows(190, 32, 140, 430, 11)}
      </motion.g>

      {/* EZB: two slanted glass towers (right) */}
      <motion.g {...part(5)}>
        <path d="M236 182 L262 168 L262 440 L236 440 Z" fill={GLASS_2} />
        <path d="M264 196 L292 176 L292 440 L264 440 Z" fill={GLASS} />
        <rect x="236" y="300" width="56" height="10" fill={GLASS_3} opacity="0.7" />
        {rows(240, 18, 196, 430, 13)}
        {rows(268, 20, 206, 430, 13)}
      </motion.g>

      {/* Kaiserdom: the red sandstone tower with its gothic dome */}
      <motion.g {...part(6)}>
        <rect x="222" y="300" width="40" height="140" fill={DOM} />
        <rect x="226" y="268" width="32" height="34" fill={DOM} />
        <path d="M226 268 Q242 232 258 268 Z" fill={DOM_2} />
        <rect x="240" y="214" width="4" height="34" fill={DOM_2} />
        <path d="M236 246 L242 222 L248 246 Z" fill={DOM_2} />
        {[230, 244].map((x) => (
          <path key={x} d={`M${x} 338 V322 a5 5 0 0 1 10 0 V338 Z`} fill="#6e4436" />
        ))}
        <path d="M234 300 h16 l-8 -10 Z" fill={DOM_2} />
      </motion.g>

      {/* the Römer: three stepped gables (front left) */}
      <motion.g {...part(7)}>
        {[16, 62, 108].map((x, k) => (
          <g key={x}>
            <path d={`M${x} 440 V376 L${x + 6} 376 V366 L${x + 12} 366 V356 L${x + 18} 356 V346 L${x + 28} 346 V356 L${x + 34} 356 V366 L${x + 40} 366 V376 L${x + 46} 376 V440 Z`} fill={k === 1 ? GABLE : "#f6ebdc"} />
            <path d={`M${x} 376 h46`} stroke={GABLE_2} strokeWidth="2" />
            {[0, 1].map((r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={x + 8 + c * 11} y={386 + r * 22} width="7" height="12" rx="1" fill="#6f87a6" />))}
            <path d={`M${x + 17} 440 v-12 a6 6 0 0 1 12 0 v12 Z`} fill={GABLE_2} />
          </g>
        ))}
      </motion.g>

      {/* Eiserner Steg: the iron footbridge with its two low arches */}
      <motion.g {...part(8)}>
        <rect x="0" y="452" width="320" height="6" fill={STEEL} />
        <path d="M8 452 Q84 412 160 452 Q236 412 312 452" fill="none" stroke={STEEL} strokeWidth="4" />
        {Array.from({ length: 15 }, (_, k) => 20 + k * 20).map((x) => {
          const arc = x <= 160 ? 452 - 40 * (1 - ((x - 84) / 76) ** 2) : 452 - 40 * (1 - ((x - 236) / 76) ** 2);
          return <path key={x} d={`M${x} 452 V${Math.min(452, arc + 2)}`} stroke={STEEL} strokeWidth="1.6" />;
        })}
        <rect x="150" y="452" width="20" height="24" fill="#8a96a8" />
      </motion.g>

      {/* a few windows light up once the city stands */}
      {[
        [140, 150],
        [158, 230],
        [200, 190],
        [46, 260],
        [92, 300],
        [272, 280],
      ].map(([x, y], k) => (
        <motion.rect
          key={k}
          x={x}
          y={y}
          width="10"
          height="3"
          rx="1"
          fill="#ffd479"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 0.8 } : { opacity: [0, 1, 1, 0] }}
          transition={reduce ? { duration: 0 } : { duration: 4, repeat: Infinity, delay: after + k * 0.6, times: [0, 0.2, 0.7, 1] }}
        />
      ))}
    </svg>
  );
}
