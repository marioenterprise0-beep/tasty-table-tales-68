import { z } from "zod";

export const dietaryRequestSchema = z.object({ needs: z.string().trim().min(3).max(600) });
export const dietaryOutputSchema = z.object({
  summary: z.string(),
  matches: z.array(z.object({ itemId: z.string(), reason: z.string(), checks: z.string() })),
}).strict();
export type DietaryOutput = z.infer<typeof dietaryOutputSchema>;
export type DietaryItem = { id: string; name: string; description: string; ingredients: string[]; isVegetarian: boolean; price: string };

/** Never expose an invented or removed menu item, even if the model returns one. */
export function validDietaryMatches(result: DietaryOutput, menu: DietaryItem[]) {
  const allowed = new Set(menu.map((item) => item.id));
  const seen = new Set<string>();
  return { ...result, matches: result.matches.filter((match) => {
    if (!allowed.has(match.itemId) || seen.has(match.itemId)) return false;
    seen.add(match.itemId);
    return true;
  }).slice(0, 3) };
}