'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Save, MapPin, Loader2 } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/image-upload'
import MultipleImageUpload from '@/components/multiple-image-upload'
import { GoogleMap } from '@/components/google-map'

interface PropertyFormProps {
  propertyId?: string
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [geocoding, setGeocoding] = useState(false)
  const [showMapHint, setShowMapHint] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    status: 'Current',
    type: 'Residential',
    category: 'For Sale',
    isFeatured: false,
    
    // Location
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      coordinates: {
        lat: 0,
        lng: 0
      }
    },
    
    // Financials
    financials: {
      price: 0,
      currency: 'USD',
      pricePerUnit: 0,
      expectedROI: 0,
      netOperatingIncome: 0,
      capRate: 0,
      annualAppreciation: 0
    },
    
    // Specifications
    specifications: {
      totalArea: 0,
      areaUnit: 'sqft',
      bedrooms: 0,
      bathrooms: 0,
      floors: 0,
      yearBuilt: new Date().getFullYear(),
      parkingSpaces: 0,
      lotSize: 0
    },
    
    // Amenities
    amenities: {
      interior: [] as string[],
      exterior: [] as string[],
      building: [] as string[],
      nearby: [] as string[]
    },
    
    // Gallery
    gallery: {
      featuredImage: '',
      images: [] as string[],
      floorPlans: [] as string[],
      videos: [] as string[],
      virtualTour: ''
    },
    
    // SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[]
    }
  })

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

  const geocodeAddress = async (silent = false) => {
    const address = `${formData.location.address}, ${formData.location.city}, ${formData.location.state}, ${formData.location.country}`
    
    // Don't geocode if address is incomplete
    if (!formData.location.address || !formData.location.city) {
      console.log('Geocoding skipped - incomplete address')
      return
    }

    console.log('Geocoding address:', address)
    setGeocoding(true)
    
    try {
      // Use our server-side API route (bypasses CORS)
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(address)}`
      )
      
      const result = await response.json()
      console.log('Geocoding response:', result)
      
      if (result.success && result.data) {
        const { lat, lng } = result.data
        console.log('Coordinates found:', { lat, lng })
        
        // Update coordinates and store whether it's approximate
        const isApproximate = result.fallback || result.message?.includes('Approximate')
        
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              lat: lat,
              lng: lng
            }
          }
        }))
        
        // Store approximate state to show hint
        setShowMapHint(isApproximate)
        
        if (!silent) {
          if (isApproximate) {
            toast({
              title: '📍 Approximate Location',
              description: result.message || 'Drag the blue marker on the map to set the exact position.',
              duration: 5000,
            })
          } else {
            toast({
              title: '✅ Location Found',
              description: result.message || 'You can still drag the marker to fine-tune the position.'
            })
          }
        }
      } else {
        if (!silent) {
          toast({
            title: 'Warning',
            description: 'Could not find coordinates for this address',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      if (!silent) {
        toast({
          title: 'Error',
          description: 'Failed to geocode address',
          variant: 'destructive'
        })
      }
    } finally {
      setGeocoding(false)
    }
  }

  // Auto-geocode when address changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.location.address && formData.location.city) {
        geocodeAddress(true) // Pass true for silent mode (no toast notifications)
      }
    }, 1500) // Wait 1.5 seconds after user stops typing

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.location.address, formData.location.city, formData.location.state, formData.location.country])

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()
      
      if (data.success) {
        setFormData(data.data)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch property',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching property:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch property',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = propertyId 
        ? `/api/properties/${propertyId}` 
        : '/api/properties'
      
      const method = propertyId ? 'PUT' : 'POST'

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
          description: `Property ${propertyId ? 'updated' : 'created'} successfully`
        })
        router.push('/admin/properties')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save property',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving property:', error)
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/properties">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[#064E3B] text-3xl font-bold">
              {propertyId ? 'Edit Property' : 'Add New Property'}
            </h1>
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Property'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="gallery">Gallery & SEO</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                  placeholder="e.g., Luxury Downtown Penthouse"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  required
                  rows={6}
                  placeholder="Detailed property description..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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
                      <SelectItem value="Current">Current</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Off-Market">Off-Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => updateField('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => updateField('isFeatured', checked)}
                />
                <Label htmlFor="featured">Featured Property</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                📍 Map will update automatically as you type the address
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.location.address}
                  onChange={(e) => updateField('location.address', e.target.value)}
                  required
                  placeholder="e.g., 123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) => updateField('location.city', e.target.value)}
                    required
                    placeholder="e.g., New York"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) => updateField('location.state', e.target.value)}
                    required
                    placeholder="e.g., NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.location.country}
                    onChange={(e) => updateField('location.country', e.target.value)}
                    required
                    placeholder="e.g., United States"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.location.zipCode}
                    onChange={(e) => updateField('location.zipCode', e.target.value)}
                    placeholder="e.g., 10001"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>Location on Map</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.location.address && formData.location.city ? (
                        `${formData.location.address}, ${formData.location.city}${formData.location.state ? ', ' + formData.location.state : ''}${formData.location.country ? ', ' + formData.location.country : ''}`
                      ) : (
                        'Enter address details above to see location on map'
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => geocodeAddress(false)}
                    disabled={!formData.location.address || !formData.location.city || geocoding}
                  >
                    {geocoding ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Update Map Now
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4">
                  {geocoding && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-green-dark">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating map location...
                    </div>
                  )}
                  <GoogleMap
                    lat={formData.location.coordinates.lat}
                    lng={formData.location.coordinates.lng}
                    draggable={true}
                    showHint={showMapHint}
                    address={`${formData.location.address}, ${formData.location.city}, ${formData.location.state}`}
                    onLocationChange={(lat: number, lng: number) => {
                      updateField('location.coordinates', { lat, lng })
                      setShowMapHint(false) // Hide hint after manual adjustment
                    }}
                    height="400px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.financials.price}
                    onChange={(e) => updateField('financials.price', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.financials.currency}
                    onValueChange={(value) => updateField('financials.currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerUnit">Price per Unit</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    value={formData.financials.pricePerUnit}
                    onChange={(e) => updateField('financials.pricePerUnit', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                  <Input
                    id="expectedROI"
                    type="number"
                    step="0.1"
                    value={formData.financials.expectedROI}
                    onChange={(e) => updateField('financials.expectedROI', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="noi">Net Operating Income</Label>
                  <Input
                    id="noi"
                    type="number"
                    value={formData.financials.netOperatingIncome}
                    onChange={(e) => updateField('financials.netOperatingIncome', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="capRate">Cap Rate (%)</Label>
                  <Input
                    id="capRate"
                    type="number"
                    step="0.1"
                    value={formData.financials.capRate}
                    onChange={(e) => updateField('financials.capRate', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="appreciation">Annual Appreciation (%)</Label>
                  <Input
                    id="appreciation"
                    type="number"
                    step="0.1"
                    value={formData.financials.annualAppreciation}
                    onChange={(e) => updateField('financials.annualAppreciation', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specs">
          <Card>
            <CardHeader>
              <CardTitle>Property Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalArea">Total Area *</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    value={formData.specifications.totalArea}
                    onChange={(e) => updateField('specifications.totalArea', parseFloat(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="areaUnit">Area Unit</Label>
                  <Select
                    value={formData.specifications.areaUnit}
                    onValueChange={(value) => updateField('specifications.areaUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">Square Feet</SelectItem>
                      <SelectItem value="sqm">Square Meters</SelectItem>
                      <SelectItem value="acres">Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.specifications.bedrooms}
                    onChange={(e) => updateField('specifications.bedrooms', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.specifications.bathrooms}
                    onChange={(e) => updateField('specifications.bathrooms', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="floors">Floors</Label>
                  <Input
                    id="floors"
                    type="number"
                    value={formData.specifications.floors}
                    onChange={(e) => updateField('specifications.floors', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yearBuilt">Year Built</Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.specifications.yearBuilt}
                    onChange={(e) => updateField('specifications.yearBuilt', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="parking">Parking Spaces</Label>
                  <Input
                    id="parking"
                    type="number"
                    value={formData.specifications.parkingSpaces}
                    onChange={(e) => updateField('specifications.parkingSpaces', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="lotSize">Lot Size</Label>
                  <Input
                    id="lotSize"
                    type="number"
                    value={formData.specifications.lotSize}
                    onChange={(e) => updateField('specifications.lotSize', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="interior">Interior Amenities (comma-separated)</Label>
                <Textarea
                  id="interior"
                  value={formData.amenities.interior.join(', ')}
                  onChange={(e) => updateField('amenities.interior', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., Hardwood Floors, Central AC, Smart Home System"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="exterior">Exterior Amenities (comma-separated)</Label>
                <Textarea
                  id="exterior"
                  value={formData.amenities.exterior.join(', ')}
                  onChange={(e) => updateField('amenities.exterior', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., Swimming Pool, Garden, Patio"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="building">Building Amenities (comma-separated)</Label>
                <Textarea
                  id="building"
                  value={formData.amenities.building.join(', ')}
                  onChange={(e) => updateField('amenities.building', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., Gym, Concierge, Security"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="nearby">Nearby Facilities (comma-separated)</Label>
                <Textarea
                  id="nearby"
                  value={formData.amenities.nearby.join(', ')}
                  onChange={(e) => updateField('amenities.nearby', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., Schools, Shopping Malls, Public Transport"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gallery & SEO Tab */}
        <TabsContent value="gallery">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Gallery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Featured Image</Label>
                  <ImageUpload
                    value={formData.gallery.featuredImage}
                    onChange={(url) => updateField('gallery.featuredImage', url)}
                    label="Upload Featured Image"
                  />
                </div>

                <div>
                  <Label>Property Images</Label>
                  <MultipleImageUpload
                    value={formData.gallery.images}
                    onChange={(urls) => updateField('gallery.images', urls)}
                    maxImages={20}
                    label="Upload Property Images"
                  />
                </div>

                <div>
                  <Label>Floor Plans</Label>
                  <MultipleImageUpload
                    value={formData.gallery.floorPlans}
                    onChange={(urls) => updateField('gallery.floorPlans', urls)}
                    maxImages={10}
                    label="Upload Floor Plans"
                  />
                </div>

                <div>
                  <Label htmlFor="virtualTour">Virtual Tour URL (Optional)</Label>
                  <Input
                    id="virtualTour"
                    value={formData.gallery.virtualTour}
                    onChange={(e) => updateField('gallery.virtualTour', e.target.value)}
                    placeholder="https://..."
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
                    placeholder="Leave blank to use property title"
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
                    placeholder="luxury property, downtown, investment"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
