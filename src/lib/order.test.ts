import { describe, expect, test } from "bun:test";
import { ORDER_URL, buildOrderUrl } from "./order";
import { LOCATIONS, OPEN_LOCATIONS } from "../data/locations";

describe("POS ordering requirements", () => {
  test("homepage orders go to the existing POS, not the disconnected form", () => {
    const url = new URL(buildOrderUrl({ content: "hero" }));
    expect(ORDER_URL).toBe("https://ordergothamhalal.com");
    expect(url.origin).toBe("https://ordergothamhalal.com");
    expect(url.pathname).toBe("/");
  });

  test("Jefferson Road is open and can use the POS", () => {
    const location = LOCATIONS.find((loc) => loc.slug === "jefferson-road");
    expect(location?.status).toBe("open");
    expect(OPEN_LOCATIONS.some((loc) => loc.slug === "jefferson-road")).toBe(true);
    expect(location?.orderUrl).toBe("https://ordergothamhalal.com");
  });
});