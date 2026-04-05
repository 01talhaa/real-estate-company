"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline: "Strategic real estate asset management services focused on maximizing property value and investment returns. Your trusted partner in property portfolio management.",
  copyright: "© 2025 — Sabit Asset Management LTD",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="bg-[#03291E] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#064E3B]/40 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Contact CTA */}
      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-[#064E3B]/50 backdrop-blur-xl border border-white/10 p-12 lg:p-16 rounded-[2.5rem] shadow-2xl">
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to elevate your <span className="text-green-light">asset portfolio?</span>
            </h3>
            <p className="text-lg text-white/70 max-w-xl">
              Connect with our advisory team to discuss bespoke management strategies and exclusive investment opportunities.
            </p>
          </div>
          <div className="lg:text-right">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 h-14 bg-green-light hover:bg-white text-[#064E3B] font-bold shadow-lg shadow-green-light/20 transition-all text-base"
            >
              <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">
                Schedule a Private Consultation
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-8 mt-12 bg-transparent relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-light to-[#064E3B] rounded-xl shadow-lg border border-white/20">
                  <span className="text-white font-black text-lg tracking-wider">SAML</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-white">Sabit Asset</span>
                  <span className="text-green-light"> Management</span>
                </span>
              </div>
              <p className="max-w-md text-base text-white/60 leading-relaxed">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">Services</h5>
              <ul className="space-y-4 text-white/60">
                {["Property Management", "Strategic Advisory", "Property Valuation", "Investment Analysis"].map((item) => (
                  <li key={item}>
                    <Link href={`#`} className="hover:text-green-light transition-colors font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">Company</h5>
              <ul className="space-y-4 text-white/60">
                {["About Team", "Careers", "Latest News", "Global Offices"].map((item) => (
                  <li key={item}>
                    <Link href={`#`} className="hover:text-green-light transition-colors font-medium">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">Connect</h5>
              <ul className="space-y-4 text-white/60">
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium">
                    <Twitter className="h-5 w-5" /> X/Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium">
                    <Youtube className="h-5 w-5" /> YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium">
                    <Instagram className="h-5 w-5" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
            <p className="font-medium tracking-wide">{content.copyright}</p>
            <div className="flex items-center gap-8 font-medium">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/t&c" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
