'use client'

import { useState } from 'react'

interface SyncResponse {
  message: string
  totalFetched: number
  uniqueProcessed: number
  inserted: number
  updated: number
  categoriesSynced: number
  durationMs: number
}

interface UseSyncOptions {
  onSuccess?: (data: SyncResponse) => void
  onError?: (error: string) => void
}

export function useSync(options?: UseSyncOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SyncResponse | null>(null)

  const sync = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/sync', {
        method: 'POST',
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Sync failed')
      }

      setData(json)

      if (options?.onSuccess) {
        options.onSuccess(json)
      }

      return json
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.message || 'Unknown sync error'
      setError(message)

      if (options?.onError) {
        options.onError(message)
      }

      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    sync,
    loading,
    error,
    data,
  }
}