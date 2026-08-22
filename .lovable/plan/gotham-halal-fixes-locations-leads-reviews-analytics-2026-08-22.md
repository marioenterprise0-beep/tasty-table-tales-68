# Gotham Halal — Fixes, Locations, Leads, Reviews & Analytics

Everything in your list, built in one pass. Placeholders noted at the end.

## 1. Layout & overflow fixes
- Catering hero headline wraps and stays inside the container.
- Menu Highlights becomes a true responsive grid: 4 columns desktop, 2 tablet, 1 mobile — no clipped card.
- Sweep every page at 375 / 768 / 1440 px with a browser check and fix any horizontal scroll found.

## 2. Prices
- One `formatPrice` helper renders `$10.00` everywhere: menu grid, detail sheet, combos, homepage highlights. Raw values stay in the menu data file.

## 3. Ordering CTAs
- Single `ORDER_URL = https://ordergothamhalal.com` constant plus a helper that appends the UTM set you specified (`nav`, `hero`, `menu_card_[slug]`, `home_highlight_[slug]`, `catering`).
- All Order Now links open in the same tab; `<link rel="preconnect">` to the ordering domain added in the root head.

## 4. Locations data file
New `src/data/locations.ts` — the single source for the homepage block, Locations page and schema. Editable hours per location, no layout changes needed.
- West Ridge — 2534 W Ridge Rd, Rochester NY 14626 · (585) 946-8426 · open · pickup + delivery · order URL.
- Jefferson Road — 900 Jefferson Rd, Rochester NY 14623 · (585) 946-8426 · opening soon.
- Google Maps directions links use the two share links you sent.

## 5. "Where We're At" homepage block
Sits directly under the value-prop strip.
- Open card: name, address, today's hours, live Open/Closed pill computed from the hours data, Get Directions, Order From Here.
- Opening-soon card: orange OPENING SOON badge, name, address, Get Directions, and a primary "Get Opening Day Alerts" button. No ordering button. Countdown is included but only renders once a target date exists in the data file (you don't have one yet).
- "View All Locations" link to /locations.

## 6. Grand opening signup
- Modal: first name (required), phone (required), email (optional), "Text me when Jefferson Road opens" checkbox, submit "Count Me In", confirmation "You're on the list. We'll text you before we open."
- Backed by Lovable Cloud: submissions saved to a `opening_signups` table and emailed to hello@gothamhalal.com.
- Incentive line above the fields is a placeholder string in one file until you send the offer copy.

## 7. Announcement bar
Dismissible bar above the nav on every page — dark background, orange text, "Jefferson Road opening soon — get on the list". Click opens the signup modal; X dismisses for the session (sessionStorage).

## 8. Catering lead form
Replaces the "coming soon" line. Fields: full name, phone, email, event date, headcount, event type dropdown, delivery address, notes. Submit "Request a Quote"; confirmation "Got it — we'll reach out within 24 hours." Saved to a `catering_leads` table and emailed to hello@gothamhalal.com. Three trust points above the form: Halal Certified · Feeds 10–500+ · Fresh Made to Order.

## 9. Google reviews section
Homepage (between Menu Highlights and footer) and Locations page.
- "WHAT ROCHESTER SAYS", 4.7 badge with five stars (4.5 filled) and "278 Google Reviews", whole badge links to the Greece listing.
- Swipeable card row (3 desktop / 1 mobile) fed from `src/data/reviews.ts` with placeholder review text you can replace.
- Outlined "Leave a Review" button below.
- Brand-level only, no per-location ratings, no Review/AggregateRating JSON-LD.

## 10. Instagram feed
Above the footer: "FOLLOW THE FLAVOR" with the handle linking to instagram.com/gothamhalal. Behold feed URL lives in one config constant — until you paste it, the grid stays hidden and only the heading + orange "Follow @gothamhalal" button show. Same graceful behaviour on fetch error. 6 posts desktop / 4 mobile, 1:1 crop, lazy loaded, orange 80% hover overlay with Instagram glyph, permalinks in a new tab.

## 11. Image slots
- `MediaSlot` becomes a branded placeholder: dark navy, centered GH mark at low opacity, correct ratio per slot.
- Real `<img>` components built now with alt text, lazy loading below the fold, and `<picture>` webp + fallback, so a photo drops in by changing one path.
- All image paths centralised in `src/data/images.ts` (menu items, hero, Our Story, Catering hero).

## 12. Nav cleanup
Order Now is the only header button; Find a Location moves into the link list. Mobile drawer: all links plus a full-width Order Now pinned at the bottom.

## 13. SEO
Unique title + description per page (homepage: "Gotham Halal | Halal Smash Burgers & Loaded Fries — Rochester, NY"), OG title/description/image sitewide, favicon + apple-touch-icon from the GH mark, Restaurant JSON-LD with West Ridge only, Menu schema on /menu, sitemap.xml and robots.txt verified.

## 14. Analytics
Connect the Google Analytics connector, initialise gtag once, send page views on route changes, enable cross-domain linking to ordergothamhalal.com, and fire `order_click` with a `cta_location` parameter on every ordering CTA.

## Technical notes
- Lovable Cloud is enabled for the two lead tables. Inserts go through server functions with zod validation; RLS blocks public reads of lead data, and emails are sent server-side (a Resend API key will be requested when wiring email).
- Countdown, hours and Open/Closed logic are pure functions over the locations data file.

## Still needed from you
Jefferson Road opening date · opening-offer copy · Behold feed URL · GA4 measurement ID (via the connector card) · Resend API key for lead emails. Each is a one-line swap once you have it.
