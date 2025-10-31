'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/image-upload'

interface InsightFormProps {
  insightId?: string
}

export default function InsightForm({ insightId }: InsightFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Market Analysis',
    tags: [] as string[],
    status: 'draft',
    isFeatured: false,
    author: {
      name: '',
      title: '',
      avatar: ''
    },
    featuredImage: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  })

  useEffect(() => {
    if (insightId) {
      fetchInsight()
    }
  }, [insightId])

  const fetchInsight = async () => {
    try {
      const response = await fetch(`/api/insights/${insightId}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch insight',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch insight',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = insightId 
        ? `/api/insights/${insightId}` 
        : '/api/insights'
      
      const method = insightId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `Insight ${insightId ? 'updated' : 'created'} successfully`
        })
        router.push('/admin/insights')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save insight',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to save insight',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }
      
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/insights">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[#064E3B] text-3xl font-bold">
              {insightId ? 'Edit Insight' : 'Add New Insight'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={loading}
            onClick={() => updateField('status', 'draft')}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={loading}
            onClick={() => updateField('status', 'published')}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                  placeholder="e.g., 2024 Real Estate Market Trends"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  required
                  rows={3}
                  placeholder="Brief summary of the article..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  required
                  rows={20}
                  placeholder="Full article content (supports markdown)..."
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Supports Markdown formatting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={formData.author.name}
                  onChange={(e) => updateField('author.name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="authorTitle">Author Title</Label>
                <Input
                  id="authorTitle"
                  value={formData.author.title}
                  onChange={(e) => updateField('author.title', e.target.value)}
                  placeholder="e.g., Senior Investment Analyst"
                />
              </div>

              <div>
                <Label>Author Avatar</Label>
                <ImageUpload
                  value={formData.author.avatar}
                  onChange={(url) => updateField('author.avatar', url)}
                  label="Upload Author Avatar"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={(e) => updateField('seo.metaTitle', e.target.value)}
                  placeholder="Leave blank to use article title"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={(e) => updateField('seo.metaDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  value={formData.seo.keywords.join(', ')}
                  onChange={(e) => updateField('seo.keywords', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="real estate, investment, market trends"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => updateField('isFeatured', checked)}
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                    <SelectItem value="Investment Tips">Investment Tips</SelectItem>
                    <SelectItem value="Industry News">Industry News</SelectItem>
                    <SelectItem value="Trends">Trends</SelectItem>
                    <SelectItem value="Regulations">Regulations</SelectItem>
                    <SelectItem value="Case Study">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => updateField('tags', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="residential, commercial, investment"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => updateField('featuredImage', url)}
                label="Upload Featured Image"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
