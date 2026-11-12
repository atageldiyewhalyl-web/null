import { motion, useReducedMotion } from "motion/react";

/*
 * Landmarks for the big-city pages (12 Nov 2026), drawn in code, simplified, same frame as the Wasserturm (320 x 560):
 * Berlin: Fernsehturm and Brandenburger Tor over the Spree. Hamburg: Elbphilharmonie and the Michel on the Elbe.
 * München: the two towers of the Frauenkirche before the Alps. Köln: the Dom with the Hohenzollernbrücke on the Rhine.
 * Stuttgart: the Fernsehturm on its wooded hill above vineyards. Düsseldorf: the Rheinturm and the Gehry buildings
 * on the Rhine. Motion: the parts rise into place one after another, then water ripples and lights blink.
 * Reduced motion: still.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
type P = { className?: string };

function useKit(n: number) {
  const reduce = useReducedMotion();
  const part = (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.75, delay: 0.15 + i * 0.13, ease: EASE } };
  const after = 0.15 + n * 0.13 + 0.35;
  return { reduce, part, after };
}

// river at the bottom with drifting ripples
function Water({ y = 470, reduce, after, dir = 1 }: { y?: number; reduce: boolean | null; after: number; dir?: 1 | -1 }) {
  return (
    <g>
      <rect x="0" y={y} width="320" height={560 - y} rx="6" fill="#cfe2fb" />
      <rect x="0" y={y + 6} width="320" height="10" fill="#dbeaff" />
      {[0, 1, 2].map((k) => (
        <motion.path
          key={k}
          d={`M${36 + k * 88} ${y + 36 + k * 13} h46`}
          stroke="#b4d3ff"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ opacity: reduce ? 0.6 : 0, x: 0 }}
          animate={reduce ? {} : { opacity: [0, 0.9, 0], x: [0, 24 * dir] }}
          transition={reduce ? {} : { duration: 3.3, repeat: Infinity, delay: after + k * 0.9, ease: "easeInOut" }}
        />
      ))}
    </g>
  );
}

// a light that blinks once the landmark stands
function Blink({ cx, cy, r = 3.2, fill = "#ff3b30", reduce, delay }: { cx: number; cy: number; r?: number; fill?: string; reduce: boolean | null; delay: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={reduce ? {} : { opacity: [0, 1, 0.2, 1] }}
      transition={reduce ? {} : { duration: 1.8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export function BerlinV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(5);
  const STEEL = "#c9d0da";
  const STEEL_2 = "#a9b3c0";
  const CONC = "#e4e6ea";
  const SAND = "#e6d3b0";
  const SAND_2 = "#cdb58c";
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Der Berliner Fernsehturm mit dem Brandenburger Tor an der Spree">
      <motion.g {...part(0)}>
        <Water reduce={reduce} after={after} />
      </motion.g>
      {/* Fernsehturm: shaft, sphere with its window band, antenna */}
      <motion.g {...part(1)}>
        <path d="M150 470 L154 186 h12 L170 470 Z" fill={CONC} />
        <path d="M150 470 L154 186 h4 L156 470 Z" fill="#d3d6dc" />
        <rect x="140" y="440" width="40" height="30" rx="3" fill="#d3d6dc" />
      </motion.g>
      <motion.g {...part(2)}>
        <circle cx="160" cy="150" r="38" fill={STEEL} />
        <path d="M122 150 a38 38 0 0 1 76 0 Z" fill="#d6dce4" />
        <rect x="122" y="146" width="76" height="9" fill="#5c6b7e" />
        {Array.from({ length: 9 }, (_, k) => (
          <rect key={k} x={127 + k * 7.6} y="147.5" width="4" height="6" fill="#9fc3ea" />
        ))}
        <path d="M130 172 a38 38 0 0 0 60 0" fill="none" stroke={STEEL_2} strokeWidth="2" />
        <rect x="154" y="108" width="12" height="8" fill="#d3d6dc" />
      </motion.g>
      <motion.g {...part(3)}>
        <rect x="157" y="40" width="6" height="70" fill="#f1f2f4" />
        {[48, 64, 80, 96].map((y) => (
          <rect key={y} x="157" y={y} width="6" height="8" fill="#e5484d" />
        ))}
        <rect x="159" y="14" width="2" height="28" fill="#c2c7cf" />
      </motion.g>
      {/* Brandenburger Tor in front: columns, attic, quadriga */}
      <motion.g {...part(4)}>
        <rect x="64" y="378" width="192" height="16" fill={SAND_2} />
        <rect x="70" y="364" width="180" height="16" fill={SAND} />
        <rect x="70" y="394" width="180" height="8" fill={SAND_2} />
        {[78, 104, 130, 176, 202, 228].map((x) => (
          <rect key={x} x={x} y="402" width="12" height="62" fill={SAND} />
        ))}
        {[94, 120, 186, 212].map((x) => (
          <rect key={x} x={x} y="402" width="8" height="62" fill={SAND_2} opacity="0.5" />
        ))}
        <rect x="60" y="462" width="200" height="10" fill={SAND_2} />
        <path d="M148 364 h24 l-3 -14 h-18 Z" fill="#7d8f6e" />
        <path d="M150 350 c 2 -10, 8 -14, 14 -10 l 4 10 Z" fill="#6d7f5f" />
        <rect x="158" y="330" width="3" height="20" fill="#6d7f5f" />
      </motion.g>
      <Blink cx={160} cy={14} reduce={reduce} delay={after} />
    </svg>
  );
}

export function HamburgV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(5);
  const BRICK = "#a5604a";
  const BRICK_2 = "#8b4d3a";
  const GLASS = "#cfe0f2";
  const COPPER = "#6f9a88";
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Die Elbphilharmonie und der Michel in Hamburg an der Elbe">
      {/* the Michel: brick tower with green copper spire, behind */}
      <motion.g {...part(0)}>
        <rect x="236" y="190" width="34" height="200" fill={BRICK_2} />
        <rect x="240" y="150" width="26" height="42" fill={COPPER} />
        <path d="M240 150 Q253 120 266 150 Z" fill={COPPER} />
        <rect x="249" y="96" width="8" height="34" fill={COPPER} />
        <path d="M246 100 L253 52 L260 100 Z" fill={COPPER} />
        <circle cx="253" cy="172" r="7" fill="#f2e6c8" />
      </motion.g>
      <motion.g {...part(1)}>
        <Water reduce={reduce} after={after} dir={-1} />
      </motion.g>
      {/* the old warehouse base of brick */}
      <motion.g {...part(2)}>
        <rect x="34" y="336" width="214" height="136" fill={BRICK} />
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 9 }, (_, c) => <rect key={`${r}-${c}`} x={44 + c * 22.5} y={348 + r * 24} width="10" height="12" rx="1" fill={BRICK_2} />),
        )}
      </motion.g>
      {/* the glass crown with its wave roof */}
      <motion.g {...part(3)}>
        <path d="M30 336 V262 C 70 250, 90 226, 124 238 C 150 248, 170 206, 206 222 C 228 232, 240 248, 252 252 V336 Z" fill={GLASS} />
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 10 }, (_, c) => <path key={`${r}-${c}`} d={`M${40 + c * 21} ${276 + r * 15} q5 -5 10 0`} fill="none" stroke="#ffffff" strokeWidth="2.2" />),
        )}
        <path d="M30 262 C 70 250, 90 226, 124 238 C 150 248, 170 206, 206 222 C 228 232, 240 248, 252 252" fill="none" stroke="#9db8d6" strokeWidth="3" />
        <rect x="30" y="330" width="222" height="8" fill="#b8cbe0" />
      </motion.g>
      {/* a harbour crane on the right */}
      <motion.g {...part(4)}>
        <rect x="282" y="300" width="8" height="172" fill="#2f6fb0" />
        <rect x="262" y="296" width="58" height="8" fill="#2f6fb0" />
        <path d="M286 300 L270 304 M286 300 L314 304" stroke="#2f6fb0" strokeWidth="2" />
        <path d="M312 304 V350" stroke="#5a6372" strokeWidth="1.5" />
        <rect x="306" y="350" width="12" height="8" fill="#e8a33d" />
      </motion.g>
      <Blink cx={253} cy={52} r={2.8} fill="#ffd479" reduce={reduce} delay={after} />
    </svg>
  );
}

export function MuenchenV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(4);
  const BRICK = "#b46c52";
  const BRICK_2 = "#97563f";
  const DOME = "#5f8a70";
  const DOME_2 = "#4e7660";
  // one tower with its "Welsche Haube": the round green cap and lantern
  const tower = (x: number) => (
    <g>
      <rect x={x - 24} y="176" width="48" height="296" fill={BRICK} />
      <rect x={x - 24} y="176" width="10" height="296" fill={BRICK_2} />
      {[214, 262, 310, 358].map((y) => (
        <path key={y} d={`M${x - 5} ${y + 22} V${y + 6} a5 5 0 0 1 10 0 V${y + 22} Z`} fill="#5b6f88" />
      ))}
      <rect x={x - 26} y="170" width="52" height="8" fill={BRICK_2} />
      <path d={`M${x - 24} 172 C ${x - 26} 120, ${x - 4} 112, ${x} 104 C ${x + 4} 112, ${x + 26} 120, ${x + 24} 172 Z`} fill={DOME} />
      <path d={`M${x - 14} 166 C ${x - 16} 132, ${x - 4} 122, ${x - 2} 112`} fill="none" stroke="#7fa48d" strokeWidth="3" strokeLinecap="round" />
      <rect x={x - 5} y="88" width="10" height="18" fill={DOME_2} />
      <path d={`M${x - 7} 90 Q${x} 74 ${x + 7} 90 Z`} fill={DOME_2} />
      <rect x={x - 1} y="62" width="2" height="16" fill={DOME_2} />
      <circle cx={x} cy="61" r="2.5" fill="#d9b25c" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Die zwei Türme der Frauenkirche in München vor den Alpen">
      {/* the Alps far behind */}
      <motion.g {...part(0)}>
        <path d="M-10 330 L40 262 L70 290 L120 220 L160 270 L206 230 L250 280 L290 236 L330 290 V340 H-10 Z" fill="#dfe7f0" />
        <path d="M120 220 L104 242 L118 238 L132 246 Z M290 236 L280 250 L292 246 L300 254 Z" fill="#ffffff" />
      </motion.g>
      {/* the long nave between the towers, with its steep roof */}
      <motion.g {...part(1)}>
        <rect x="70" y="330" width="180" height="142" fill={BRICK} />
        <path d="M60 330 L160 270 L260 330 Z" fill="#8a4a36" />
        {[96, 126, 194, 224].map((x) => (
          <path key={x} d={`M${x - 6} 452 V380 a6 6 0 0 1 12 0 V452 Z`} fill="#5b6f88" />
        ))}
      </motion.g>
      <motion.g {...part(2)}>{tower(118)}</motion.g>
      <motion.g {...part(3)}>{tower(202)}</motion.g>
      <rect x="20" y="470" width="280" height="12" rx="2" fill="#d9cdbd" />
      <motion.path
        d="M20 492 h280"
        stroke="#cfe2fb"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : after, duration: 0.6 }}
      />
    </svg>
  );
}

export function KoelnV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(5);
  const STONE = "#9b958e";
  const STONE_2 = "#827c75";
  const STONE_3 = "#6b665f";
  // one gothic spire: tower with tall windows, then the open pointed spire with crockets
  const spire = (x: number) => (
    <g>
      <rect x={x - 26} y="150" width="52" height="300" fill={STONE} />
      <rect x={x - 26} y="150" width="10" height="300" fill={STONE_2} />
      {[180, 260, 340].map((y) => (
        <path key={y} d={`M${x - 8} ${y + 54} V${y + 10} L${x} ${y} L${x + 8} ${y + 10} V${y + 54} Z`} fill={STONE_3} />
      ))}
      <path d={`M${x - 26} 150 L${x} 18 L${x + 26} 150 Z`} fill={STONE_2} />
      {Array.from({ length: 7 }, (_, k) => {
        const y = 140 - k * 17;
        const w = 22 - k * 3;
        return <path key={k} d={`M${x - w} ${y} l-5 -4 M${x + w} ${y} l5 -4`} stroke={STONE_3} strokeWidth="2" strokeLinecap="round" />;
      })}
      <path d={`M${x} 32 V150`} stroke={STONE_3} strokeWidth="1.5" />
      <circle cx={x} cy="16" r="4" fill={STONE_3} />
    </g>
  );
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Der Kölner Dom mit der Hohenzollernbrücke am Rhein">
      <motion.g {...part(0)}>
        <Water y={474} reduce={reduce} after={after} />
      </motion.g>
      {/* the facade between the spires: portal and rose window */}
      <motion.g {...part(1)}>
        <rect x="104" y="230" width="112" height="220" fill={STONE} />
        <path d="M104 230 L160 176 L216 230 Z" fill={STONE_2} />
        <circle cx="160" cy="262" r="20" fill={STONE_3} />
        <circle cx="160" cy="262" r="12" fill="#a9b8cc" />
        <path d="M140 450 V346 L160 316 L180 346 V450 Z" fill={STONE_3} />
        <path d="M148 450 V352 L160 332 L172 352 V450 Z" fill="#4d4944" />
      </motion.g>
      <motion.g {...part(2)}>{spire(92)}</motion.g>
      <motion.g {...part(3)}>{spire(228)}</motion.g>
      {/* Hohenzollernbrücke: three steel arches across the front */}
      <motion.g {...part(4)}>
        <rect x="0" y="446" width="320" height="8" fill="#5c6b7e" />
        {[54, 160, 266].map((cx) => (
          <g key={cx}>
            <path d={`M${cx - 52} 446 Q${cx} 400 ${cx + 52} 446`} fill="none" stroke="#5c6b7e" strokeWidth="4" />
            {[-36, -18, 0, 18, 36].map((d) => (
              <path key={d} d={`M${cx + d} 446 V${446 - 46 * (1 - (d / 52) ** 2) + 2}`} stroke="#5c6b7e" strokeWidth="1.5" />
            ))}
          </g>
        ))}
        {[0, 106, 212, 318].map((x) => (
          <rect key={x} x={x - 5} y="446" width="10" height="30" fill="#7d8796" />
        ))}
      </motion.g>
    </svg>
  );
}

export function StuttgartV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(4);
  const CONC = "#e2e3e5";
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Der Stuttgarter Fernsehturm auf dem bewaldeten Hügel über den Weinbergen">
      {/* wooded hill and the vineyard slopes */}
      <motion.g {...part(0)}>
        <path d="M-10 380 C 60 330, 110 300, 160 296 S 270 330, 330 360 V480 H-10 Z" fill="#9fc18d" />
        <path d="M-10 430 C 80 390, 200 384, 330 410 V480 H-10 Z" fill="#b9d4a3" />
        {Array.from({ length: 6 }, (_, k) => (
          <path key={k} d={`M${-10} ${440 + k * 8} C 100 ${404 + k * 8}, 220 ${400 + k * 8}, 330 ${420 + k * 8}`} fill="none" stroke="#8fb27c" strokeWidth="2" strokeDasharray="5 5" />
        ))}
        <rect x="-10" y="476" width="340" height="84" fill="#d7e8c9" />
      </motion.g>
      {/* the slender concrete shaft, widening at the foot */}
      <motion.g {...part(1)}>
        <path d="M146 300 C 150 250, 153 200, 154 150 h12 C 167 200, 170 250, 174 300 Z" fill={CONC} />
        <path d="M146 300 C 150 250, 153 200, 154 150 h4 C 157 200, 154 250, 152 300 Z" fill="#cfd2d6" />
      </motion.g>
      {/* the basket: four floors with windows */}
      <motion.g {...part(2)}>
        <path d="M138 150 h44 l-6 -46 h-32 Z" fill="#cfd2d6" />
        {[112, 122, 132, 142].map((y) => (
          <rect key={y} x={141 + (y - 104) * 0.13} y={y} width={38 - (y - 104) * 0.26} height="5" fill="#6e86a3" />
        ))}
        <rect x="140" y="98" width="40" height="8" rx="2" fill="#bcc0c6" />
      </motion.g>
      {/* the antenna, red and white */}
      <motion.g {...part(3)}>
        <rect x="157" y="36" width="6" height="64" fill="#f1f2f4" />
        {[44, 60, 76].map((y) => (
          <rect key={y} x="157" y={y} width="6" height="8" fill="#e5484d" />
        ))}
      </motion.g>
      <Blink cx={160} cy={34} reduce={reduce} delay={after} />
    </svg>
  );
}

export function DuesseldorfV2({ className = "" }: P) {
  const { reduce, part, after } = useKit(5);
  const CONC = "#dcdde0";
  return (
    <svg viewBox="0 0 320 560" className={className} role="img" aria-label="Der Rheinturm und die Gehry-Bauten am Medienhafen in Düsseldorf am Rhein">
      <motion.g {...part(0)}>
        <Water y={476} reduce={reduce} after={after} />
      </motion.g>
      {/* Rheinturm: shaft with the light clock, the pod, the antenna */}
      <motion.g {...part(1)}>
        <path d="M206 476 L211 168 h10 L226 476 Z" fill={CONC} />
        <path d="M206 476 L211 168 h3 L210 476 Z" fill="#c9cbcf" />
      </motion.g>
      <motion.g {...part(2)}>
        <path d="M196 168 h40 l-4 -26 h-32 Z" fill="#c9cbcf" />
        <rect x="196" y="150" width="40" height="8" fill="#6e86a3" />
        <rect x="200" y="132" width="32" height="10" rx="2" fill="#bcc0c6" />
        <rect x="214" y="40" width="4" height="94" fill="#e9eaec" />
        {[56, 80, 104].map((y) => (
          <rect key={y} x="214" y={y} width="4" height="6" fill="#e5484d" />
        ))}
      </motion.g>
      {/* the light clock: a column of dots up the shaft */}
      {Array.from({ length: 12 }, (_, k) => (
        <motion.circle
          key={k}
          cx={216}
          cy={448 - k * 22}
          r="2.2"
          fill="#ffd479"
          initial={{ opacity: reduce ? 0.9 : 0 }}
          animate={reduce ? {} : { opacity: [0, 1, 0.3] }}
          transition={reduce ? {} : { duration: 2.4, repeat: Infinity, delay: after + k * 0.12 }}
        />
      ))}
      {/* the three Gehry buildings: white, silver, red brick, all leaning and curved */}
      <motion.g {...part(3)}>
        <path d="M20 476 V340 C 30 326, 40 344, 52 330 C 62 320, 72 338, 84 328 V476 Z" fill="#f4f3f0" />
        {Array.from({ length: 5 }, (_, r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={28 + c * 18} y={350 + r * 24} width="9" height="13" fill="#9fb2c8" />))}
      </motion.g>
      <motion.g {...part(4)}>
        <path d="M90 476 V300 C 104 290, 120 310, 134 296 C 142 288, 150 304, 156 300 V476 Z" fill="#c9ced6" />
        {Array.from({ length: 7 }, (_, r) => [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={100 + c * 18} y={318 + r * 22} width="9" height="12" fill="#8ea3bd" />))}
        <path d="M150 476 V362 C 160 352, 172 368, 186 358 V476 Z" fill="#b5654e" />
        {Array.from({ length: 4 }, (_, r) => [0, 1].map((c) => <rect key={`${r}-${c}`} x={158 + c * 14} y={376 + r * 24} width="8" height="12" fill="#7a3f30" />))}
      </motion.g>
      {/* Rheinkniebrücke cables on the right */}
      <motion.g {...part(5)}>
        <rect x="270" y="300" width="8" height="176" fill="#8a96a8" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M274 ${310 + k * 18} L${330} ${450 - k * 6}`} stroke="#8a96a8" strokeWidth="1.4" />
        ))}
        <rect x="236" y="450" width="94" height="6" fill="#8a96a8" />
      </motion.g>
      <Blink cx={216} cy={40} reduce={reduce} delay={after} />
    </svg>
  );
}
