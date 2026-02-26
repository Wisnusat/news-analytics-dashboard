'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Article {
  id?: string
  title: string
  sourceName: string
  category: string
  publishedAt: string
  description?: string | null
  author?: string | null
  url?: string
}

interface ArticleModalProps {
  isOpen: boolean
  article: Article | null
  onClose: () => void
  onSave: (article: Article) => Promise<void>
  isLoading?: boolean
}

const categories = ['technology', 'business', 'health', 'science', 'sports']

export function ArticleModal({
  isOpen,
  article,
  onClose,
  onSave,
  isLoading = false,
}: ArticleModalProps) {
  const [formData, setFormData] = useState<Article>({
    title: '',
    sourceName: '',
    category: '',
    publishedAt: '',
    description: '',
    author: '',
    url: '',
  })

  useEffect(() => {
    if (article) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(article)
    } else {
      setFormData({
        title: '',
        sourceName: '',
        category: '',
        publishedAt: '',
        description: '',
        author: '',
        url: '',
      })
    }
  }, [article, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{article?.id ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          <DialogDescription>
            {article?.id
              ? 'Update the article details below.'
              : 'Add a new article with the details below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Article title"
              required
            />
          </div>

          {/* Source Name */}
          <div className="space-y-2">
            <Label htmlFor="sourceName" className="text-sm font-medium">
              Source Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sourceName"
              value={formData.sourceName}
              onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
              placeholder="News source"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Published Date */}
          <div className="space-y-2">
            <Label htmlFor="publishedAt" className="text-sm font-medium">
              Published Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={formData.publishedAt ? formData.publishedAt.slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, publishedAt: new Date(e.target.value).toISOString() })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Article description (optional)"
              rows={3}
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Author
            </Label>
            <Input
              id="author"
              value={formData.author || ''}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Article author (optional)"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url || ''}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Article URL (optional)"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-gray-800">
              {isLoading ? 'Saving...' : 'Save Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
