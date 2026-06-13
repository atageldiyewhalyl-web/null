# Kanzlei Websites V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate `/kanzlei-websites-v2` landing page with a trust-first hero using Hasan Doğru proof assets and the approved MAFINEX wording.

**Architecture:** Add one new route file for the V2 page and register it in the React Router route config. Copy the MAFINEX SVG into `public/assets` so it can be referenced by the page without bundler changes. Keep `/kanzlei-websites` unchanged.

**Tech Stack:** React Router 7, React 18, TypeScript, Tailwind CSS, existing image assets, lucide-react icons.

---

### Task 1: Add Asset And Route

**Files:**
- Copy: `/Users/bilal/Downloads/logo-mafinex.svg` to `public/assets/logo-mafinex.svg`
- Modify: `app/routes.ts`

- [ ] **Step 1: Copy the MAFINEX SVG**

Run:

```bash
cp /Users/bilal/Downloads/logo-mafinex.svg public/assets/logo-mafinex.svg
```

Expected: `public/assets/logo-mafinex.svg` exists.

- [ ] **Step 2: Register the V2 route**

Add this route near the existing Kanzlei routes in `app/routes.ts`:

```ts
route("kanzlei-websites-v2", "routes/kanzlei-websites-v2.tsx"),
```

- [ ] **Step 3: Verify route config syntax**

Run:

```bash
npm run build
```

Expected: build fails only if the route file is not created yet, proving the route config is parsed.

### Task 2: Create V2 Landing Page

**Files:**
- Create: `app/routes/kanzlei-websites-v2.tsx`

- [ ] **Step 1: Create the page component**

Create `app/routes/kanzlei-websites-v2.tsx` with:

- metadata for `/kanzlei-websites-v2`
- a proof-first hero
- CTA buttons for analysis and WhatsApp
- MAFINEX badge with `In Zusammenarbeit mit MAFINEX Mannheim`
- Hasan Doğru proof visual using `app/assets/Dogru kanzlei/Dogru kanzlei new.webp`
- metric cards tied to the Hasan case study
- problem diagnosis section
- included services section
- short contact section

- [ ] **Step 2: Keep the current page untouched**

Run:

```bash
git diff -- app/routes/lawyers.tsx app/routes/kanzlei-websites.tsx
```

Expected: no diff.

### Task 3: Verify And Inspect

**Files:**
- No new files beyond Tasks 1-2

- [ ] **Step 1: Build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 2: Open V2 in browser**

Open:

```text
http://127.0.0.1:5173/kanzlei-websites-v2
```

Expected:

- route loads
- hero shows the Kanzlei headline
- MAFINEX appears with approved wording
- Hasan Doğru visual appears
- current `/kanzlei-websites` still loads separately

- [ ] **Step 3: Final git check**

Run:

```bash
git status --short
```

Expected: changes are limited to the new plan, new route, route config, and copied MAFINEX asset.
