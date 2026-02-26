'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArticleTable } from '@/components/articles/articleTable'
import { ArticleFilters } from '@/components/articles/articleFilters'
import { ArticleModal } from '@/components/articles/articleModal'
import { DeleteDialog } from '@/components/common/deleteDialog'
import { Toaster, toast } from 'sonner'
import { Plus } from 'lucide-react'
import { MobileNav } from '@/components/common/mobileNav'
import { Article, useArticles } from '@/lib/hooks/useArticle'
import { useArticleActions } from '@/lib/hooks/useArticleAction'
import { useSync } from '@/lib/hooks/useSync'
import { useSyncStatus } from '@/lib/hooks/useSyncStatus'

export default function ArticleManagement() {

  // Filter and sort states
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sorting, setSorting] = useState('updatedAt-desc')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  // Modal and dialog states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null)
  
  // Articles hook
  const {
    articles,
    meta,
    loading,
    error,
    refetch
  } = useArticles({
    page,
    limit,
    search,
    category,
    sort: sorting.split('-')[0],
    order: sorting.split('-')[1] as 'asc' | 'desc',
  })

   // CRUD hook
   const {
    createArticle,
    updateArticle,
    deleteArticle,
    loading: actionLoading
   } = useArticleActions({
    onSuccess: (type) => {
      toast.success(`Article ${type} successfully`)
      refetch()
    },
    onError: () => toast.error('Failed to save article'),
   })

   // Sync hook
   const { lastSyncedAt, refetch: fetchStatus } = useSyncStatus()

   const { sync, loading: isSyncing } = useSync({
    onSuccess: () => {
      toast.success('Articles synced successfully')
      refetch()
      fetchStatus() 
    },
    onError: () => toast.error('Failed to sync articles'),
  })

  const categories: string[] = [
    "technology",
    "business",
    "health",
    "science",
    "sports",
  ]

  const handleSort = (column: string) => {
    const [currentCol, currentOrder] = sorting.split('-')

    if (currentCol === column) {
      setSorting(`${column}-${currentOrder === 'asc' ? 'desc' : 'asc'}`)
    } else {
      setSorting(`${column}-desc`)
    }

    setPage(1)
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Article Management
            </h1>
            <p className="text-gray-600">
              Manage synchronized news articles and control data updates
            </p>
          </div>
          <MobileNav />
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-3 mt-4 mb-4">
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
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ArticleFilters
            search={search}
            category={category}
            sorting={sorting}
            onSearchChange={(val) => {
              setSearch(val)
              setPage(1)
            }}
            onCategoryChange={(val) => {
              setCategory(val == "all" ? "" : val)
              setPage(1)
            }}
            onSortingChange={(val) => {
              setSorting(val)
              setPage(1)
            }}
            categories={categories}
            sync={sync}
            isSyncing={isSyncing}
            lastSyncedAt={lastSyncedAt}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-500 text-sm mb-4">
            Failed to load articles
          </div>
        )}

        {/* Table */}
        <ArticleTable
          articles={articles}
          isLoading={loading}
          onEdit={(article) => {
            setSelectedArticle(article)
            setIsModalOpen(true)
          }}
          onDelete={(id) => {
            const article = articles.find((a) => a.id === id)
            if (article) {
              setArticleToDelete(article)
              setIsDeleteDialogOpen(true)
            }
          }}
          onSort={handleSort}
          sortBy={sorting.split('-')[0]}
          sortOrder={sorting.split('-')[1]}
        />

        {/* Pagination */}
        {meta && (
          <div className="flex md:flex-row gap-y-2 flex-col items-center justify-between text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-4 mt-6">
            <span>
              Showing {(meta.page - 1) * meta.limit + 1} to{' '}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} articles
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
                Page {meta.page} of {meta.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= meta.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        article={selectedArticle}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArticle(null)
        }}
        onSave={async (formData) => {
          if (formData.id) {
            await updateArticle(formData.id.toString(), formData)
          } else {
            await createArticle(formData)
          }
          setIsModalOpen(false)
        }}
        isLoading={actionLoading}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        title={articleToDelete?.title || ''}
        onConfirm={async () => {
          await deleteArticle(articleToDelete?.id || '')
          setIsDeleteDialogOpen(false)
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isLoading={actionLoading}
      />

      <Toaster position="top-right" />
    </main>
  )
}