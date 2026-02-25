import { CreateArticleInput } from "./articles.types"

// Validate required fields for article creation
export function validateCreateArticle(input: CreateArticleInput) {
  const { title, sourceName, category, publishedAt } = input

  if (!title || !sourceName || !category || !publishedAt) {
    return {
      valid: false,
      status: 400,
      message: "Missing required fields",
    }
  }

  return { valid: true }
}

// Validate duplicate URL
export function validateDuplicateUrl(existing: unknown) {
  if (existing) {
    return {
      valid: false,
      status: 400,
      message: "Article with this URL already exists",
    }
  }

  return { valid: true }
}

// Validate not found entity
export function validateNotFound(existing: unknown) {
  if (!existing) {
    return {
      valid: false,
      status: 404,
      message: "Article not found",
    }
  }

  return { valid: true }
}