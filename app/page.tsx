'use client'

import { useState, useEffect } from 'react'
import { StatCard } from '@/components/dashboard/statCard'
import { DateRangeFilter } from '@/components/dashboard/dateRangeFilter'
import { CategoryChart } from '@/components/dashboard/categoryChart'
import { DailyChart } from '@/components/dashboard/dailyChart'
import { Heart } from 'lucide-react'
import { MobileNav } from '@/components/common/mobileNav'

interface AnalyticsSummary {
  totalArticles: number
  totalViews: number
  totalLikes: number
  avgViews: number
}

interface CategoryData {
  name: string
  value: number
  views: number
}

interface DailyData {
  date: string
  articles: number
  views: number
}

export default function Dashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [daily, setDaily] = useState<DailyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const initializeDateRange = () => {
    const end = new Date().toISOString().split('T')[0]
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    setDateRange({ start, end })
    fetchAnalytics(start, end)
  }

  const fetchAnalytics = async (startDate: string, endDate: string) => {
    setIsLoading(true)
    try {
      const [summaryRes, categoriesRes, dailyRes] = await Promise.all([
        fetch(
          `/api/analytics/summary?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`
        ),
        fetch(
          `/api/analytics/categories?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`
        ),
        fetch(
          `/api/analytics/daily?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`
        ),
      ])

      if (summaryRes.ok) {
        setSummary(await summaryRes.json())
      }
      if (categoriesRes.ok) {
        setCategories(await categoriesRes.json())
      }
      if (dailyRes.ok) {
        setDaily(await dailyRes.json())
      }
    } catch (error) {
      console.error('[v0] Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate })
    fetchAnalytics(startDate, endDate)
  }

  useEffect(() => {
    initializeDateRange()
  }, [])

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">News Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor news distribution and publication trends by category and source</p>
          </div>
          <MobileNav />
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-8">
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} lastSyncedAt="Feb 24, 2026 16:14" onSync={async () => console.log("syncing")} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Articles"
            value={summary?.totalArticles || 0}
            isLoading={isLoading}
            subtext="Number of synchronized articles in this period"
          />
          <StatCard
            label="Top Category"
            value={summary?.totalViews || 0}
            isLoading={isLoading}
            subtext="Most frequently published category"
          />
          <StatCard
            label="Most Active Source"
            value={summary?.totalLikes || 0}
            isLoading={isLoading}
            subtext="Leading publisher by article volume"
          />
          <StatCard
            label="Latest Published Date"
            value={summary?.avgViews || 0}
            isLoading={isLoading}
            subtext="Latest article within selected range"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Articles by Category</h2>
            <CategoryChart data={categories} isLoading={isLoading} />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Publication Trends</h2>
            <DailyChart data={daily} isLoading={isLoading} />
          </div>
        </div>
        <div className="flex w-full justify-center mt-8 items-center gap-1 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by Wisnu S</span>
        </div>
      </div>
    </main>
  )
}
