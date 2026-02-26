/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

interface UseArticleActionsOptions {
  onSuccess?: (type: string) => void
  onError?: (error: string) => void
}

export function useArticleActions(options?: UseArticleActionsOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createArticle = async (payload: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Create failed')
      }

      if (options?.onSuccess) options.onSuccess('created')
    } catch (err: any) {
      setError(err.message)
      if (options?.onError) options.onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateArticle = async (id: string, payload: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Update failed')
      }

      if (options?.onSuccess) options.onSuccess('updated')
    } catch (err: any) {
      setError(err.message)
      if (options?.onError) options.onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Delete failed')
      }

      if (options?.onSuccess) options.onSuccess('deleted')
    } catch (err: any) {
      setError(err.message)
      if (options?.onError) options.onError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    loading,
    error,
  }
}