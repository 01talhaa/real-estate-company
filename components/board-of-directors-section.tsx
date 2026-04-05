"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Linkedin, Mail, Twitter } from "lucide-react"
import Link from "next/link"

const directors = [
  {
    name: "Eleanor Sterling",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    bio: "Over 20 years reshaping institutional real estate portfolios.",
    social: { linkedin: "#", mail: "#" }
  },
  {
    name: "Marcus Chen",
    role: "Head of Global Acquisitions",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    bio: "Specialist in identifying high-yield prime market opportunities.",
    social: { linkedin: "#", mail: "#", twitter: "#" }
  },
  {
    name: "Dr. Sarah Al-Fayed",
    role: "Chief Risk Officer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    bio: "Pioneering predictive modeling for volatile property markets.",
    social: { linkedin: "#", mail: "#" }
  },
  {
    name: "Julian Vance",
    role: "Director of Asset Optimization",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    bio: "Maximizing NOI through sustainable asset improvements.",
    social: { linkedin: "#", twitter: "#" }
  }
]

export function BoardOfDirectorsSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">Leadership</p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Board of Directors
          </h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Guided by industry veterans leveraging decades of cycle-tested expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {directors.map((director, index) => (
            <Card key={index} className="group border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] mb-6">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {/* Glass overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex items-center gap-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {director.social.linkedin && (
                        <Link href={director.social.linkedin} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white text-white hover:text-[#064E3B] transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </Link>
                      )}
                      {director.social.mail && (
                        <Link href={director.social.mail} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white text-white hover:text-[#064E3B] transition-colors">
                          <Mail className="w-5 h-5" />
                        </Link>
                      )}
                      {director.social.twitter && (
                        <Link href={director.social.twitter} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white text-white hover:text-[#064E3B] transition-colors">
                          <Twitter className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#064E3B] transition-colors">
                    {director.name}
                  </h3>
                  <p className="text-[#064E3B] font-semibold text-sm tracking-wide mt-2 mb-3">
                    {director.role}
                  </p>
                  <p className="text-gray-500 font-light text-sm px-4">
                    {director.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
