import Link from 'next/link'
import Image from 'next/image'
import { Building2, MapPin, Bed, Bath, Square, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from "@/lib/utils"

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
    <section className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-[#f8fcfb] -z-10" />
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex flex-col gap-4 mb-6">
              <span className="w-16 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">Portfolio Excellence</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 leading-[1.05]">
              Featured <span className="text-[#064E3B]">Case Studies</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              An exclusive look into our premium commercial and residential asset management success stories. Uncover how we extract maximum value.
            </p>
          </div>
          <div className="pb-2">
            <Button asChild size="lg" className="rounded-none px-8 h-12 bg-transparent text-[#064E3B] border border-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-all text-sm font-bold tracking-widest uppercase group">
              <Link href="/properties">
                Explore All Assets <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Case Studies Container */}
        <div className="flex flex-col gap-32">
          {properties.map((property: any, index: number) => {
            const isEven = index % 2 !== 0;

            return (
              <div key={property._id} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${isEven ? 'lg:flex-row-reverse' : ''} group`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shadow-[0_20px_50px_-15px_rgba(6,78,59,0.2)] lg:group-hover:-translate-y-2 transition-transform duration-700">
                    {property.gallery?.featuredImage ? (
                      <Image
                        src={property.gallery.featuredImage}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-6 left-6 flex gap-2">
                      <div className="bg-white/95 backdrop-blur-md text-[#064E3B] px-4 py-2 text-xs font-black tracking-widest uppercase shadow-lg">
                        {property.status}
                      </div>
                    </div>
                  </div>
                  {/* Decorative Background Block */}
                  <div className={`absolute top-8 ${isEven ? '-right-8' : '-left-8'} w-full h-full border border-[#064E3B]/10 -z-10 bg-[#064E3B]/[0.02] transition-transform duration-700 group-hover:translate-x-0 ${isEven ? 'translate-x-4' : '-translate-x-4'}`} />
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[#064E3B] font-black tracking-widest text-xs uppercase bg-[#064E3B]/5 px-3 py-1 border border-[#064E3B]/10">
                      {property.category}
                    </span>
                    <span className="w-8 h-[1px] bg-gray-300" />
                    <span className="text-gray-500 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> 
                      {property.location?.city}, {property.location?.country}
                    </span>
                  </div>

                  <h3 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1] group-hover:text-[#064E3B] transition-colors">
                    <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                  </h3>

                  <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                    An exceptional {property.type?.toLowerCase() || 'asset'} strategically positioned to deliver superior yields. Fully vetted by our investment committee and currently undergoing active yield optimization.
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="border-l-2 border-gray-200 pl-5">
                      <div className="text-2xl lg:text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        {property.financials?.currency || '$'}{(property.financials?.price || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset Value</div>
                    </div>
                    {property.financials?.expectedROI > 0 && (
                      <div className="border-l-2 border-[#064E3B] pl-5">
                        <div className="text-2xl lg:text-3xl font-black text-[#064E3B] mb-1 tracking-tight flex items-center gap-2">
                          {property.financials.expectedROI}% <TrendingUp className="w-5 h-5 text-green-light" />
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target ROI</div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 text-sm text-gray-900 font-medium">
                    {property.specifications?.totalArea > 0 && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Square className="h-4 w-4 text-[#064E3B]" />
                        </div>
                        <span className="font-bold">{property.specifications.totalArea} <span className="text-gray-500 font-semibold">{property.specifications.areaUnit}</span></span>
                      </div>
                    )}
                    {property.specifications?.bedrooms > 0 && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Bed className="h-4 w-4 text-[#064E3B]" />
                        </div>
                        <span className="font-bold">{property.specifications.bedrooms} <span className="text-gray-500 font-semibold">Beds</span></span>
                      </div>
                    )}
                    {property.specifications?.bathrooms > 0 && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Bath className="h-4 w-4 text-[#064E3B]" />
                        </div>
                        <span className="font-bold">{property.specifications.bathrooms} <span className="text-gray-500 font-semibold">Baths</span></span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Button asChild className="rounded-none px-8 py-6 bg-gray-900 hover:bg-[#064E3B] text-white font-bold tracking-widest uppercase text-xs transition-all shadow-xl hover:shadow-[0_10px_30px_-15px_rgba(6,78,59,0.5)]">
                      <Link href={`/properties/${property.slug}`}>
                        Read Case Study
                      </Link>
                    </Button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
