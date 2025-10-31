'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentGallery, setCurrentGallery] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/galleries', {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setGalleries(data.data)
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  const openImageViewer = (gallery: any, imageUrl: string) => {
    setCurrentGallery(gallery)
    // Extract image URLs from the image objects - just uploaded images
    const imageUrls = gallery.images?.map((img: any) => 
      typeof img === 'string' ? img : img.url
    ).filter(Boolean) || []
    const index = imageUrls.indexOf(imageUrl)
    setCurrentImageIndex(index >= 0 ? index : 0)
    setSelectedImage(imageUrl)
    setZoom(1)
  }

  const closeImageViewer = () => {
    setSelectedImage(null)
    setCurrentGallery(null)
    setZoom(1)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!currentGallery) return
    
    // Extract image URLs from the image objects - just uploaded images
    const imageUrls = currentGallery.images?.map((img: any) => 
      typeof img === 'string' ? img : img.url
    ).filter(Boolean) || []
    let newIndex = currentImageIndex
    
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : imageUrls.length - 1
    } else {
      newIndex = currentImageIndex < imageUrls.length - 1 ? currentImageIndex + 1 : 0
    }
    
    setCurrentImageIndex(newIndex)
    setSelectedImage(imageUrls[newIndex])
    setZoom(1)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = async (imageUrl: string, galleryTitle: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${galleryTitle.replace(/\s+/g, '-')}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark"></div>
        </div>
        <AppverseFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-dark to-green-dark text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-[#064E3B] text-4xl md:text-5xl font-bold mb-4">
                Photo Galleries
              </h1>
              <p className="text-xl text-green-muted">
                Explore our collection of property and project photos
              </p>
            </div>
          </div>
        </section>

        {/* Galleries Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {galleries.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-[#064E3B] text-2xl font-bold mb-2">No Galleries Yet</h3>
                <p className="text-black">Check back later for photo galleries</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleries.map((gallery) => {
                  // Extract image URLs from the image objects - just the uploaded images
                  const imageUrls = gallery.images?.map((img: any) => 
                    typeof img === 'string' ? img : img.url
                  ).filter(Boolean) || []
                  
                  const firstImage = imageUrls[0] || null
                  
                  console.log('Gallery:', gallery.title, 'First Image:', firstImage)
                  
                  return (
                    <Card
                      key={gallery._id}
                      className="overflow-hidden cursor-pointer group"
                      onClick={() => firstImage && openImageViewer(gallery, firstImage)}
                    >
                      {/* Display First Image as Preview */}
                      <div className="relative h-64">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={gallery.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-light to-green-light flex items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-white" />
                          </div>
                        )}
                        
                        {/* Image Count Badge */}
                        {imageUrls.length > 0 && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-black/70 text-white">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              {imageUrls.length} Photos
                            </Badge>
                          </div>
                        )}
                        
                        {/* Featured Badge */}
                        {gallery.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-yellow-500">Featured</Badge>
                          </div>
                        )}
                      </div>

                      {/* Gallery Info */}
                      <div className="p-6">
                        {/* Category Badge */}
                        {gallery.category && (
                          <Badge variant="secondary" className="mb-3">
                            {gallery.category}
                          </Badge>
                        )}

                        {/* Title */}
                        <h3 className="text-[#064E3B] text-xl font-bold mb-2 line-clamp-2 group-hover:text-green-dark transition-colors">
                          {gallery.title}
                        </h3>

                        {/* Description */}
                        {gallery.description && (
                          <p className="text-black text-sm mb-4 line-clamp-2">
                            {gallery.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageViewer}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black">
          <VisuallyHidden>
            <DialogTitle>Gallery Image Viewer</DialogTitle>
          </VisuallyHidden>
          <div className="relative h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={closeImageViewer}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {currentGallery && currentGallery.images && currentGallery.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 bg-black/60 rounded-full px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <span className="text-white text-sm min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => selectedImage && currentGallery && handleDownload(selectedImage, currentGallery.title)}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>

            {/* Image */}
            {selectedImage && (
              <div 
                className="overflow-auto max-h-full max-w-full p-8"
                style={{
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <img
                  src={selectedImage}
                  alt="Gallery image"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Image Counter */}
            {currentGallery && currentGallery.images && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/60 rounded-full px-4 py-2">
                <span className="text-white text-sm">
                  {currentImageIndex + 1} / {currentGallery.images.length}
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AppverseFooter />
    </>
  )
}
