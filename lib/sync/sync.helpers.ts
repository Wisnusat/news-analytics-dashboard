import { RawArticle, UpsertResult } from "./sync.types"

// Remove invalid articles (missing required fields)
export function filterValidArticles(articles: RawArticle[]) {
  return articles.filter(
    (item) => item.url && item.title && item.publishedAt
  )
}

// Deduplicate articles by URL
export function dedupeArticles(articles: RawArticle[]) {
  const map = new Map<string, RawArticle>()

  for (const item of articles) {
    if (!item.url) continue
    map.set(item.url, item)
  }

  return Array.from(map.values())
}

// Count inserted vs updated results
export function countInsertUpdate(results: UpsertResult[]) {
  let inserted = 0
  let updated = 0

  for (const result of results) {
    if (result.createdAt.getTime() === result.updatedAt.getTime()) {
      inserted++
    } else {
      updated++
    }
  }

  return { inserted, updated }
}