---
name: conversion-form-design
description: Completion-rate rules for questionnaires and onboarding flows — every design decision should make finishing easier. Use when designing or reviewing client onboarding forms, intake questionnaires, or any multi-step form where completion matters (expected time, meaningful progress, section acknowledgement, optional fields, reassurance at submit, resume of incomplete sessions).
---

# Conversion form design

The metric is completed, high-quality submissions. If a choice looks nicer but adds effort, it loses.

## Before the first question
- State **why** (one sentence of value to the client) and **how long** ("Geschätzte Dauer: 7–10 Minuten").
- One primary action: "Fragebogen starten". Mention that progress is saved automatically.
- Ask identity (name, company, email) up front only when the brief requires it — keep it to the minimum fields and one screen.

## During
- **Never show all questions at once.** One per screen.
- **Meaningful progress:** section name + "Frage x von y" + bar. Early progress should feel quick (lighter questions first when order is free — here the brief fixes order, so respect it).
- **Acknowledge milestones:** a transition screen after section 1 ("Social Media erledigt.") before section 2 introduces what comes next and why.
- **Required only when essential.** Strategic multi-selects should be required; free-text elaboration usually optional.
- **Short helper text**, never paragraphs mid-flow. Examples beat explanations.
- **"Andere" reveals a field inline**; typing is optional.
- **Selections are unmistakable** (fill + check + border).
- **Max-selection limits** are shown before the user hits them ("Bis zu 3 auswählen").
- **Preserve incomplete submissions** locally and server-side; returning users resume where they stopped.
- **No dead ends:** errors explain the fix; network failure on submit keeps answers and offers retry.

## Submitting
- The final screen summarizes what happens next and what they still need to do (e.g. upload catalogs to Drive).
- CTA names the action: "Fragebogen absenden". Show a loading state on the button; disable double submit.
- Success screen: clear confirmation, what happens next, no immediate redirect, no upsell.

## Review checklist
- [ ] Duration shown at start
- [ ] Progress visible on every question
- [ ] Section acknowledgement between sections
- [ ] Every required field is truly needed
- [ ] Back never loses data; reload never loses data
- [ ] Submit failure is recoverable
- [ ] Works one-handed on a phone
