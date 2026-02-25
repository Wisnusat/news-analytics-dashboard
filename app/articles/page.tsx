'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ArticleTable } from '@/components/articles/articleTable'
import { ArticleFilters } from '@/components/articles/articleFilters'
import { ArticleModal } from '@/components/articles/articleModal'
import { DeleteDialog } from '@/components/common/deleteDialog'
import { Toaster, toast } from 'sonner'
import { Plus, RefreshCw } from 'lucide-react'
import { MobileNav } from '@/components/common/mobileNav'

interface Article {
  id: number
  title: string
  source: string
  category: string
  published_at: string
  updated_at: string
  description?: string
  author?: string
  url?: string
}

interface NewArticle { 
  id?: number
  title: string
  source: string
  category: string
  published_at: string
  description?: string
  author?: string
  url?: string
}

interface PaginationData {
  articles: Article[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ArticleManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<string | null>(null)

  // Filter and sort states
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [source, setSource] = useState('')
  const [sorting, setSorting] = useState('updated_at-DESC')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)

  // Modal and dialog states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<{ id: number; title: string } | null>(null)
  const [isSavingArticle, setIsSavingArticle] = useState(false)
  const [isDeletingArticle, setIsDeletingArticle] = useState(false)

  // Extract unique categories and sources
  const categories = [...new Set(articles.map((a) => a.category))].sort()
  const sources = [...new Set(articles.map((a) => a.source))].sort()

  // Fetch articles
  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(source && { source }),
      })

      const [sortByCol, sortOrder] = sorting.split('-')
      params.append('sortBy', sortByCol)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/articles?${params}`)
      if (!response.ok) throw new Error('Failed to fetch articles')

      const data: PaginationData = await response.json()
      setArticles(data.articles)
      setTotal(data.total)
    } catch (error) {
      console.error('[v0] Error fetching articles:', error)
      toast.error('Failed to load articles')
    } finally {
      setIsLoading(false)
    }
  }, [search, category, source, sorting, page, limit])

  // Fetch sync status
  const fetchSyncStatus = useCallback(async () => {
    setLastSynced(new Date("Feb 24, 2026 16:14").toLocaleString())
    try {
      const response = await fetch('/api/articles/sync')
      if (response.ok) {
        const data = await response.json()
        if (data.lastSync) {
          setLastSynced(new Date(data.lastSync).toLocaleString())
        }
      }
    } catch (error) {
      console.error('[v0] Error fetching sync status:', error)
    }
  }, [])

  // Handle sync
  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/articles/sync', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to sync')
      toast.success('Articles synced successfully')
      setLastSynced(new Date().toLocaleString())
      await fetchArticles()
    } catch (error) {
      console.error('[v0] Error syncing:', error)
      toast.error('Failed to sync articles')
    } finally {
      setIsSyncing(false)
    }
  }

  // Handle create/edit
  const handleSaveArticle = async (formData: NewArticle) => {
    setIsSavingArticle(true)
    try {
      const url = formData.id ? `/api/articles/${formData.id}` : '/api/articles'
      const method = formData.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save article')

      toast.success(formData.id ? 'Article updated successfully' : 'Article created successfully')
      setIsModalOpen(false)
      setSelectedArticle(null)
      await fetchArticles()
    } catch (error) {
      console.error('[v0] Error saving article:', error)
      toast.error('Failed to save article')
    } finally {
      setIsSavingArticle(false)
    }
  }

  // Handle delete
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return

    setIsDeletingArticle(true)
    try {
      const response = await fetch(`/api/articles/${articleToDelete.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete article')

      toast.success('Article deleted successfully')
      setIsDeleteDialogOpen(false)
      setArticleToDelete(null)
      await fetchArticles()
    } catch (error) {
      console.error('[v0] Error deleting article:', error)
      toast.error('Failed to delete article')
    } finally {
      setIsDeletingArticle(false)
    }
  }

  // Handle sort
  const handleSort = (column: string) => {
    const [currentCol, currentOrder] = sorting.split('-')
    if (currentCol === column) {
      setSorting(`${column}-${currentOrder === 'ASC' ? 'DESC' : 'ASC'}`)
    } else {
      setSorting(`${column}-DESC`)
    }
  }

  // Initial load and refetch on filter changes
  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    fetchSyncStatus()
  }, [fetchSyncStatus])

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Article Management</h1>
            <p className="text-gray-600">Manage synchronized news articles and control data updates</p>
          </div>

          {/* Right side: Sync and Create buttons */}
          <MobileNav />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4 mb-4">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              variant="outline"
              className="gap-2 border-gray-200"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Data'}
            </Button>
              
            <Button
              onClick={() => {
                setSelectedArticle(null)
                setIsModalOpen(true)
              }}
              className="gap-2 bg-gray-900 hover:bg-gray-800"
            >
              <Plus size={16} />
              Create Article
            </Button>

            {lastSynced && (
              <p className="text-xs text-gray-500 mt-2">Last synced: {lastSynced}</p>
            )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ArticleFilters
            search={search}
            category={category}
            source={source}
            sorting={sorting}
            onSearchChange={setSearch}
            onCategoryChange={(value) => {
              setCategory(value)
              setPage(1)
            }}
            onSourceChange={(value) => {
              setSource(value)
              setPage(1)
            }}
            onSortingChange={(value) => {
              setSorting(value)
              setPage(1)
            }}
            categories={categories}
            sources={sources}
          />
        </div>

        {/* Table */}
        <div className="mb-8">
          <ArticleTable
            articles={articles}
            isLoading={isLoading}
            onEdit={(article) => {
              setSelectedArticle(article)
              setIsModalOpen(true)
            }}
            onDelete={(id) => {
              const article = articles.find((a) => a.id === id)
              if (article) {
                setArticleToDelete({ id, title: article.title })
                setIsDeleteDialogOpen(true)
              }
            }}
            onSort={handleSort}
            sortBy={sorting.split('-')[0]}
            sortOrder={sorting.split('-')[1]}
          />
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-4">
            <span>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} articles
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-2">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / limit)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal and Dialog */}
      <ArticleModal
        isOpen={isModalOpen}
        article={selectedArticle}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArticle(null)
        }}
        onSave={handleSaveArticle}
        isLoading={isSavingArticle}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        title={articleToDelete?.title || ''}
        onConfirm={handleDeleteArticle}
        onCancel={() => {
          setIsDeleteDialogOpen(false)
          setArticleToDelete(null)
        }}
        isLoading={isDeletingArticle}
      />

      <Toaster position="top-right" />
    </main>
  )
}