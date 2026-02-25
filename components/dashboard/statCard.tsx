'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  label: string
  value: string | number
  isLoading?: boolean
  subtext?: string
}

export function StatCard({ label, value, isLoading, subtext }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-24 bg-gray-200" />
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        )}
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}
