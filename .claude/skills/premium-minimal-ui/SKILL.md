---
name: premium-minimal-ui
description: Aesthetic direction for nüll. product surfaces — refined editorial minimalism with subtle agency personality. Use alongside null-design-system when designing onboarding flows, client portals, or landing sections that must feel premium, confident, clean and slightly experimental rather than corporate, playful-SaaS, or noisy.
---

# Premium minimal UI

**Direction:** refined editorial minimalism with subtle agency personality. Premium, confident, clean, slightly experimental — not corporate, not playful SaaS, not visually noisy.

## Rules
1. **Whitespace is intentional.** Every screen has one focal block with room around it. If two things compete, one moves or goes.
2. **Oversized typography carries the page.** The heading is the visual. Use the nüll display scale (tight leading, negative tracking). No illustrations to fill space.
3. **Strong hierarchy, three levels max per screen:** title → supporting line → interactive content. Metadata is small and quiet.
4. **Minimal borders.** Hairlines (`black/10`) only where they separate or define a hit area. Never box a box.
5. **Limited cards.** Options may be surfaces because they're touch targets; content never gets wrapped in decorative cards. No card grids of identical rounded rectangles with shadows.
6. **No unnecessary gradients.** Flat white, flat blue, flat ink.
7. **No purple/indigo AI-SaaS palette.** Blue is `#007aff` only.
8. **No glassmorphism**, no blurred blobs, no noise textures.
9. **Don't round everything the same.** Pills for actions, 8px for option surfaces, 0 for layout.
10. **No dashboards inside dashboards.** A client-facing flow never shows sidebars, stat tiles, or breadcrumbs.
11. **One strong visual idea per screen.** e.g. the giant question; the ranking stack; the big "Vielen Dank." Everything else supports it.

## Anti-template checks (run before shipping)
- Tracked ALL-CAPS eyebrow above every heading? Remove unless it carries real info (e.g. section name).
- `01 / 02 / 03` markers on things that aren't a sequence? Remove.
- One word in the headline colored/italic for emphasis? Remove. (The nüll blue full stop is the brand mark, not emphasis.)
- `→` glued to every button? Use an icon only where direction matters (Weiter/Zurück).
- Same shadow under every element? Remove shadows except the primary CTA.
- Chanel test: remove one accessory before you leave.
