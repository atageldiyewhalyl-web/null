---
name: responsive-accessibility
description: Mobile-first and WCAG-conscious requirements for nüll. forms and onboarding flows — touch targets, safe areas, on-screen keyboard behavior, focus management, labels and ARIA for custom selects/ranking/scales, non-drag alternatives, contrast. Use when building or reviewing any interactive form UI, especially multi-step questionnaires used on phones.
---

# Responsive & accessible

Mobile is the primary device. Design at 375×667 first, then scale up.

## Layout on mobile
- Side gutters 20–24px; content max width ~640px on desktop for questions, options may go 2-column ≥ 768px only when labels are short.
- Use `min-h-[100dvh]`, not `100vh`. Header and bottom action bar use `env(safe-area-inset-*)`.
- Bottom action bar (Zurück / Weiter) is sticky on mobile; content gets bottom padding equal to its height so nothing hides behind it.
- **On-screen keyboard:** when an input focuses, `scrollIntoView({block: "center"})` after ~300ms; don't use `position: fixed` bars that jump over the keyboard — hide or let the bar sit in flow while a text field is focused on small screens (use `visualViewport` resize).
- Inputs use `font-size ≥ 16px` so iOS doesn't zoom.
- No horizontal scroll at 320px wide. Long German words: `hyphens-auto` + `lang="de"` and `break-words`.

## Touch
- Targets ≥ 44×44px (options ≥ 56px tall). 8px+ between adjacent targets.
- No hover-only affordances. `@media (hover:hover)` for hover styles.

## Semantics
- Each screen: one `<h1>`/`<h2>` that is the question; the fieldset `legend` or `aria-labelledby` points to it.
- Single select → `role="radiogroup"` + `role="radio"` / `aria-checked` (or native radios visually hidden). Arrow keys move within the group.
- Multi select → native checkboxes (visually hidden) or `role="checkbox"` + `aria-checked`; max-reached state announced.
- Scale → radiogroup with `aria-label` including anchor text ("1 – ausschließlich seriös").
- Ranking → ordered list `<ol>`; each item has "nach oben"/"nach unten" buttons with `aria-label="{item} nach oben verschieben"`; announce new position via an `aria-live="polite"` region. Drag is an enhancement only.
- Progress → `role="progressbar"` with `aria-valuenow/min/max` and `aria-valuetext` ("Frage 4 von 21").
- Errors → text + icon, `aria-invalid`, `aria-describedby`, focus moves to first error. Never color alone.
- Selected state → check icon + border + fill, not color alone.
- On step change, move focus to the heading (`tabIndex={-1}`) and announce via live region.

## Focus & contrast
- Visible focus on everything: `focus-visible:outline-2 outline-offset-2 outline-[#007aff]` (or ring). Never `outline:none` without replacement.
- Text contrast ≥ 4.5:1 (body), ≥ 3:1 for large text and UI boundaries. `#007aff` on white = 4.0:1 → fine for large/bold text and UI boundaries, not for small body text; use ink for small text on white and white text on blue at ≥ 14px bold.
- `lang="de"` on the page for correct screen reader pronunciation.

## Verify
Test at 375px and 1280px, keyboard-only pass through the whole flow, reduced-motion pass, and a quick axe/Lighthouse check if available.
