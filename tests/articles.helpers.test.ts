import { describe, it, expect } from "vitest"
import {
  validateCreateArticle,
  validateDuplicateUrl,
  validateNotFound,
} from "../lib/articles/articles.helpers"

describe("Articles helpers", () => {

  it("should return 400 when required fields are missing", () => {
    const result = validateCreateArticle({
      title: "Test Article",
    })

    expect(result.valid).toBe(false)
    expect(result.status).toBe(400)
  })

  it("should return valid when required fields exist", () => {
    const result = validateCreateArticle({
      title: "Test",
      sourceName: "BBC",
      category: "technology",
      publishedAt: "2026-02-25",
    })

    expect(result.valid).toBe(true)
  })

  it("should return 400 when duplicate exists", () => {
    const result = validateDuplicateUrl({ id: "123" })

    expect(result.valid).toBe(false)
    expect(result.status).toBe(400)
  })

  it("should return valid when no duplicate", () => {
    const result = validateDuplicateUrl(null)

    expect(result.valid).toBe(true)
  })

  it("should return 404 when entity not found", () => {
    const result = validateNotFound(null)

    expect(result.valid).toBe(false)
    expect(result.status).toBe(404)
  })

  it("should return valid when entity exists", () => {
    const result = validateNotFound({ id: "abc" })

    expect(result.valid).toBe(true)
  })

})