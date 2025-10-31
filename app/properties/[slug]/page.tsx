'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Image from 'next/image'
import { 
  Building2, MapPin, Bed, Bath, Square, TrendingUp, Calendar, 
  Home, DollarSign, Maximize, ArrowLeft, Phone, Mail, MessageSquare 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { MapboxMap } from '@/components/mapbox-map'

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchProperty()
    }
  }, [params.slug])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.slug}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setProperty(data.data)
      }
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
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
                <div className="relative h-[500px] rounded-lg overflow-hidden">
                  {allImages[selectedImage] ? (
                    <Image
                      src={allImages[selectedImage]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-dark to-green-dark flex items-center justify-center">
                      <Building2 className="h-24 w-24 text-green-light" />
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                {allImages.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 lg:h-32 rounded-lg overflow-hidden cursor-pointer ${
                      selectedImage === index ? 'ring-2 ring-green-dark' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
                      <MapboxMap
                        lat={property.location.coordinates.lat}
                        lng={property.location.coordinates.lng}
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
