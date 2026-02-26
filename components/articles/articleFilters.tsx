'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCcw, Search } from 'lucide-react'
import { Button } from '../ui/button'

interface ArticleFiltersProps {
  search: string
  category: string
  sorting: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortingChange: (value: string) => void
  categories: string[],
  sync: () => void,
  isSyncing: boolean,
  lastSyncedAt?: string | null,
}

const sortOptions = [
  { value: 'updatedAt-desc', label: 'Last Updated - Descending' },
  { value: 'updatedAt-asc', label: 'Last Updated - Ascending' },
  { value: 'publishedAt-desc', label: 'Published Date - Descending' },
  { value: 'publishedAt-asc', label: 'Published Date - Ascending' },
  { value: 'title-asc', label: 'Title - A to Z' },
  { value: 'title-desc', label: 'Title - Z to A' },
]

export function ArticleFilters({
  search,
  category,
  sorting,
  onSearchChange,
  onCategoryChange,
  onSortingChange,
  categories,
  sync,
  isSyncing,
  lastSyncedAt,
}: ArticleFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex md:flex-row flex-col md:justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search Input */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          {/* <Select value={source} onValueChange={onSourceChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((src) => (
                <SelectItem key={src} value={src}>
                  {src}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* Sorting */}
          <Select value={sorting} onValueChange={onSortingChange}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 md:mt-0 mt-2">
          {lastSyncedAt && (
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Last synced: {new Date(lastSyncedAt).toLocaleString()}
            </p>
          )}
          <Button
          onClick={sync}
          disabled={isSyncing}
          variant="outline"
          className="gap-2 border-gray-200"
          >
            <RefreshCcw
              size={16}
              className={isSyncing ? 'animate-spin' : ''}
            />
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </div>
    </div>
  )
}
