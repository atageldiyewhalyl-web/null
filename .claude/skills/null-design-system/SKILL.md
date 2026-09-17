---
name: null-design-system
description: The nüll. visual language taken from the nüll.com homepage — colors, type scale, radii, buttons, logo, motion. Use before building or restyling any page, form, or component on nüll.com (onboarding flows, landing pages, internal tools) so it reads as part of nüll.com and not as a second design language. Do NOT use the Kanzlei landing page (#3797EE) as reference.
---

# nüll. design system

Source of truth: the homepage (`app/routes/home.tsx` → `app/components/ui/minimalist-hero.tsx`, `app/components/NewLandingSpinnerSection.tsx`) and `app/styles/index.css`. Before inventing anything, grep those files for an existing pattern. Extend the language; never start a second one.

## Before building
1. Re-read the homepage components above and `app/styles/index.css` `@theme` tokens.
2. Reuse `@theme` tokens (`--color-primary`, `--color-foreground`, `--color-muted-foreground`, `--color-border`) where they match.
3. Only if a value doesn't exist, add it locally, named for its role.

## Color
| Role | Value | Notes |
|---|---|---|
| Brand blue | `#007aff` | The one accent. CTAs, the logo dot, selected states, progress. Never `#3797EE`. |
| Blue pressed/hover | `#006dff` / border `#0064df` | |
| Ink | `#0e0e10` (logo, headings) / `#111111` (nav, strong UI) | |
| Body text | `#424245` (global `p`), `#4b5563` | |
| Muted text | `#6b7280`, `#86868b` | Meets AA on white only at ≥ 15px; don't go lighter for real content. |
| Hairline | `border-black/10`, `#d8dde7` | |
| Soft surfaces | `#f5f5f7`, `#f7f9fc`, `#eef2f7` | |
| Background | `#ffffff` | Pages are white. No cream, no dark mode by default. |

Blue is a signal, not decoration: selection, progress, primary action, the full stop. Large blue fields (the homepage circle) are a once-per-page statement.

## Typography
- One family: **Inter** (400/500/600/700 loaded; `font-black` renders as 700). Body letter-spacing `-0.011em`.
- **Display**: `font-bold`, `leading-[0.9]`, `tracking-[-0.06em]`…`[-0.075em]`, fluid `clamp()` sizes (e.g. `text-[clamp(2.15rem,10.6vw,3.2rem)]` on mobile → `~5rem` desktop). Big and tight is the nüll voice.
- **Signature**: statements end with a blue full stop — `be found<span class="text-[#007aff]">.</span>`. Use for screen titles that are statements, not for questions (questions end in "?").
- **Small UI labels** (nav, pill buttons): `text-[0.72rem]`–`[0.92rem] font-black uppercase tracking-[0.12em]–[0.22em]`. Reserve uppercase for buttons/nav — not eyebrows above every heading.
- **Body**: `text-[0.95rem]`–`[1.08rem]`, `font-medium`/`font-semibold`, `tracking-[-0.02em]`–`[-0.035em]`, `leading-[1.28]`–`[1.42]`.

## Logo
`nüll<span className="text-[#007aff]">.</span>` as live text: `text-[1.5rem]`–`[1.8rem] font-bold tracking-[-0.03em] text-[#0e0e10]`. Never an image, never recolored.

## Shape
- Pills (`rounded-full`) for primary buttons and small chips.
- `rounded-[8px]` for panels, menus, option surfaces; `rounded-[6px]` for items inside them.
- Large radii (`2rem+`) only for illustrative objects, never for form UI.

## Buttons
- **Primary**: `inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#007aff] px-6 text-[0.8rem]–[0.92rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_36px_rgba(0,122,255,0.22)] transition-transform hover:-translate-y-0.5`.
- **Text link**: `border-b-2 border-[#111111] pb-0.5 font-black tracking-[-0.04em] text-[#111111]`.
- **Ghost/secondary**: ink text, no fill, `hover:opacity-55`.

## Elevation
Shadows are rare and soft: menus `shadow-[0_18px_48px_rgba(15,23,42,0.13)]`, blue CTA glow `rgba(0,122,255,0.22)`. Hairlines before shadows.

## Motion
Easing `[0.22, 1, 0.36, 1]` (easeOutQuint-ish) everywhere. Entrances 0.3–0.8s, hovers `duration-300`, `hover:opacity-55` for text links. See `interaction-motion`.

## Don'ts
- No second accent color, no gradients on UI, no glassmorphism.
- No Kanzlei-page styles (`#3797EE`).
- No client brand color taking over a nüll-hosted page; client marks appear small and monochrome-respecting.
