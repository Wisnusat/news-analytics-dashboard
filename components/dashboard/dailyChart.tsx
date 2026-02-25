'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface DailyData {
  date: string
  articles: number
  views: number
}

interface DailyChartProps {
  data: DailyData[]
  isLoading?: boolean
}

export function DailyChart({ data, isLoading }: DailyChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-full h-80 bg-gray-200 rounded-lg" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500">
        No data available
      </div>
    )
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    articles: item.articles,
    views: item.views
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
          formatter={(value) => [value, '']}
        />
        <Legend />
        <Bar dataKey="articles" fill="#3b82f6" name="Articles" />
        <Bar dataKey="views" fill="#10b981" name="Views" />
      </BarChart>
    </ResponsiveContainer>
  )
}
