'use client'

import { useEffect, useState } from "react"

interface DashboardData {
  summary: {
    totalArticles: number
    topCategory: { category: string; count: number } | null
    topSource: { sourceName: string; count: number } | null
    latestPublishedAt: string | null
    lastSyncedAt: string | null
  }
  charts: {
    categoryDistribution: { category: string; count: number }[]
    dailyTrend: { date: string; count: number }[]
  }
}

export function useDashboard(from?: string, to?: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (from) params.append("from", from)
      if (to) params.append("to", to)

      const res = await fetch(`/api/dashboard/summary?${params}`)

      if (!res.ok) throw new Error("Failed to fetch dashboard")

      const json = await res.json()
      setData(json)
      setError(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [from, to])

  return { data, loading, error, refetch: fetchDashboard }
}