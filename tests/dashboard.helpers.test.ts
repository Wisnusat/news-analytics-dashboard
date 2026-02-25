import { describe, it, expect } from "vitest"
import {
  mapCategoryDistribution,
  mapDailyTrend,
} from "../lib/dashboard/dashboard.helpers"

describe("Dashboard Helpers", () => {

  it("should map _count to count correctly", () => {
    const raw = [
      {
        category: "technology",
        _count: { category: 10 },
      },
      {
        category: "business",
        _count: { category: 5 },
      },
    ]

    const result = mapCategoryDistribution(raw)

    expect(result).toEqual([
      { category: "technology", count: 10 },
      { category: "business", count: 5 },
    ])
  })

  it("should convert bigint to number and date to YYYY-MM-DD", () => {
    const raw = [
      {
        date: new Date("2026-02-23T00:00:00Z"),
        count: 10,
      },
    ]

    const result = mapDailyTrend(raw)

    expect(result[0].count).toBe(10)
    expect(result[0].date).toBe("2026-02-23")
  })

})