---
name: interaction-motion
description: Motion rules for nüll. interfaces — directional step transitions, progress animation, selection feedback, conditional reveals, completion reveal, reduced motion. Use when adding or reviewing animation in onboarding flows, forms, and interactive components built with motion/react (framer-motion) or CSS.
---

# Interaction motion

Motion explains change. It never decorates or delays.

## Timing
- Easing: `[0.22, 1, 0.36, 1]` (nüll house curve). Exits may use `[0.4, 0, 1, 1]` shorter.
- Micro feedback (press, check, hover): **120–180ms**.
- Step transitions: **280–350ms** in, ~200ms out.
- Conditional reveal (height + opacity): **220–300ms**.
- One deliberate longer moment allowed: the completion reveal (≤ 900ms total, staggered).

## Patterns
- **Step change:** direction-aware. Forward: new screen enters from `y: 24` / `x: 32` with opacity 0 → 1, old exits to `-y`/`-x`. Back: reversed. Use `AnimatePresence mode="wait"` with a `custom` direction. Only transform + opacity.
- **Progress bar:** animate `scaleX` (transform-origin left), 400ms, same easing.
- **Selection:** respond on pointer-down (`active:scale-[0.985]`); the check indicator scales 0.6→1 with opacity; background/border color transitions 150ms. No bouncy springs on form controls.
- **Ranking:** use `Reorder` (motion/react) layout animations; keyboard moves animate the same way via `layout`.
- **Conditional follow-ups:** `height: 0 → auto` + opacity; content inside fades 60ms later.
- **Completion:** checkmark draws (pathLength), title rises, body follows with 80–120ms stagger.

## Never
- Animate width/height/top/left for step transitions (layout jank on mobile).
- Stagger every option on every screen (slows repeated use). A light 20–30ms stagger on first paint of a screen is the maximum.
- Idle/looping decoration inside the form.
- Block input during a transition longer than ~200ms.

## Reduced motion
Wrap with `MotionConfig reducedMotion="user"` and use `useReducedMotion()` to swap translate for plain opacity crossfades (≤150ms). Progress still updates, instantly or with opacity only.
