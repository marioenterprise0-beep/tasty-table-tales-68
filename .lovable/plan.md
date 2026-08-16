# Gotham Halal — Build to the Mockups

Both reference mockups are the target. We build the layout, palette, and components exactly as shown, with styled placeholder tiles wherever your photography will go later.

## Visual system
- **Palette:** true black (#0A0A0A) surfaces, Gotham gold (#F2A81D / #E8A020) accent, off-white text, deep charcoal card backgrounds with gold hairline borders.
- **Type:** heavy condensed all-caps display (Anton-style) for headings, clean sans (DM Sans) for body. Body copy sentence-case, headings uppercase with tight tracking.
- **Motifs:** Rochester skyline silhouette strip, arched bridge watermark behind the hero, torn/spatter diagonal edge between the black hero panel and the gold panel, pill-shaped outlined buttons.
- **Buttons:** gold-filled pill (ORDER NOW), black pill with gold outline (FIND A LOCATION / VIEW MENU), small gold-outline pills on cards.

## Header (rework of current nav)
Full-width black bar (not a floating pill), matching the mockup:
- Logo left (existing SVG asset), larger and vertically centered.
- Nav center, uppercase, gold on active: HOME · MENU · CATERING · LOCATIONS · OUR STORY · REWARDS · FRANCHISE.
- Right: Instagram, TikTok, Facebook icons, then gold-outline ORDER NOW pill and gold-filled FIND A LOCATION pill.
- Mobile: same bar collapses to logo + hamburger sheet.

## Homepage sections (top to bottom)
1. **Hero split** — left black panel: "BOLD. HALAL. GOTHAM." (white/white/gold), subline "Halal burgers, fried chicken & sandwiches made fresh daily. Built for flavor. Made for you.", ORDER NOW + VIEW MENU pills. Right gold panel with bridge + skyline watermark and a wide photo slot for your hero burger shot; spatter diagonal divider between panels.
2. **Value bar** — black band, 4 columns divided by gold rules, each with a gold line-icon: 100% HALAL / FRESH INGREDIENTS / BOLD FLAVOR / ROC ROOTS, with the mockup's copy.
3. **Menu Highlights** — gold background band, centered "MENU HIGHLIGHTS" between gold rules. 4 dark cards with rounded corners, each: image slot, item name in display caps, description, ORDER NOW pill. Items: Gotham Single Smash, Heatwave Double Smash, Red Moon Smash Burger, Crime Scene Fries.
4. **App + Catering split** — black, two halves separated by a gold rule. Left: phone mockup slot, "GET THE GOTHAM HALAL APP", copy, App Store / Google Play badges. Right: "CATERING THAT HITS DIFFERENT", copy, CATER WITH US pill, catering trays photo slot.
5. **Skyline footer band** — gold bar with Rochester skyline silhouette on the left, "BOLD FOOD. REAL VALUES. ROCHESTER PROUD." centered, OUR STORY outlined pill right.
6. **Footer** — black, logo, nav column, socials, hours/location placeholders, © line.

## Photography plan
Every photo position becomes a `MediaSlot` tile styled in the dark/gold theme (subtle gold dashed border, icon, caption naming the shot). When you send photos we swap slot-for-slot with no layout change. Slots needed: hero burger group, 4 menu items, phone screen, catering trays.

## Routes
Nav needs pages that don't exist yet. This pass: build the header, footer, and full homepage; create stub pages for MENU, CATERING, OUR STORY, REWARDS (LOCATIONS, CAREERS/FRANCHISE, CONTACT already exist) so no link 404s. Full page builds come in later passes, one at a time.

## Technical notes
- `src/styles.css`: replace tokens with the black/gold set, add gold/hairline/card tokens; load Anton + DM Sans via `<link>` in `__root.tsx`.
- `src/components/SiteNav.tsx`, `SiteFooter.tsx`: rebuilt to the mockup bar layout.
- `src/routes/index.tsx`: full homepage; sections split into `src/components/home/*` for readability.
- `src/components/MediaSlot.tsx`: restyled for the dark/gold theme.
- Skyline and spatter rendered as inline SVG/CSS so they scale without extra image assets.
- Per-route `head()` metadata with Gotham Halal titles/descriptions.

## Assumptions (tell me if wrong)
- City is Rochester ("ROC ROOTS", "ROCHESTER PROUD") — the first mockup says NYC/Gotham instead; I'm going with Rochester.
- ORDER NOW links to ordergothamhalal.com; app store badges are non-functional placeholders for now.
- Address, hours, and social handles stay placeholders until you send them.
