'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface ArticleFiltersProps {
  search: string
  category: string
  source: string
  sorting: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSourceChange: (value: string) => void
  onSortingChange: (value: string) => void
  categories: string[]
  sources: string[]
}

const sortOptions = [
  { value: 'updated_at-DESC', label: 'Last Updated - Descending' },
  { value: 'updated_at-ASC', label: 'Last Updated - Ascending' },
  { value: 'published_at-DESC', label: 'Published Date - Descending' },
  { value: 'published_at-ASC', label: 'Published Date - Ascending' },
  { value: 'title-ASC', label: 'Title - A to Z' },
  { value: 'title-DESC', label: 'Title - Z to A' },
]

export function ArticleFilters({
  search,
  category,
  source,
  sorting,
  onSearchChange,
  onCategoryChange,
  onSourceChange,
  onSortingChange,
  categories,
  sources,
}: ArticleFiltersProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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
        <Select value={source} onValueChange={onSourceChange}>
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
        </Select>

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
    </div>
  )
}
