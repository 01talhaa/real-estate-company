import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, Bed, Bath, Square, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getFeaturedProperties() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/properties?featured=true&limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.error('Failed to fetch featured properties:', response.status, response.statusText)
      return []
    }
    
    const data = await response.json()
    console.log('Featured properties API response:', data)
    console.log('Number of featured properties found:', data.data?.length || 0)
    if (data.data && data.data.length > 0) {
      console.log('First property sample:', data.data[0])
      console.log('Featured flag:', data.data[0]?.isFeatured)
    }
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }
}

export async function FeaturedPropertiesSection() {
  const properties = await getFeaturedProperties()

  if (!properties || properties.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-muted text-green-dark font-medium text-sm mb-4">
            <Building2 className="h-4 w-4" />
            Featured Properties
          </div>
          <h2 className="text-[#064E3B] text-4xl md:text-5xl font-bold mb-4">
            Premium Real Estate Portfolio
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Discover our carefully curated selection of exceptional properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property: any) => (
            <Link href={`/properties/${property.slug}`} key={property._id}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                {/* Property Image */}
                <div className="relative h-64 overflow-hidden">
                  {property.gallery?.featuredImage ? (
                    <Image
                      src={property.gallery.featuredImage}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-muted to-green-muted flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-green-light" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={
                      property.status === 'Current' ? 'bg-green-500' :
                      property.status === 'Upcoming' ? 'bg-green-light' :
                      'bg-white0'
                    }>
                      {property.status}
                    </Badge>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                      {property.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Property Type */}
                  <div className="text-sm text-green-dark font-medium mb-2">
                    {property.type}
                  </div>

                  {/* Property Title */}
                  <h3 className="text-[#064E3B] text-xl font-bold mb-2 group-hover:text-green-dark transition-colors line-clamp-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-black mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm line-clamp-1">
                      {property.location.city}, {property.location.country}
                    </span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-black">
                    {property.specifications?.bedrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.specifications.bedrooms}</span>
                      </div>
                    )}
                    {property.specifications?.bathrooms > 0 && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.specifications.bathrooms}</span>
                      </div>
                    )}
                    {property.specifications?.totalArea > 0 && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.specifications.totalArea} {property.specifications.areaUnit}</span>
                      </div>
                    )}
                  </div>

                  {/* Price and ROI */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-black">
                        {property.financials.currency} {property.financials.price.toLocaleString()}
                      </div>
                      {property.financials.pricePerUnit > 0 && (
                        <div className="text-xs text-black">
                          {property.financials.currency} {property.financials.pricePerUnit}/
                          {property.specifications.areaUnit}
                        </div>
                      )}
                    </div>
                    {property.financials.expectedROI > 0 && (
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        {property.financials.expectedROI}% ROI
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/properties">
            <Button size="lg" className="bg-green-dark ">
              View All Properties
              <Building2 className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
