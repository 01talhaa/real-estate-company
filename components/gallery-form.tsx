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
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/image-upload'

interface GalleryFormProps {
  galleryId?: string
}

export default function GalleryForm({ galleryId }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Property',
    propertyId: '',
    images: [] as Array<{ url: string; title: string; caption: string; order: number }>,
    isFeatured: false,
    isPublic: true
  })
  const [newImage, setNewImage] = useState({ url: '', title: '', caption: '' })
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (galleryId) {
      fetchGallery()
    }
  }, [galleryId])

  const fetchGallery = async () => {
    try {
      const response = await fetch(`/api/galleries/${galleryId}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch gallery',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch gallery',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = galleryId 
        ? `/api/galleries/${galleryId}` 
        : '/api/galleries'
      
      const method = galleryId ? 'PUT' : 'POST'

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
          description: `Gallery ${galleryId ? 'updated' : 'created'} successfully`
        })
        router.push('/admin/galleries')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save gallery',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving gallery:', error)
      toast({
        title: 'Error',
        description: 'Failed to save gallery',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (!newImage.url) {
      toast({
        title: 'Error',
        description: 'Please enter an image URL',
        variant: 'destructive'
      })
      return
    }

    setFormData({
      ...formData,
      images: [
        ...formData.images,
        {
          ...newImage,
          order: formData.images.length
        }
      ]
    })
    setNewImage({ url: '', title: '', caption: '' })
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newImages.length) return
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    
    setFormData({
      ...formData,
      images: newImages.map((img, i) => ({ ...img, order: i }))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/galleries">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[#064E3B] text-3xl font-bold">
              {galleryId ? 'Edit Gallery' : 'Add New Gallery'}
            </h1>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Gallery'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Gallery Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Downtown Luxury Apartments"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Gallery description..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Image */}
              <div className="p-4 border rounded-lg space-y-3">
                <h3 className="text-[#064E3B] font-medium">Add New Image</h3>
                <div className="grid gap-3">
                  <ImageUpload
                    value={newImage.url}
                    onChange={(url) => {
                      setNewImage({ ...newImage, url })
                      setUploadingImage(false)
                    }}
                    label="Upload Gallery Image"
                  />
                  <Input
                    placeholder="Image Title"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  />
                  <Input
                    placeholder="Image Caption"
                    value={newImage.caption}
                    onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  />
                  <Button 
                    type="button" 
                    onClick={addImage} 
                    className="w-full"
                    disabled={!newImage.url}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Gallery
                  </Button>
                </div>
              </div>

              {/* Image List */}
              <div className="space-y-3">
                {formData.images.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No images added yet
                  </p>
                ) : (
                  formData.images.map((image, index) => (
                    <div key={index} className="flex gap-3 p-3 border rounded-lg">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{image.title || 'Untitled'}</p>
                        <p className="text-sm text-muted-foreground">{image.caption}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === formData.images.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Property">Property</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="propertyId">Property ID (optional)</Label>
                <Input
                  id="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  placeholder="Link to specific property"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="featured">Featured Gallery</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <Label htmlFor="public">Public Gallery</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Images</span>
                  <span className="font-medium">{formData.images.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
