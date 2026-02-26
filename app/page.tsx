'use client'

import { useState } from 'react'
import { StatCard } from '@/components/dashboard/statCard'
import { DateRangeFilter } from '@/components/dashboard/dateRangeFilter'
import { CategoryChart } from '@/components/dashboard/categoryChart'
import { DailyChart } from '@/components/dashboard/dailyChart'
import { Heart } from 'lucide-react'
import { MobileNav } from '@/components/common/mobileNav'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { useSync } from '@/lib/hooks/useSync'
import { toast, Toaster } from 'sonner'
import { useSyncStatus } from '@/lib/hooks/useSyncStatus'

export default function Dashboard() {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date().toISOString().split('T')[0]
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    return { start, end }
  })

  const { data, loading, error, refetch } = useDashboard(
    dateRange.start,
    dateRange.end
  )

  const { lastSyncedAt, refetch: fetchStatus } = useSyncStatus()

  const { sync, loading: syncLoading } = useSync({
    onSuccess: () => {
      refetch() // refresh dashboard
      fetchStatus()
    },
    onError: (err) => {
      console.error('Sync failed:', err)
      toast.error(`Sync failed: ${err}`)
    },
  })

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate })
  }

  const formatDateTime = (iso: string | null) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleString()
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              News Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor news distribution and publication trends by category and source
            </p>
          </div>
          <MobileNav />
        </div>

        {/* Date Filter & Sync */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-8">
          <DateRangeFilter
            onDateRangeChange={handleDateRangeChange}
            lastSyncedAt={formatDateTime(lastSyncedAt)}
            onSync={sync}
            isSyncing={syncLoading}
          />
        </div>

        {error && (
          <div className="mb-6 text-red-500 text-sm">
            Failed to load dashboard data.
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Articles"
            value={data?.summary.totalArticles ?? 0}
            isLoading={loading}
            subtext="Number of synchronized articles in this period"
          />

          <StatCard
            label="Top Category"
            value={data?.summary.topCategory?.category ?? '-'}
            isLoading={loading}
            subtext={`${
              data?.summary.topCategory?.count ?? 0
            } articles in this category`}
          />

          <StatCard
            label="Most Active Source"
            value={data?.summary.topSource?.sourceName ?? '-'}
            isLoading={loading}
            subtext={`${
              data?.summary.topSource?.count ?? 0
            } articles from this source`}
          />

          <StatCard
            label="Latest Published"
            value={formatDateTime(data?.summary.latestPublishedAt ?? null)}
            isLoading={loading}
            subtext="Latest article within selected range"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Articles by Category
            </h2>
            <CategoryChart
              data={
                data?.charts.categoryDistribution.map((item) => ({
                  name: item.category,
                  value: item.count,
                })) ?? []
              }
              isLoading={loading}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Daily Publication Trends
            </h2>
            <DailyChart
              data={data?.charts.dailyTrend ?? []}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full justify-center mt-8 items-center gap-1 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by Wisnu S</span>
        </div>
      </div>

      <Toaster position="top-right" />
    </main>
  )
}
