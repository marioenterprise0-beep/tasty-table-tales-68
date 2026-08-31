import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { assertAdmin, type AuthedContext } from "./admin.functions";
import type { LocationSettingRow, PublicMenu } from "./menu.types";

/** Publishable-key client for public, RLS-gated read-only data (anon SELECT policies). */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getPublicMenu = createServerFn({ method: "GET" }).handler(async (): Promise<PublicMenu> => {
  const supabase = publicClient();
  const [{ data: cats, error: catErr }, { data: items, error: itemErr }] = await Promise.all([
    supabase
      .from("menu_categories")
      .select("id, name, display_order, order_category_slug")
      .eq("is_active", true)
      .order("display_order"),
    supabase
      .from("menu_items")
      .select("id, category_id, name, description, price, card_price, is_vegetarian, is_featured, is_active, display_order, ingredients, add_ons")
      .eq("is_active", true)
      .order("display_order"),
  ]);
  if (catErr || itemErr) throw new Error("Couldn't load the menu.");
  return {
    categories: (cats ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      orderCategorySlug: c.order_category_slug,
      displayOrder: c.display_order,
    })),
    items: (items ?? []).map((i) => ({
      id: i.id,
      categoryId: i.category_id,
      name: i.name,
      description: i.description,
      price: String(i.price),
      cardPrice: i.card_price === null ? null : String(i.card_price),
      isVegetarian: i.is_vegetarian,
      isFeatured: i.is_featured,
      isActive: i.is_active,
      displayOrder: i.display_order,
      ingredients: i.ingredients ?? [],
      addOns: i.add_ons ?? [],
    })),
  };
});

export const getLocationSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<LocationSettingRow[]> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("location_settings")
      .select("location_slug, order_url, is_order_enabled");
    if (error) throw new Error("Couldn't load location settings.");
    return data ?? [];
  },
);

// ---------- Admin edits (role-checked, audited) ----------

const slugSchema = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/, "Lowercase letters, numbers and dashes only.");

export const updateMenuCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        orderCategorySlug: z.union([slugSchema, z.literal("")]).nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug = data.orderCategorySlug?.trim() || null;
    const { error } = await supabaseAdmin
      .from("menu_categories")
      .update({ order_category_slug: slug })
      .eq("id", data.id);
    if (error) throw new Error("Couldn't save that category.");
    const { recordAdminAction } = await import("./audit.server");
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "content_edit",
      targetType: "menu_category",
      targetId: data.id,
      detail: { order_category_slug: slug },
      ip: admin.ip,
    });
    return { ok: true as const };
  });

const itemUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  price: z.number().min(0).max(1000),
  cardPrice: z.number().min(0).max(1000).nullable(),
  isVegetarian: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  displayOrder: z.number().int().min(0).max(999),
});

export const updateMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => itemUpdateSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("menu_items")
      .update({
        name: data.name,
        description: data.description,
        price: data.price,
        card_price: data.cardPrice,
        is_vegetarian: data.isVegetarian,
        is_featured: data.isFeatured,
        is_active: data.isActive,
        display_order: data.displayOrder,
      })
      .eq("id", data.id);
    if (error) throw new Error("Couldn't save that item.");
    const { recordAdminAction } = await import("./audit.server");
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "content_edit",
      targetType: "menu_item",
      targetId: data.id,
      detail: { name: data.name, price: data.price, card_price: data.cardPrice, is_active: data.isActive },
      ip: admin.ip,
    });
    return { ok: true as const };
  });

export const updateLocationSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        locationSlug: z.string().trim().min(1).max(80),
        orderUrl: z.string().trim().url().max(300),
        isOrderEnabled: z.boolean(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("location_settings")
      .update({ order_url: data.orderUrl, is_order_enabled: data.isOrderEnabled })
      .eq("location_slug", data.locationSlug);
    if (error) throw new Error("Couldn't save that location.");
    const { recordAdminAction } = await import("./audit.server");
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "content_edit",
      targetType: "location_setting",
      targetId: data.locationSlug,
      detail: { order_url: data.orderUrl, is_order_enabled: data.isOrderEnabled },
      ip: admin.ip,
    });
    return { ok: true as const };
  });
