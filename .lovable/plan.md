# Gotham Halal — Updated Plan

Two new inputs change direction from the earlier yellow/brown scheme:
- **Logo:** gold bridge + burger mark on black → brand is **jet black + antique gold**, not yellow.
- **Menu PDF:** full lineup of Gotham burgers, fries, and "dirty sodas" with real prices.

Images are still deferred — every food/photo slot uses a styled placeholder for now.

## Visual direction (revised)
- **Palette:** near-black background, off-white ink, antique gold accent (matches logo `#B8892E`-ish), muted crimson for spicy items.
- **Typography:** heavy condensed display (Anton or Bebas Neue) for headings — reads like the arched wordmark; Inter/Space Grotesk for body.
- **Feel:** moody, cinematic, comic-noir with gold trim — "Gotham nights" energy that echoes the sodas' naming.
- **Motifs:** thin gold hairlines, arched section headers echoing the bridge, subtle grain, high-contrast cards.

## Assets to wire up
- Upload `gotham_logo.png` via Lovable Assets → import as CDN pointer; use in nav, hero, footer, and favicon.
- No food photography this pass — placeholder tiles only.

## Page structure (single route: `src/routes/index.tsx`)
1. **Sticky top bar** — thin black bar with the logo left, nav links center (Menu / Combos / Specials / Visit), gold "Order Now" pill linking to `ordergothamhalal.com`.
2. **Hero** — black background, oversized headline "SMASHED IN GOTHAM.", subline "100% halal · smashed to order · built for Gotham nights", gold CTA + secondary outline CTA. Right side: large logo mark inside a soft gold spotlight (placeholder for future hero photo).
3. **Specials banner** — gold band: **"5 DOUBLE SMASH · $50   |   10 FOR $100"**.
4. **Signature Burgers** — dark cards, each with placeholder image tile, burger name in display type, description, price. Heatwave / Red Moon flagged with a small "SPICY" chip. All 5 burgers from the menu.
5. **Combos & Sides** — two-column: left "Burger Combos" (fries + dirty soda) with 5 rows and prices; right "Burgers + Fries" with 5 rows and prices. Below: **Gotham Fries** grid (Regular, Large, Signal Cheese, Crime Scene, Smashafel) with veggie chip on Smashafel.
6. **Gotham Dirty Sodas** — full-width dark section, 7-item grid (Strawberry Siren, Watermelon Phantom, Peach District, Blue Nightfall, Pineapple Pulse, Mango Mirage, Green Voltage), each card gets a themed gold accent, all $6.
7. **About / Story** — short brand statement (halal, smashed to order, Gotham-night attitude).
8. **Order / Visit** — two cards: gold-on-black "Order Online" → ordergothamhalal.com; outlined "Hours & Location" with weekday hours placeholder + address placeholder.
9. **Footer** — logo, social handles (Instagram / TikTok placeholders), tagline, © line.

## Files touched
- `src/styles.css` — replace tokens with black/gold palette; wire heading font (Anton) + body font (Inter) via `@theme`.
- `src/routes/__root.tsx` — updated head (title, description, OG), Google Fonts link, logo favicon.
- `src/routes/index.tsx` — full homepage rewrite around new palette and menu.
- `src/components/MediaSlot.tsx` — reusable dashed-gold placeholder tile for future food photos.
- `src/assets/gotham-logo.png.asset.json` — Lovable Assets pointer for the uploaded logo.
- Delete: `src/assets/burger-stack.jpg`, `smash-burger.jpg`, `loaded-fries.jpg`, `shake.jpg` (unused generated placeholders from the previous pass).

## Out of scope this pass
- Real food photography — placeholder tiles only.
- Online ordering integration (external link to `ordergothamhalal.com` for now).
- Multi-route split (menu / about / contact stay as sections on home).
- Real address, phone, hours, socials — placeholders until you send them.

## Open items I'll leave as placeholders (send later if you want them baked in now)
- Address, phone, exact hours.
- Instagram / TikTok handles.
- Any allergen/nutrition notes to display on menu items.
