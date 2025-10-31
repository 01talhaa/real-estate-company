'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft, FileText, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react'

export default function InsightDetailPage() {
  const params = useParams()
  const [insight, setInsight] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchInsight()
    }
  }, [params.slug])

  const fetchInsight = async () => {
    try {
      const response = await fetch(`/api/insights/${params.slug}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setInsight(data.data)
      }
    } catch (error) {
      console.error('Error fetching insight:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

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

  if (!insight) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-[#064E3B] text-2xl font-bold mb-2">Article Not Found</h2>
            <Link href="/insights">
              <Button>Back to Insights</Button>
            </Link>
          </div>
        </div>
        <AppverseFooter />
      </>
    )
  }

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
              <Link href="/insights" className="hover:text-green-dark">Insights</Link>
              <span>/</span>
              <span className="text-black">{insight.title}</span>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{insight.category}</Badge>
                {insight.featured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
              </div>
              
              <h1 className="text-[#064E3B] text-4xl md:text-5xl font-bold mb-6">
                {insight.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-black mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{typeof insight.author === 'string' ? insight.author : insight.author?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(insight.publishDate || insight.publishedAt || insight.createdAt)}</span>
                </div>
              </div>

              <p className="text-xl text-black leading-relaxed">
                {insight.excerpt}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {insight.featuredImage && (
          <section className="bg-white">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl mx-auto">
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <Image
                    src={insight.featuredImage}
                    alt={insight.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-8">
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-line text-black leading-relaxed">
                        {insight.content}
                      </div>
                    </div>

                    {/* Tags */}
                    {insight.tags && insight.tags.length > 0 && (
                      <div className="mt-8 pt-8 border-t">
                        <h3 className="text-[#064E3B] font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {insight.tags.map((tag: string, i: number) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Share */}
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-[#064E3B] font-semibold mb-3">Share this article</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${insight.title}`, '_blank')}
                        >
                          <Twitter className="h-4 w-4 mr-2" />
                          Twitter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${insight.title}`, '_blank')}
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back Button */}
                <div className="mt-8">
                  <Link href="/insights">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Insights
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Author Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-[#064E3B] font-bold mb-3">About the Author</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-light to-green-light flex items-center justify-center text-white font-bold text-lg">
                        {(typeof insight.author === 'string' ? insight.author : insight.author?.name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{typeof insight.author === 'string' ? insight.author : insight.author?.name || 'Anonymous'}</div>
                        <div className="text-sm text-black">Author</div>
                      </div>
                    </div>
                    <p className="text-sm text-black">
                      Expert in real estate investment and market analysis
                    </p>
                  </CardContent>
                </Card>

                {/* SEO Info */}
                {insight.seo?.metaDescription && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-[#064E3B] font-bold mb-3">Quick Summary</h3>
                      <p className="text-sm text-black">
                        {insight.seo.metaDescription}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* CTA */}
                <Card className="bg-gradient-to-br from-green-muted to-green-muted">
                  <CardContent className="p-6">
                    <h3 className="text-[#064E3B] font-bold mb-3">Interested in investing?</h3>
                    <p className="text-sm text-black mb-4">
                      Browse our current property listings or get in touch with our team.
                    </p>
                    <div className="space-y-2">
                      <Link href="/properties">
                        <Button className="w-full">
                          View Properties
                        </Button>
                      </Link>
                      <Link href="/checkout">
                        <Button variant="outline" className="w-full">
                          Contact Us
                        </Button>
                      </Link>
                    </div>
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
