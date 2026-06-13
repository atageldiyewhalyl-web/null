# Kanzlei Websites V2 Design

Date: 2026-06-13
Status: Draft for review

## Goal

Create a separate conversion-first landing page for Google Ads lawyer traffic at `/kanzlei-websites-v2`.
The existing `/kanzlei-websites` page must remain untouched. The V2 page should keep the nüll. visual identity,
but make the first screen feel more trustworthy, concrete, and action-oriented for cold paid-search visitors.

## Core Problem

The current Kanzlei page is visually premium, but the hero reads more like a brand/editorial page than a paid-search
conversion page. It delays the proof that a skeptical lawyer needs before contacting nüll.

The V2 hero should answer these questions within the first viewport:

- Is this specifically for Kanzleien and Rechtsanwälte?
- Have these people worked on a real legal client?
- What exactly is included?
- Why can I trust them?
- What is the low-risk next step?

## Route Safety

Add a new route:

- `/kanzlei-websites-v2`

Do not replace or redirect:

- `/kanzlei-websites`
- `/lawyers`

This lets the V2 page be reviewed and tested before it becomes a live ad destination.

## Hero Direction

Use a proof-first layout inspired by Netfame's conversion hierarchy, while preserving the nüll. aesthetic.

Left side content:

- Eyebrow: `WEBDESIGN FÜR KANZLEIEN`
- Main headline: `Kanzlei-Websites, die aus Google-Klicks echte Mandatsanfragen machen.`
- Supporting copy: `Website, Texte, SEO-Struktur, Google Ads Tracking, DSGVO und Betreuung aus einer Hand.`
- Primary CTA: `Kostenlose Kanzlei-Analyse`
- Secondary CTA: `WhatsApp schreiben`

Trust row below CTA:

- `In Zusammenarbeit mit MAFINEX Mannheim`
- `Hasan Doğru Case Study`
- `SEO + Google Ads vorbereitet`
- `30 Tage Zufriedenheitsgarantie`

Use the exact MAFINEX wording approved by the user:

`In Zusammenarbeit mit MAFINEX Mannheim`

## Hero Visual

Use Hasan Doğru as the primary proof visual because it is the closest niche match for lawyer traffic.

Primary asset:

- `app/assets/Dogru kanzlei/Dogru kanzlei new.webp`

Supporting proof assets:

- `app/assets/Dogru kanzlei/Google credibility.webp`
- `app/assets/Dogru kanzlei/Credibility.webp`
- `/Users/bilal/Downloads/logo-mafinex.svg` copied into the project asset/public folder during implementation

Visual composition:

- Right side should show a clean screenshot/proof card of the Hasan Doğru website.
- Add small metric cards around the proof visual, not as oversized dashboard UI.
- Keep the existing nüll. blue as the action color.
- The gavel/hammer may be used only as a small accent if it does not compete with proof.

Recommended metric card copy:

- `188 Klicks`
- `32,5 Conversions`
- `4,11 EUR / Conversion`
- `Hasan Doğru Kanzlei`

If those numbers appear, make them visually tied to the Hasan case-study proof, not as universal guarantees.

## Page Structure

The V2 page should follow this order:

1. Proof-first hero
2. Trust strip with MAFINEX, Hasan, DSGVO, and Google Ads/SEO inclusion
3. Problem diagnosis: why paid clicks do not become Mandatsanfragen
4. Hasan case-study section with screenshot and concrete numbers
5. Included services: website, text, SEO, tracking, DSGVO, support
6. Low-risk offer: free Kanzlei website and Google Ads analysis
7. Short contact section with WhatsApp and form

The existing longer storytelling sections may be reused below the new hero, but proof and CTA must appear before abstract service explanation.

## Copy Tone

Tone should be:

- clear
- serious
- confident
- direct
- premium but not vague

Avoid:

- exaggerated guarantees
- fake review counts
- overclaiming MAFINEX relationship
- implying Hasan's numbers are typical for every client
- stock-agency language

## Mobile Requirements

Mobile is likely important for ad clicks, so the first screen must show:

- headline
- CTA
- at least one trust signal
- one proof visual or compact proof card

Add a sticky mobile CTA bar only if it fits the V2 design without feeling pushy.

## Analytics And Tracking

Reuse existing tracking helpers.

Track:

- primary analysis CTA click
- WhatsApp click
- phone click if added
- form submission

Do not change conversion IDs in this design pass.

## Out Of Scope

This design does not include:

- replacing the current `/kanzlei-websites` route
- redesigning Arzt or Zahnarzt pages
- changing Google Ads campaign settings
- changing Supabase form handling
- changing the global navbar/footer
- making performance claims not backed by assets or notes

## Success Criteria

The V2 page is ready when:

- `/kanzlei-websites-v2` loads independently.
- The first viewport communicates niche, proof, offer, and CTA.
- MAFINEX appears with the approved wording.
- Hasan Doğru is the primary visual proof.
- The existing `/kanzlei-websites` page is unchanged.
- Production build still succeeds.
