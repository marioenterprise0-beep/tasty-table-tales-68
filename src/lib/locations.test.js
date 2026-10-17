import { describe, expect, test } from "bun:test";
import { LOCATIONS, isOpenNow, todayHours } from "../data/locations";

describe("Jefferson Road hours", () => {
  const jefferson = LOCATIONS.find((location) => location.slug === "jefferson-road");
  const greece = LOCATIONS.find((location) => location.slug === "west-ridge");

  test("uses the same weekly schedule as Greece", () => {
    expect(jefferson?.hours).toEqual(greece?.hours);
    expect(jefferson?.hours).toHaveLength(7);
  });

  test("opens at 11AM and closes at midnight except Friday", () => {
    if (!jefferson) throw new Error("Jefferson Road is missing");
    for (const day of [0, 1, 2, 3, 4, 6]) {
      expect(jefferson.hours[day]).toEqual({ open: "11:00", close: "24:00" });
    }
    expect(isOpenNow(jefferson, new Date("2026-10-17T10:59:00-04:00"))).toBe(false);
    expect(isOpenNow(jefferson, new Date("2026-10-17T11:00:00-04:00"))).toBe(true);
    expect(isOpenNow(jefferson, new Date("2026-10-17T11:56:00-04:00"))).toBe(true);
    expect(isOpenNow(jefferson, new Date("2026-10-18T00:00:00-04:00"))).toBe(false);
  });

  test("Friday opens at 4PM and closes at midnight", () => {
    if (!jefferson) throw new Error("Jefferson Road is missing");
    expect(todayHours(jefferson, new Date("2026-10-16T12:00:00-04:00"))).toEqual({ open: "16:00", close: "24:00" });
    expect(isOpenNow(jefferson, new Date("2026-10-16T15:59:00-04:00"))).toBe(false);
    expect(isOpenNow(jefferson, new Date("2026-10-16T16:00:00-04:00"))).toBe(true);
    expect(isOpenNow(jefferson, new Date("2026-10-17T00:00:00-04:00"))).toBe(false);
  });
});