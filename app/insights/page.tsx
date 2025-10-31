'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, User, Search, FileText } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInsights()
  }, [currentPage, category, searchQuery])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '9',
        status: 'published',
      })

      if (category !== 'all') {
        params.append('category', category)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/insights?${params}`)
      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setSearchQuery(search)
    setCurrentPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                Insights & Articles
              </h1>
              <p className="text-xl text-green-muted">
                Explore our latest insights on real estate investment, market trends, and property management
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={category} onValueChange={(value) => {
                setCategory(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                  <SelectItem value="Investment Tips">Investment Tips</SelectItem>
                  <SelectItem value="Property Management">Property Management</SelectItem>
                  <SelectItem value="Legal & Compliance">Legal & Compliance</SelectItem>
                  <SelectItem value="Financing">Financing</SelectItem>
                  <SelectItem value="Trends">Trends</SelectItem>
                  <SelectItem value="Case Studies">Case Studies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </section>

        {/* Insights Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-dark"></div>
              </div>
            ) : insights.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-[#064E3B] text-2xl font-bold mb-2">No Insights Found</h3>
                <p className="text-black mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={() => {
                  setSearch('')
                  setSearchQuery('')
                  setCategory('all')
                  setCurrentPage(1)
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {insights.map((insight) => (
                    <Link
                      key={insight._id}
                      href={`/insights/${insight.slug}`}
                    >
                      <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden group">
                        {/* Featured Image */}
                        <div className="relative h-48 overflow-hidden">
                          {insight.featuredImage ? (
                            <Image
                              src={insight.featuredImage}
                              alt={insight.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-light to-green-light flex items-center justify-center">
                              <FileText className="h-16 w-16 text-white" />
                            </div>
                          )}
                        </div>

                        <CardHeader>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary">{insight.category}</Badge>
                            {insight.featured && (
                              <Badge className="bg-yellow-500">Featured</Badge>
                            )}
                          </div>
                          <h3 className="text-[#064E3B] text-xl font-bold line-clamp-2 group-hover:text-green-dark transition-colors">
                            {insight.title}
                          </h3>
                        </CardHeader>

                        <CardContent>
                          <p className="text-black line-clamp-3">
                            {insight.excerpt}
                          </p>
                        </CardContent>

                        <CardFooter className="flex items-center justify-between text-sm text-black border-t pt-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{typeof insight.author === 'string' ? insight.author : insight.author?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(insight.publishDate || insight.publishedAt || insight.createdAt)}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
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
