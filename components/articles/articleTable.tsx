'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit2, Trash2, ArrowUpDown, FolderX } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

interface Article {
  id: number
  title: string
  source: string
  category: string
  published_at: string
  updated_at: string
}

interface ArticleTableProps {
  articles: Article[]
  isLoading: boolean
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
  onSort: (column: string) => void
  sortBy: string
  sortOrder: string
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Technology: 'bg-blue-100 text-blue-800',
    Business: 'bg-green-100 text-green-800',
    Health: 'bg-red-100 text-red-800',
    Environment: 'bg-emerald-100 text-emerald-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortHeader = ({ column, label, currentSort, currentOrder, onSort }: any) => {
  const isActive = currentSort === column
  return (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown
          size={14}
          className={`${isActive ? 'opacity-100' : 'opacity-30'} transition-opacity`}
        />
      </div>
    </TableHead>
  )
}

export function ArticleTable({
  articles,
  isLoading,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}: ArticleTableProps) {
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="h-12">Title</TableHead>
              <TableHead className="h-12">Source</TableHead>
              <TableHead className="h-12">Category</TableHead>
              <TableHead className="h-12">Published</TableHead>
              <TableHead className="h-12">Updated</TableHead>
              <TableHead className="h-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!articles.length) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-12">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderX />
            </EmptyMedia>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>No articles found. Try adjusting your filters or create a new article.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
              <SortHeader
                column="title"
                label="Title"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                column="source"
                label="Source"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                column="category"
                label="Category"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                column="published_at"
                label="Published"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                column="updated_at"
                label="Updated"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow
                key={article.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium text-gray-900 max-w-xs">
                  <span title={article.title}>{truncate(article.title, 45)}</span>
                </TableCell>
                <TableCell className="text-gray-600">{article.source}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">{formatDate(article.published_at)}</TableCell>
                <TableCell className="text-gray-600 text-sm">{formatDateTime(article.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(article)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(article.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
