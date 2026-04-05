"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, TrendingUp, ShieldCheck, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "Precision Asset Management for Maximum Yield",
  subtitle: "Strategic approaches to real estate acquisition, portfolio optimization, and long-term risk mitigation.",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section id="features" className="container mx-auto px-4 py-20 sm:py-28 bg-gradient-to-b from-white via-green-muted/20 to-white">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-[#064E3B] mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          {content.title}
        </h2>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
          {content.subtitle}
        </p>
      </div>

      <div className="grid gap-8 lg:gap-12 md:grid-cols-2 max-w-7xl mx-auto">
        {/* Strategic Acquisitions Card */}
        <Card className="liquid-glass border border-[#064E3B]/10 bg-white/70 backdrop-blur-2xl shadow-xl shadow-[#064E3B]/5 hover:shadow-[#064E3B]/10 transition-shadow duration-500 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#064E3B]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#064E3B]" />
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">Strategic Acquisition</p>
            </div>
            <CardTitle className="text-2xl text-gray-900 leading-tight">Data-Driven Market Identification</CardTitle>
            <p className="text-gray-600 font-light mt-4 text-base">We identify undervalued assets and prime geographic locations utilizing proprietary analytics and deep local market expertise.</p>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-100 shadow-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
                  alt="Modern commercial real estate skyscraper"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(min-width: 768px) 240px, 45vw"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-100 shadow-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Modern office interior architecture"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(min-width: 768px) 240px, 45vw"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Management Card */}
        <Card className="liquid-glass border border-[#064E3B]/10 bg-[#064E3B]/[0.02] backdrop-blur-2xl shadow-xl shadow-[#064E3B]/5 hover:shadow-[#064E3B]/10 transition-shadow duration-500 rounded-[2rem] overflow-hidden flex flex-col justify-between">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#064E3B] flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">Portfolio Optimization</p>
            </div>
            <CardTitle className="text-2xl text-gray-900 leading-tight">
              &quot;Their rigorous asset management significantly outpaced our benchmark yield targets.&quot;
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="mb-8 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-5xl font-extrabold text-[#064E3B] tracking-tight">4.92</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Average Yield</span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#064E3B] text-[#064E3B]" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">Investor Satisfaction</span>
              </div>
            </div>
            <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-semibold tracking-wide">Institutional Grade Protection</span>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"
                alt="Luxury residential asset exterior"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(min-width: 768px) 400px, 90vw"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
