'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Images } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Gallery {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  images: Array<{
    url: string
    title: string
  }>
  isFeatured: boolean
  isPublic: boolean
  createdAt: string
}

export default function GalleriesAdminPage() {
  const router = useRouter()
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (pagination.page && pagination.limit) {
      fetchGalleries()
    }
  }, [filters, pagination.page])

  const fetchGalleries = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      params.append('page', String(pagination.page || 1))
      params.append('limit', String(pagination.limit || 12))

      const response = await fetch(`/api/galleries?${params}`)
      const data = await response.json()

      if (data.success) {
        setGalleries(data.data)
        setPagination(data.pagination)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch galleries',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch galleries',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return

    try {
      const response = await fetch(`/api/galleries/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Gallery deleted successfully'
        })
        fetchGalleries()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete gallery',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete gallery',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#064E3B] text-3xl font-bold">Photo Galleries</h1>
          <p className="text-muted-foreground mt-2">
            Manage your photo galleries and collections
          </p>
        </div>
        <Link href="/admin/galleries/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search galleries..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            
            <Select
              value={filters.category || undefined}
              onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Property">Property</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Galleries Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading galleries...</p>
        </div>
      ) : galleries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-64 text-center">
            <Images className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No galleries found</p>
            <p className="text-muted-foreground mb-4">
              Create your first photo gallery
            </p>
            <Link href="/admin/galleries/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card key={gallery._id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {gallery.images.length > 0 ? (
                  <img
                    src={gallery.images[0].url}
                    alt={gallery.images[0].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {gallery.isFeatured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {gallery.isPublic && (
                    <Badge variant="default">Public</Badge>
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{gallery.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{gallery.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {gallery.images.length} images
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {gallery.description}
                </p>
                <div className="flex gap-2">
                  <Link href={`/admin/galleries/edit/${gallery._id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(gallery._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
