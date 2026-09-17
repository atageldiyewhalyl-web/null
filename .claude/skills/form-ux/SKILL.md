---
name: form-ux
description: UX rules for multi-step questionnaires and onboarding applications (Typeform-style flows) on nüll. Use whenever building or reviewing a step-by-step form, client onboarding, discovery questionnaire, or intake flow — one question per screen, tactile option cards, ranking, conditional follow-ups, "Andere" fields, keyboard navigation, autosave and resume.
---

# Form UX — onboarding applications

A questionnaire is an application, not a page of fields. The user should always know: where they are, what's being asked, what they've chosen, how to go forward or back.

## Structure
- **One question (or one tight logical group) per screen.** A question plus its own follow-ups counts as one screen.
- **Screens are data-driven.** Build from a schema (question type, options, validation, conditions). No per-question components.
- **Section transitions** get their own screen between major sections.
- **Intro screen** states purpose + duration; **final screen** reassures and submits; **success screen** closes without redirecting away.

## Navigation
- Persistent **Zurück** (secondary) and **Weiter** (primary). On mobile both live in a bottom bar within thumb reach, respecting `env(safe-area-inset-bottom)`.
- **Answers persist when going back** — never reset state on navigation.
- **Progress indicator** always visible: a thin bar plus section name and "Frage x von y". Progress reflects questions answered in the path, not raw screen count when conditions skip screens.
- Enter advances (except in textarea, where Cmd/Ctrl+Enter advances). Esc never destroys input.
- Number keys / letter keys may select options on desktop (show hint only on hover-capable devices).
- Focus moves to the new screen's heading on step change so screen readers announce it.

## Question types
| Type | Pattern |
|---|---|
| Single select | Large option rows; one tap selects. Auto-advance is **off** when the question has follow-ups or "Andere"; otherwise optional short delay (~350ms). |
| Multi select | Option rows with a check indicator (not only color). Show "x von max ausgewählt" when there's a max; disable unselected options at max with explanation. |
| Ranking | Ordered list with drag handles **and** up/down buttons on every item. Position numbers visible. Initial order is neutral; require an explicit "confirm order" only if the user never touched it — prefer accepting the default as an answer after they've seen it. |
| Scale 1–n | Segmented row of large buttons; anchor labels under 1, middle, and max. Stack labels on mobile. |
| Short text | Single input, large type, visible label = the question. |
| Long text | Auto-growing textarea, min 3 rows, character-count only if limited. |

## Conditional logic
- Follow-ups appear **inline under the triggering answer** with a height+opacity transition, not as a surprise new screen.
- When the trigger is removed, hide the follow-up but keep its value in memory until submit; strip hidden answers from the final payload.
- "Andere" always reveals a small text input directly under that option; it's optional unless the brief says otherwise; focus moves into it when revealed.

## Validation
- Required only where the data is essential. Mark optional fields "(optional)" instead of starring required ones.
- Validate on Weiter, not on every keystroke. Message sits under the question, in plain language, linked via `aria-describedby`, and moves focus to the first problem.

## Persistence
- Autosave to `localStorage` on every change (debounced ~400ms) and to the server on each step change (debounced/background, never blocking navigation).
- Resume at the saved step with a quiet "Willkommen zurück" note; offer "Neu beginnen".
- Store a questionnaire version with saved state; if the version changed, keep compatible answers only.

## Text
- Question = heading. Help text ≤ 1–2 short lines under it.
- Buttons say what happens: "Weiter", "Fragebogen absenden".
