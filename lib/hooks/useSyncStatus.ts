'use client'

import { useEffect, useState, useCallback } from 'react'

interface SyncStatusResponse {
  lastSyncedAt: string | null
  lastStatus: string | null
  totalFetched?: number
  inserted?: number
  updated?: number
}

interface UseSyncStatusOptions {
  pollingInterval?: number // milliseconds (optional)
}

export function useSyncStatus(options?: UseSyncStatusOptions) {
  const { pollingInterval } = options || {}

  const [data, setData] = useState<SyncStatusResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/sync/status')

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.message || 'Failed to fetch sync status')
      }

      const json: SyncStatusResponse = await res.json()
      setData(json)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Optional polling
  useEffect(() => {
    if (!pollingInterval) return

    const interval = setInterval(() => {
      fetchStatus()
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [pollingInterval, fetchStatus])

  return {
    lastSyncedAt: data?.lastSyncedAt ?? null,
    lastStatus: data?.lastStatus ?? null,
    totalFetched: data?.totalFetched ?? 0,
    inserted: data?.inserted ?? 0,
    updated: data?.updated ?? 0,
    loading,
    error,
    refetch: fetchStatus,
  }
}