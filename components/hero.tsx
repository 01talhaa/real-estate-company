"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, TrendingUp, Shield, Users } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [counters, setCounters] = useState({ aum: 0, properties: 0, roi: 0, clients: 0 })

  useEffect(() => {
    const animateCounter = (target: number, key: keyof typeof counters, duration: number = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = start

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 16)
    }

    animateCounter(250, 'aum')
    animateCounter(180, 'properties')
    animateCounter(18, 'roi')
    animateCounter(450, 'clients')
  }, [])

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-green-muted/40 to-green-muted/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24">
        {/* Main Hero Content */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 bg-[#064E3B] rounded-xl shadow-lg">
              <span className="text-white font-bold text-xl">SAML</span>
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-[#064E3B] font-semibold">Sabit Asset Management</p>
              <p className="text-xs text-black">International Real Estate Advisory</p>
            </div>
          </div>

          <h1 className="text-[#064E3B] text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black mb-6">
            <span className="block">Maximizing Real Estate</span>
            <span className="block bg-gradient-to-r from-green-dark to-green-dark bg-clip-text text-transparent">
              Investment Performance
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-black max-w-3xl mx-auto mb-8">
            Professional asset management services for commercial and residential real estate portfolios. 
            Strategic advisory, portfolio optimization, and data-driven investment decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full shadow-xl px-8">
              <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20asset%20management%20services" target="_blank" rel="noopener noreferrer">
                Schedule Consultation
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#services">
                Explore Services
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Card className="p-6 text-center border-[#D1FAE5] bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <Building2 className="h-8 w-8 mx-auto mb-3 text-[#064E3B]" />
            <div className="text-3xl font-bold text-black">${counters.aum}M+</div>
            <p className="text-sm text-black mt-1">Assets Under Management</p>
          </Card>

          <Card className="p-6 text-center border-[#D1FAE5] bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-[#064E3B]" />
            <div className="text-3xl font-bold text-black">{counters.properties}+</div>
            <p className="text-sm text-black mt-1">Properties Managed</p>
          </Card>

          <Card className="p-6 text-center border-[#D1FAE5] bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="h-8 w-8 mx-auto mb-3 text-[#064E3B]" />
            <div className="text-3xl font-bold text-black">{counters.roi}%</div>
            <p className="text-sm text-black mt-1">Average Annual ROI</p>
          </Card>

          <Card className="p-6 text-center border-[#D1FAE5] bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
            <Users className="h-8 w-8 mx-auto mb-3 text-[#064E3B]" />
            <div className="text-3xl font-bold text-black">{counters.clients}+</div>
            <p className="text-sm text-black mt-1">Satisfied Clients</p>
          </Card>
        </div>

        {/* Property Types Showcase */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {propertyTypes.map((type, i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl bg-white border-2 border-[#D1FAE5] p-6 hover:shadow-lg hover:border-[#064E3B] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D1FAE5]/50 to-[#D1FAE5]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-3xl mb-2">{type.icon}</div>
                <h3 className="text-[#064E3B] font-semibold text-[#064E3B] mb-1">{type.title}</h3>
                <p className="text-xs text-black">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const propertyTypes = [
  {
    icon: "🏢",
    title: "Commercial",
    desc: "Office buildings & retail spaces"
  },
  {
    icon: "🏘️",
    title: "Residential",
    desc: "Apartments & housing complexes"
  },
  {
    icon: "🏭",
    title: "Industrial",
    desc: "Warehouses & logistics facilities"
  },
  {
    icon: "🏨",
    title: "Hospitality",
    desc: "Hotels & serviced apartments"
  }
]

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  videoSrc,
}: {
  title?: string
  sub?: string
  tone?: string
  gradient?: string
  videoSrc?: string
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-white/90 p-2 shadow-lg shadow-green-muted/50">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-green-muted to-green-muted">
        <LazyVideo
          src={
            videoSrc ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label={`${title} - ${sub}`}
        />

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-green-light/40" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-white drop-shadow-lg">{title}</div>
            <p className="text-xs text-white/90 drop-shadow">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full /90 px-2 py-0.5 text-[10px] uppercase tracking-wider ">
              {tone === "calm" ? "pqrix app" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Conversions",
    sub: "Turn clicks into paying customers.",
    tone: "results",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
  },
  {
    title: "Speed",
    sub: "Launch in days, not weeks.",
    tone: "speed",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
  },
  {
    title: "Social-Ready",
    sub: "Made for IG, TikTok, and Meta.",
    tone: "social",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
  },
  {
    title: "Standout",
    sub: "Be the product no one scrolls past.",
    tone: "standout",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  },
  {
    title: "Premium",
    sub: "Look like the market leader.",
    tone: "premium",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
  },
]
