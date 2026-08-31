import { z } from "zod";
import { phone } from "./leads.schemas";

export const ORDER_ITEMS = {
  single: {
    key: "single" as const,
    name: "The Gotham Single Smash",
    basePrice: 10,
  },
  double: {
    key: "double" as const,
    name: "The Gotham Double Smash",
    basePrice: 12,
  },
} as const;

export type OrderItemKey = keyof typeof ORDER_ITEMS;

/** Combo upgrade adds Gotham Regular Fries + a Dirty Soda. */
export const COMBO_UPCHARGE = 8;

export function unitPriceFor(item: OrderItemKey, combo: boolean) {
  return ORDER_ITEMS[item].basePrice + (combo ? COMBO_UPCHARGE : 0);
}

export const placeOrderSchema = z.object({
  item: z.enum(["single", "double"]),
  combo: z.boolean(),
  quantity: z.coerce.number().int().min(1, "At least one").max(20, "Max 20 per order"),
  locationSlug: z.string().trim().min(1).max(60),
  customerName: z.string().trim().min(1, "Name is required").max(120),
  customerPhone: phone,
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
