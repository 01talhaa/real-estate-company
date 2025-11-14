import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Images, MapPin } from 'lucide-react'

async function getGalleries() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/galleries?limit=6&featured=true`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Failed to fetch galleries:', response.status, response.statusText)
      return []
    }
    
    const data = await response.json()
    console.log('Galleries data from homepage:', data)
    console.log('Number of galleries found:', data.data?.length || 0)
    if (data.data && data.data.length > 0) {
      console.log('First gallery sample:', data.data[0])
    }
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return []
  }
}

export async function GalleriesSection() {
  const galleries = await getGalleries()

  if (!galleries || galleries.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-4">
            <Images className="h-4 w-4" />
            Visual Portfolio
          </div>
          <h2 className="text-[#064E3B] text-4xl md:text-5xl font-bold mb-4">
            Photo Galleries
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Explore our collection of stunning property images and project showcases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery: any) => (
            <Link key={gallery._id} href="/galleries">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                {/* Display First Image */}
                <div className="relative h-64 overflow-hidden">
                  {gallery.images && gallery.images.length > 0 && gallery.images[0].url ? (
                    <img
                      src={gallery.images[0].url}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-light to-green-light flex items-center justify-center">
                      <Images className="h-16 w-16 text-white" />
                    </div>
                  )}
                  
                  {/* Image Count Badge */}
                  {gallery.images && gallery.images.length > 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/70 text-white">
                        <Images className="h-3 w-3 mr-1" />
                        {gallery.images.length} Photos
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
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

                  {/* Location */}
                  {gallery.location && (
                    <div className="flex items-center gap-2 text-sm text-black">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{gallery.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {galleries.length >= 6 && (
          <div className="text-center mt-12">
            <Link href="/galleries">
              <Button size="lg" className="bg-gradient-to-r from-green-dark to-green-dark hover:from-green-dark hover:to-green-dark">
                View All Galleries
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
