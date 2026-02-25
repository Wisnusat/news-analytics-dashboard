import { describe, it, expect } from "vitest"
import {
  filterValidArticles,
  dedupeArticles,
  countInsertUpdate,
} from "../lib/sync/sync.helpers"

describe("Sync Helpers", () => {

  it("should skip invalid articles", () => {
    const input = [
      { url: "a", title: "Title A", publishedAt: "2026-01-01" },
      { url: "b", title: "Title B" }, // missing publishedAt
      { title: "No URL", publishedAt: "2026-01-01" }, // missing url
    ]

    const result = filterValidArticles(input)

    expect(result.length).toBe(1)
    expect(result[0].url).toBe("a")
  })

  it("should deduplicate articles by url", () => {
    const input = [
      { url: "a", title: "A1", publishedAt: "2026-01-01" },
      { url: "a", title: "A2", publishedAt: "2026-01-01" },
      { url: "b", title: "B", publishedAt: "2026-01-01" },
    ]

    const result = dedupeArticles(input)

    expect(result.length).toBe(2)
    expect(result.find((r) => r.url === "a")).toBeDefined()
    expect(result.find((r) => r.url === "b")).toBeDefined()
  })

  it("should count inserted and updated correctly", () => {
    const now = new Date()

    const results = [
      { createdAt: now, updatedAt: now }, // inserted
      {
        createdAt: now,
        updatedAt: new Date(now.getTime() + 1000),
      }, // updated
    ]

    const count = countInsertUpdate(results)

    expect(count.inserted).toBe(1)
    expect(count.updated).toBe(1)
  })
})