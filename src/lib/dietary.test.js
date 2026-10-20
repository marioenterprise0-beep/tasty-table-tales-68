import { test, expect } from "bun:test";
import { validDietaryMatches, dietaryRequestSchema } from "./dietary.schemas.ts";

test("recommendations only contain existing menu items", () => {
  const result = validDietaryMatches({ summary: "Options", matches: [
    { itemId: "falafel", reason: "Vegetarian", checks: "Sauce" },
    { itemId: "invented", reason: "Invented", checks: "None" },
  ] }, [{ id: "falafel", name: "Smashafel", price: "8.00", description: "Falafel", ingredients: [], isVegetarian: true }]);
  expect(result.matches.map((match) => match.itemId)).toEqual(["falafel"]);
});
test("blank dietary requests are rejected", () => {
  expect(dietaryRequestSchema.safeParse({ needs: "   " }).success).toBe(false);
});