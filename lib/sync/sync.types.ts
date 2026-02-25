export interface RawArticle {
  url?: string
  title?: string
  publishedAt?: string
  source?: { name?: string }
  author?: string
  description?: string
  category?: string
}

export interface UpsertResult {
  createdAt: Date
  updatedAt: Date
}