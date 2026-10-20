import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { dietaryRequestSchema } from "./dietary.schemas";

export const getDietaryRecommendations = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => dietaryRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { recommendDietary } = await import("./dietary.server");
    try {
      return { result: await recommendDietary(data.needs, getRequest().signal), error: null };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : "Recommendations are unavailable." };
    }
  });