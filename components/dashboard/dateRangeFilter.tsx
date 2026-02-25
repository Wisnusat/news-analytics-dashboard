'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, RefreshCw } from 'lucide-react'

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
  lastSyncedAt?: string | null
  onSync?: () => Promise<void>
  isSyncing?: boolean
}

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

export function DateRangeFilter({
  onDateRangeChange,
  lastSyncedAt,
  onSync,
  isSyncing = false,
}: DateRangeFilterProps) {
  const [selectedDays, setSelectedDays] = useState(30)

  const handlePresetClick = (days: number) => {
    setSelectedDays(days)

    const endDate = new Date().toISOString().split('T')[0]
    // eslint-disable-next-line react-hooks/purity
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    onDateRangeChange(startDate, endDate)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <Button
              key={preset.days}
              variant={selectedDays === preset.days ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset.days)}
              className={
                selectedDays === preset.days
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : ''
              }
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastSyncedAt && (
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Last synced: {new Date(lastSyncedAt).toLocaleString()}
          </p>
        )}

        {onSync && (
          <Button
            size="sm"
            variant="outline"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
        )}
      </div>
    </div>
  )
}