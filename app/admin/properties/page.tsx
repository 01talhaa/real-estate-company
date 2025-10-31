'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Building2, MapPin } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Property {
  _id: string
  title: string
  slug: string
  status: string
  type: string
  category: string
  location: {
    address: string
    city: string
    state: string
    country: string
  }
  financials: {
    price: number
    currency: string
  }
  specifications: {
    totalArea: number
    areaUnit: string
  }
  isFeatured: boolean
  isActive: boolean
  views: number
  createdAt: string
}

export default function PropertiesAdminPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    category: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (pagination.page && pagination.limit) {
      fetchProperties()
    }
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
      params.append('limit', String(pagination.limit || 10))

      const response = await fetch(`/api/properties?${params}`)
      const data = await response.json()

      if (data.success) {
        setProperties(data.data)
        setPagination(data.pagination)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch properties',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch properties',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Property deleted successfully'
        })
        fetchProperties()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete property',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Current': 'bg-green-500',
      'Upcoming': 'bg-green-light',
      'Completed': 'bg-white0',
      'Under Construction': 'bg-yellow-500',
      'Off-Market': 'bg-red-500'
    }
    return colors[status] || 'bg-white0'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#064E3B] text-3xl font-bold">Properties Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your real estate properties and listings
          </p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search properties..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            
            <Select
              value={filters.status || undefined}
              onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Current">Current</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Under Construction">Under Construction</SelectItem>
                <SelectItem value="Off-Market">Off-Market</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.type || undefined}
              onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
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
                <SelectValue placeholder="All Categories" />
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
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first property
              </p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Property
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{property.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {property.slug}
                        </span>
                        {property.isFeatured && (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">
                          {property.location.city}, {property.location.country}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {property.financials.currency}{' '}
                      {property.financials.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {property.specifications.totalArea}{' '}
                      {property.specifications.areaUnit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{property.views}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/properties/edit/${property._id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(property._id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
