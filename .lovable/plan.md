# Jefferson Opening, Location Picker, and Ordering-Site Integration

## 1. Jefferson Road grand opening: September 18, 2026
- Set `openingDate: "2026-09-18"` in `src/data/locations.ts` (and in the DB-backed location settings below), which switches on the existing countdown logic in `LocationsBlock` and updates the announcement bar copy to the confirmed date.
- On/after Sept 18, Jefferson flips from "Opening Soon" to orderable — driven by an admin-toggleable `is_order_enabled` flag, defaulting to off until opening day.

## 2. Location picker for "Order Now"
- Nav "Order Now" opens a small branded modal: "Which location?" with two buttons — West Ridge and Jefferson Road.
- Before Jefferson is enabled: Jefferson button disabled with "Opening Soon" label, and Order Now skips the modal, going straight to West Ridge.
- After enablement: both enabled, modal appears.
- Choice stored in `localStorage`; return visits skip the modal and go to the last-used location, with a small "Change location" link to reopen the picker.
- Location cards' "Order From Here" buttons bypass the modal.
- Each location's destination URL is a data value (both point to `https://ordergothamhalal.com` for now), editable from the admin panel — no rebuild needed once the real per-location URL format is confirmed. No geolocation, no zip entry, no invented URL formats.

## 3. Move menu + location settings into the database (admin-editable)
New migration:
- `menu_categories` — name, display order, `order_category_slug` (nullable)
- `menu_items` — category ref, name, description, cash price, optional `card_price`, `is_vegetarian` flag, display order, active flag
- `location_settings` — per-location `order_url` and `is_order_enabled`
- Seed all existing menu items from `src/data/menu.ts` as literal INSERTs so nothing is lost.
- RLS: public read (anon SELECT) for menu tables and location settings; admin-only writes via `has_role`.
- Admin panel gets new tabs to edit category slugs, item prices/descriptions/flags, card prices, and location order URLs/toggles — changes go live without a rebuild.
- Site menu reads from the DB via a public server function, falling back to the static data file if the read fails.

## 4. Category deep links to the ordering site
- Ordering site format: `https://ordergothamhalal.com/order-now/[category-slug]` (confirmed: `/order-now/gotham-burgers`).
- When a category has an `order_category_slug`, its Order buttons link to that deep link with existing UTM params appended; no slug → base ordering URL.
- Seed mapping: Gotham Burgers → `gotham-burgers`; all other categories left blank until you confirm POS equivalents.

## 5. Menu reconciliation
- Add missing POS items: Smashafel — $8.00 — crispy smashed falafel, Gotham sauce, toasted bun (vegetarian). Gotham Loaded Fries and Bag of Chips get placeholder entries marked inactive until you confirm prices/descriptions — they won't render on the site until activated.
- `is_vegetarian` badge (small, gold-outlined) on flagged items; the Healthy Options filter also includes vegetarian-flagged items.

## 6. Dual pricing disclosure
- Cash price stays the main displayed number everywhere.
- Persistent body-size line at top of the Menu page and inside the item detail sheet: "Prices shown are cash prices. Card payments include a small processing fee. Tax additional."
- When an item has `card_price` set, show smaller secondary text under the cash price: "$13.51 with card".

## Technical notes
- One migration for the three new tables (with GRANTs + RLS), plus a second small migration if seed data needs adjusting after review.
- Public reads via a publishable-key server function (`TO anon` SELECT policies, safe columns only).
- Admin writes via `requireSupabaseAuth` + `has_role('admin')`, with audit-log entries for menu/location edits.
- Existing UTM campaign tracking (`orderUrl(content)`) is preserved on all deep links.
- Explicitly out of scope: geolocation, zip-code routing, guessing the ordering site's location-URL format.
