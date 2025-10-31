'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface MultipleImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  label?: string
}

export default function MultipleImageUpload({
  value = [],
  onChange,
  maxImages = 10,
  label = 'Upload Images'
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check if adding these files would exceed max
    if (value.length + files.length > maxImages) {
      toast({
        title: 'Error',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive'
      })
      return
    }

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please select only image files',
          variant: 'destructive'
        })
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Each image must be less than 10MB',
          variant: 'destructive'
        })
        return
      }
    }

    try {
      setUploading(true)
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/cloudinary', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()
        if (!response.ok || !data.success) {
          console.error('Upload error:', data)
          throw new Error(data.error || 'Upload failed')
        }
        return data.data.secure_url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...value, ...uploadedUrls])

      toast({
        title: 'Success',
        description: `${uploadedUrls.length} image(s) uploaded successfully`
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...value]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newImages.length) return
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div>
        <label
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
            )}
            <p className="mb-1 text-sm text-black">
              <span className="font-semibold">{label}</span>
            </p>
            <p className="text-xs text-black">
              {value.length}/{maxImages} images • PNG, JPG, GIF up to 10MB each
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading || value.length >= maxImages}
          />
        </label>
      </div>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Controls */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === value.length - 1}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
