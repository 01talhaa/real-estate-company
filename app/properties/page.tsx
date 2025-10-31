'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, Bed, Bath, Square, TrendingUp, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
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
    fetchProperties()
  }, [filters, pagination.page])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)
      if (filters.category) params.append('category', filters.category)
      if (filters.search) params.append('search', filters.search)
      params.append('page', String(pagination.page || 1))
      params.append('limit', String(pagination.limit || 12))

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.data)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-br from-green-muted to-green-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-[#064E3B] text-5xl md:text-6xl font-bold mb-6">
                Discover Premium Properties
              </h1>
              <p className="text-xl text-black max-w-2xl mx-auto">
                Browse our exclusive collection of residential and commercial properties
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search properties..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select
                value={filters.status || undefined}
                onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.type || undefined}
                onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Hospitality">Hospitality</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.category || undefined}
                onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark mx-auto"></div>
                <p className="mt-4 text-black">Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-[#064E3B] text-2xl font-bold mb-2">No properties found</h3>
                <p className="text-black">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-black">
                    Showing {properties.length} of {pagination.total} properties
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {properties.map((property) => (
                    <Link href={`/properties/${property.slug}`} key={property._id}>
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative h-48 overflow-hidden">
                          {property.gallery?.featuredImage ? (
                            <Image
                              src={property.gallery.featuredImage}
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-muted to-green-muted flex items-center justify-center">
                              <Building2 className="h-12 w-12 text-green-light" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className={
                              property.status === 'Current' ? 'bg-green-500' :
                              property.status === 'Upcoming' ? 'bg-green-light' :
                              'bg-white0'
                            }>
                              {property.status}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <div className="text-xs text-green-dark font-medium mb-1">
                            {property.type}
                          </div>
                          <h3 className="text-[#064E3B] font-bold mb-2 group-hover:text-green-dark transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 text-black text-sm mb-3">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{property.location.city}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 mb-3 text-xs text-black">
                            {property.specifications?.bedrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{property.specifications.bedrooms}</span>
                              </div>
                            )}
                            {property.specifications?.bathrooms > 0 && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3" />
                                <span>{property.specifications.bathrooms}</span>
                              </div>
                            )}
                            {property.specifications?.totalArea > 0 && (
                              <div className="flex items-center gap-1">
                                <Square className="h-3 w-3" />
                                <span>{property.specifications.totalArea}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="font-bold text-lg">
                              {property.financials.currency} {property.financials.price.toLocaleString()}
                            </div>
                            {property.financials.expectedROI > 0 && (
                              <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                                <TrendingUp className="h-3 w-3" />
                                {property.financials.expectedROI}%
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-sm text-black">
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
              </>
            )}
          </div>
        </section>
      </main>

      <AppverseFooter />
    </>
  )
}
