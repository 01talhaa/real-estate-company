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
    <section className="text-black bg-gradient-to-b from-white via-sky-50 to-white">
      {/* Contact CTA */}
      <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-sky-500 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-sky-400/30 hover:bg-sky-600"
          >
            <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">
              Contact us
            </a>
          </Button>
        </div>
      </div>

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10 shadow-lg shadow-sky-200/40">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-sky-600">STREAMLINE YOUR PORTFOLIO</p>
              <h3 className="text-2xl font-bold leading-tight text-black sm:text-3xl">
                Manage &amp; monitor your assets from anywhere
              </h3>
              <p className="mt-2 max-w-prose text-sm text-gray-700">
                Track property performance, review financials, and manage your real estate portfolio from anywhere. Using our comprehensive asset management platform
              </p>
            </div>

            {/* Right mockup */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl shadow-sky-400/30">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200">
                  {/* Lazy-loaded video fills the screen */}
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    autoplay={true}
                    loop={true}
                    muted={true}
                    playsInline={true}
                    aria-label="Sabit Asset Management app preview - property management made easy"
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-sky-300/40" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-sky-500 drop-shadow-lg">Collaboration Made Easy</div>
                      <p className="text-xs text-white drop-shadow">From concept to delivery in a single flow</p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-sky-500/90 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                        Zero Hassle
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-sky-200 pb-20 md:pb-10 bg-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-md">
                  <span className="text-white font-bold text-sm">SAML</span>
                </div>
                <span className="text-lg font-semibold">
                  <span className="text-sky-600">Sabit Asset</span>
                  <span className="text-gray-800"> Management</span>
                </span>
              </div>
              <p className="max-w-sm text-sm text-gray-600">{content.tagline}</p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600">Navigation</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  {["Home", "Features", "Testimonials", "Pricing", "Blog", "Download"].map((item) => (
                    <li key={item}>
                      <Link href={`#${item.toLowerCase()}`} className="hover:text-sky-500 transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600">Social media</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://twitter.com/sabitasset"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow Sabit Asset Management on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://www.youtube.com/@sabitasset"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Subscribe to Sabit Asset Management on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://instagram.com/sabitasset"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow Sabit Asset Management on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-sky-500" />
                    <a
                      href="https://threads.com/sabitasset"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-sky-500 transition-colors"
                      aria-label="Follow Sabit Asset Management on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/revisions" className="hover:text-lime-300">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-lime-300">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
