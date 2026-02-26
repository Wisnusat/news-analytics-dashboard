'use client'

import { useEffect, useState, useCallback } from 'react'

export interface Article {
  id: string
  url: string
  title: string
  description?: string | null
  sourceName: string
  category: string
  author?: string | null
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface ArticlesMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface ArticlesResponse {
  data: Article[]
  meta: ArticlesMeta
}

interface UseArticlesParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
}

export function useArticles(params: UseArticlesParams) {
  const {
    page = 1,
    limit = 10,
    search = '',
    category = '',
    sort = 'updatedAt',
    order = 'desc',
  } = params

  const [articles, setArticles] = useState<Article[]>([])
  const [meta, setMeta] = useState<ArticlesMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order,
      })

      if (search) query.append('search', search)
      if (category) query.append('category', category)

      const res = await fetch(`/api/articles?${query}`)

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Failed to fetch articles')
      }

      const json: ArticlesResponse = await res.json()

      setArticles(json.data)
      setMeta(json.meta)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, category, sort, order])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return {
    articles,
    meta,
    loading,
    error,
    refetch: fetchArticles,
  }
}