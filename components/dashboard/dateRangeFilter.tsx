'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, RefreshCw } from 'lucide-react'

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: string, endDate: string) => void
  lastSyncedAt?: string | null
  onSync?: () => Promise<void> | void
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
  const [selectedDays, setSelectedDays] = useState<number | null>(30)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const handlePresetClick = (days: number) => {
    setSelectedDays(days)

    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(
      // eslint-disable-next-line react-hooks/purity
      Date.now() - days * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T')[0]

    onDateRangeChange(startDate, endDate)
  }

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return

    setSelectedDays(null)
    onDateRangeChange(customStart, customEnd)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* LEFT SIDE */}
      <div className="flex flex-wrap items-center gap-2">

        <Calendar className="w-5 h-5 text-muted-foreground" />

        {/* Preset Buttons */}
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <Button
              key={preset.days}
              size="sm"
              variant={
                selectedDays === preset.days
                  ? 'default'
                  : 'outline'
              }
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

        {/* Custom Date Inputs */}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
          <Button
            size="sm"
            onClick={handleApplyCustom}
            disabled={!customStart || !customEnd}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE */}
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