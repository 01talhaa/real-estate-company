'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Image from 'next/image'
import { 
  Building2, MapPin, Bed, Bath, Square, TrendingUp,
  Phone, Mail, MessageSquare, Expand, X, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { GoogleMap } from '@/components/google-map'
import propertiesDataRaw from '@/data/properties.json'

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (params.slug) {
      fetchProperty()
    }
  }, [params.slug])

  const fetchProperty = () => {
    try {
      const found = (propertiesDataRaw as any[]).find(p => p.slug === params.slug)
      if (found) {
        setProperty(found)
      }
    } catch (error) {
      console.error('Error finding property:', error)
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    document.body.style.overflow = ''
  }, [])

  const lightboxPrev = useCallback((allImages: string[]) => {
    setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const lightboxNext = useCallback((allImages: string[]) => {
    setLightboxIndex(i => (i + 1) % allImages.length)
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.5, 4))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.5, 0.5))
  const handleZoomReset = () => { setZoom(1); setOffset({ x: 0, y: 0 }) }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setZoom(z => Math.min(z + 0.2, 4))
    } else {
      setZoom(z => Math.max(z - 0.2, 0.5))
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightboxIndex(i => {
        const len = property?.gallery ? [property.gallery.featuredImage, ...(property.gallery.images || [])].filter(Boolean).length : 1
        return (i - 1 + len) % len
      })
      if (e.key === 'ArrowRight') setLightboxIndex(i => {
        const len = property?.gallery ? [property.gallery.featuredImage, ...(property.gallery.images || [])].filter(Boolean).length : 1
        return (i + 1) % len
      })
      if (e.key === '+') handleZoomIn()
      if (e.key === '-') handleZoomOut()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, closeLightbox, property])

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

  if (!property) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-[#064E3B] text-2xl font-bold mb-2">Property Not Found</h2>
            <Link href="/properties">
              <Button>Back to Properties</Button>
            </Link>
          </div>
        </div>
        <AppverseFooter />
      </>
    )
  }

  const allImages = [
    property.gallery?.featuredImage,
    ...(property.gallery?.images || [])
  ].filter(Boolean)

  return (
    <>
      <SiteHeader />
      
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-black">
              <Link href="/" className="hover:text-green-dark">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-green-dark">Properties</Link>
              <span>/</span>
              <span className="text-black">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="bg-black">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-3">
                <div
                  className="relative h-[500px] rounded-lg overflow-hidden group cursor-zoom-in"
                  onClick={() => openLightbox(selectedImage)}
                >
                  {allImages[selectedImage] ? (
                    <Image
                      src={allImages[selectedImage]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-dark to-green-dark flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-green-light" />
                    </div>
                  )}
                  {/* Expand overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/40">
                      <Expand className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  {/* Image count badge */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      {selectedImage + 1} / {allImages.length}
                    </div>
                  )}
                  {/* Gallery tag */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                    <Expand className="h-3 w-3" /> Click to expand
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                {allImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(index) }}
                    className={`relative h-24 lg:h-32 rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-black'
                        : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-white/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Double-click opens lightbox */}
                    <div
                      className="absolute inset-0"
                      onDoubleClick={(e) => { e.stopPropagation(); openLightbox(index) }}
                    />
                  </div>
                ))}
                {allImages.length > 4 && (
                  <div
                    onClick={() => openLightbox(4)}
                    className="relative h-24 lg:h-32 rounded-lg overflow-hidden cursor-pointer bg-black/80 flex items-center justify-center border border-white/20 hover:border-white/60 transition-colors"
                  >
                    <div className="text-center text-white">
                      <div className="text-2xl font-bold">+{allImages.length - 4}</div>
                      <div className="text-xs opacity-70">more</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            style={{ animation: 'fadeIn 0.2s ease' }}
            onClick={closeLightbox}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes scaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
            `}</style>

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Zoom controls */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <button onClick={(e) => { e.stopPropagation(); handleZoomOut() }} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="Zoom Out (-)">
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-white text-sm font-mono min-w-[48px] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={(e) => { e.stopPropagation(); handleZoomIn() }} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="Zoom In (+)">
                <ZoomIn className="h-4 w-4" />
              </button>
              <div className="w-px h-4 bg-white/30" />
              <button onClick={(e) => { e.stopPropagation(); handleZoomReset() }} className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors" title="Reset">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Prev button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); lightboxPrev(allImages) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); lightboxNext(allImages) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            {/* Main lightbox image */}
            <div
              className="relative flex items-center justify-center w-full h-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div
                style={{
                  transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  animation: 'scaleIn 0.25s ease',
                  willChange: 'transform',
                }}
                className="relative"
              >
                {allImages[lightboxIndex] && (
                  <img
                    src={allImages[lightboxIndex]}
                    alt={`${property.title} - Image ${lightboxIndex + 1}`}
                    className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {/* Thumbnail strip at bottom */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto pb-1 px-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); setZoom(1); setOffset({ x: 0, y: 0 }) }}
                    className={`flex-shrink-0 relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      i === lightboxIndex
                        ? 'border-green-400 scale-110 shadow-lg shadow-green-500/30'
                        : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-white/60 text-sm font-medium">
              {lightboxIndex + 1} of {allImages.length}
            </div>
          </div>
        )}

        {/* Property Info */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={
                            property.status === 'Current' ? 'bg-green-500' :
                            property.status === 'Upcoming' ? 'bg-green-light' :
                            'bg-white0'
                          }>
                            {property.status}
                          </Badge>
                          <Badge variant="outline">{property.type}</Badge>
                          <Badge variant="secondary">{property.category}</Badge>
                        </div>
                        <h1 className="text-[#064E3B] text-3xl md:text-4xl font-bold mb-2">
                          {property.title}
                        </h1>
                        <div className="flex items-center gap-2 text-black">
                          <MapPin className="h-5 w-5" />
                          <span className="text-lg">
                            {property.location.address}, {property.location.city}, {property.location.state}, {property.location.country}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-dark">
                          {property.financials.currency} {property.financials.price.toLocaleString()}
                        </div>
                        {property.financials.pricePerUnit > 0 && (
                          <div className="text-sm text-black">
                            {property.financials.currency} {property.financials.pricePerUnit}/{property.specifications.areaUnit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-4 gap-4 pt-6 border-t">
                      {property.specifications.bedrooms > 0 && (
                        <div className="text-center">
                          <Bed className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <div className="font-bold">{property.specifications.bedrooms}</div>
                          <div className="text-sm text-black">Bedrooms</div>
                        </div>
                      )}
                      {property.specifications.bathrooms > 0 && (
                        <div className="text-center">
                          <Bath className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <div className="font-bold">{property.specifications.bathrooms}</div>
                          <div className="text-sm text-black">Bathrooms</div>
                        </div>
                      )}
                      <div className="text-center">
                        <Square className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <div className="font-bold">{property.specifications.totalArea}</div>
                        <div className="text-sm text-black">{property.specifications.areaUnit}</div>
                      </div>
                      {property.financials.expectedROI > 0 && (
                        <div className="text-center">
                          <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                          <div className="font-bold text-green-600">{property.financials.expectedROI}%</div>
                          <div className="text-sm text-black">ROI</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="description">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="specifications">Specifications</TabsTrigger>
                        <TabsTrigger value="amenities">Amenities</TabsTrigger>
                        <TabsTrigger value="financials">Financials</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="mt-4">
                        <p className="text-black leading-relaxed whitespace-pre-line">
                          {property.description}
                        </p>
                      </TabsContent>

                      <TabsContent value="specifications" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-black mb-1">Total Area</div>
                            <div className="font-semibold">{property.specifications.totalArea} {property.specifications.areaUnit}</div>
                          </div>
                          {property.specifications.bedrooms > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Bedrooms</div>
                              <div className="font-semibold">{property.specifications.bedrooms}</div>
                            </div>
                          )}
                          {property.specifications.bathrooms > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Bathrooms</div>
                              <div className="font-semibold">{property.specifications.bathrooms}</div>
                            </div>
                          )}
                          {property.specifications.floors > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Floors</div>
                              <div className="font-semibold">{property.specifications.floors}</div>
                            </div>
                          )}
                          {property.specifications.yearBuilt && (
                            <div>
                              <div className="text-sm text-black mb-1">Year Built</div>
                              <div className="font-semibold">{property.specifications.yearBuilt}</div>
                            </div>
                          )}
                          {property.specifications.parkingSpaces > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Parking Spaces</div>
                              <div className="font-semibold">{property.specifications.parkingSpaces}</div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="amenities" className="mt-4">
                        <div className="space-y-4">
                          {property.amenities.interior?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Interior Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {property.amenities.interior.map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary">{item}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {property.amenities.exterior?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Exterior Features</h4>
                              <div className="flex flex-wrap gap-2">
                                {property.amenities.exterior.map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary">{item}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {property.amenities.building?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Building Amenities</h4>
                              <div className="flex flex-wrap gap-2">
                                {property.amenities.building.map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary">{item}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {property.amenities.nearby?.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Nearby</h4>
                              <div className="flex flex-wrap gap-2">
                                {property.amenities.nearby.map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary">{item}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="financials" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-black mb-1">Price</div>
                            <div className="font-semibold text-lg">{property.financials.currency} {property.financials.price.toLocaleString()}</div>
                          </div>
                          {property.financials.expectedROI > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Expected ROI</div>
                              <div className="font-semibold text-lg text-green-600">{property.financials.expectedROI}%</div>
                            </div>
                          )}
                          {property.financials.capRate > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Cap Rate</div>
                              <div className="font-semibold">{property.financials.capRate}%</div>
                            </div>
                          )}
                          {property.financials.annualAppreciation > 0 && (
                            <div>
                              <div className="text-sm text-black mb-1">Annual Appreciation</div>
                              <div className="font-semibold">{property.financials.annualAppreciation}%</div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Location Map */}
                {property.location.coordinates && (property.location.coordinates.lat !== 0 || property.location.coordinates.lng !== 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GoogleMap
                        lat={property.location.coordinates.lat}
                        lng={property.location.coordinates.lng}
                        address={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
                        draggable={false}
                        height="450px"
                        zoom={16}
                      />
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-green-dark mt-0.5" />
                          <div>
                            <div className="font-semibold">{property.location.address}</div>
                            <div className="text-sm text-black">
                              {property.location.city}, {property.location.state} {property.location.zipCode}
                            </div>
                            <div className="text-sm text-black">{property.location.country}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Request Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full" size="lg">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Us
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Inquiry
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Property ID</span>
                      <span className="font-semibold">{property._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Type</span>
                      <span className="font-semibold">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Status</span>
                      <span className="font-semibold">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Category</span>
                      <span className="font-semibold">{property.category}</span>
                    </div>
                    {property.specifications.yearBuilt && (
                      <div className="flex justify-between">
                        <span className="text-black">Year Built</span>
                        <span className="font-semibold">{property.specifications.yearBuilt}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppverseFooter />
    </>
  )
}
