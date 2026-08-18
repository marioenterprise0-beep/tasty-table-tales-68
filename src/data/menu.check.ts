import { MENU_DISHES, MENU_SECTIONS, FEATURED_DISHES, menuJsonLd, type MenuDish } from "./menu";

/**
 * Single source of truth guard.
 *
 * Every menu surface (homepage highlights, /menu page, JSON-LD) must derive its
 * items from MENU_DISHES in src/data/menu.ts. These checks fail loudly in dev if
 * a surface drifts (hardcoded dish, missing section, duplicate, bad price).
 */

export type MenuCheckIssue = { code: string; message: string };

const PRICE_RE = /^\d+\.\d{2}$/;

export function checkMenuData(dishes: MenuDish[] = MENU_DISHES): MenuCheckIssue[] {
  const issues: MenuCheckIssue[] = [];

  if (dishes.length === 0) {
    issues.push({ code: "empty", message: "MENU_DISHES is empty." });
  }

  const seen = new Set<string>();
  for (const d of dishes) {
    const key = `${d.section}::${d.name}`;
    if (seen.has(key)) {
      issues.push({ code: "duplicate", message: `Duplicate menu item: ${key}` });
    }
    seen.add(key);

    if (!d.name.trim()) issues.push({ code: "name", message: `Item in "${d.section}" has no name.` });
    if (!d.section.trim()) issues.push({ code: "section", message: `"${d.name}" has no section.` });
    if (!d.copy.trim()) issues.push({ code: "copy", message: `"${d.name}" has no description.` });
    if (!PRICE_RE.test(d.price)) {
      issues.push({ code: "price", message: `"${d.name}" has an invalid price: "${d.price}" (expected 00.00).` });
    }
  }

  // Derived collections must stay subsets of the source list.
  for (const f of FEATURED_DISHES) {
    if (!dishes.includes(f)) {
      issues.push({ code: "featured", message: `Featured dish "${f.name}" is not in MENU_DISHES.` });
    }
  }
  if (FEATURED_DISHES.length !== 4) {
    issues.push({
      code: "featured-count",
      message: `Homepage highlights expect 4 featured dishes, found ${FEATURED_DISHES.length}.`,
    });
  }

  const sectionsFromDishes = new Set(dishes.map((d) => d.section));
  if (MENU_SECTIONS.length !== sectionsFromDishes.size) {
    issues.push({ code: "sections", message: "MENU_SECTIONS is out of sync with MENU_DISHES." });
  }
  for (const s of MENU_SECTIONS) {
    if (!sectionsFromDishes.has(s)) {
      issues.push({ code: "sections", message: `Section "${s}" has no dishes.` });
    }
  }

  // Structured data must describe exactly what the page renders.
  const jsonLdCount = menuJsonLd.hasMenuSection.reduce((n, s) => n + s.hasMenuItem.length, 0);
  if (jsonLdCount !== dishes.length) {
    issues.push({
      code: "jsonld",
      message: `Menu JSON-LD lists ${jsonLdCount} items but MENU_DISHES has ${dishes.length}.`,
    });
  }

  return issues;
}

let reported = false;

/** Call from any menu surface; logs once in dev, no-ops in production. */
export function assertMenuSource(): void {
  if (!import.meta.env.DEV || reported) return;
  reported = true;
  const issues = checkMenuData();
  if (issues.length) {
    console.error(
      "[menu data check] Menu surfaces are out of sync with src/data/menu.ts:\n" +
        issues.map((i) => ` • [${i.code}] ${i.message}`).join("\n"),
    );
  }
}
