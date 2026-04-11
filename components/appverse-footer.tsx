"use client"

import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, Twitter, Youtube, Phone, Mail } from "lucide-react"

export function AppverseFooter() {
  const { t } = useLanguage()

  const tagline = t({
    en: "Making homeownership possible for every Bangladeshi family.",
    bn: "প্রতিটি বাংলাদেশি পরিবারের জন্য বাড়ির মালিকানা সম্ভব করছি।",
  })

  const quickLinks = [
    { href: "/#our-story", en: "Our Story", bn: "আমাদের কথা" },
    { href: "/projects", en: "Our Projects", bn: "আমাদের প্রকল্পসমূহ" },
    { href: "/events", en: "Events", bn: "ইভেন্ট" },
    { href: "/team", en: "Our Team", bn: "আমাদের দল" },
    { href: "/properties", en: "Properties", bn: "সম্পত্তি" },
    { href: "/insights", en: "Insights", bn: "ইনসাইটস" },
  ]

  const services = [
    { en: "Share-Based Flat Acquisition", bn: "শেয়ার-ভিত্তিক ফ্ল্যাট অর্জন" },
    { en: "Property Management", bn: "সম্পত্তি ব্যবস্থাপনা" },
    { en: "Legal Documentation", bn: "আইনি কাগজপত্র" },
    { en: "Investment Advisory", bn: "বিনিয়োগ পরামর্শ" },
  ]

  return (
    <section className="bg-[#03291E] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#064E3B]/40 blur-[120px] rounded-full pointer-events-none" />

      {/* Contact CTA */}
      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-[#064E3B]/50 backdrop-blur-xl border border-white/10 p-12 lg:p-16 rounded-[2.5rem] shadow-2xl">
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight">
              {t({
                en: <>Ready to own your <span className="text-green-light">dream flat?</span></>,
                bn: <>আপনার <span className="text-green-light">স্বপ্নের ফ্ল্যাটের</span> মালিক হতে চান?</>,
              })}
            </h3>
            <p className="text-lg text-white/70 max-w-xl">
              {t({
                en: "Connect with us today to learn about our share-based flat acquisition model and available units.",
                bn: "আমাদের শেয়ার-ভিত্তিক ফ্ল্যাট অর্জন পদ্ধতি এবং পাওয়া যাচ্ছে এমন ইউনিট সম্পর্কে জানতে আজই যোগাযোগ করুন।",
              })}
            </p>
          </div>
          <div className="lg:text-right">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 h-14 bg-green-light hover:bg-white hover:text-[#064E3B] font-bold shadow-lg shadow-green-light/20 transition-all text-white"
            >
              <a
                href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20Sabit%20Property%20flats"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t({ en: "Talk to Us on WhatsApp", bn: "WhatsApp-এ কথা বলুন" })}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 pb-8 mt-12 bg-transparent relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-light to-[#064E3B] rounded-xl shadow-lg border border-white/20">
                  <span className="text-white font-black text-lg tracking-wider">SPML</span>
                </div>
                <div>
                  <span className="text-white font-bold block leading-tight">সাবিত প্রপার্টি</span>
                  <span className="text-green-light text-sm font-medium">ম্যানেজমেন্ট লিঃ</span>
                </div>
              </div>
              <p className="max-w-xs text-sm text-white/60 leading-relaxed">{tagline}</p>
              {/* Contact info */}
              <div className="space-y-2 text-sm text-white/60">
                <a href="https://wa.me/8801401658685" className="flex items-center gap-2 hover:text-green-light transition-colors">
                  <Phone className="w-4 h-4" /> +880 1401-658685
                </a>
                <a href="mailto:info@sabitproperty.com" className="flex items-center gap-2 hover:text-green-light transition-colors">
                  <Mail className="w-4 h-4" /> info@sabitproperty.com
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">
                {t({ en: "Quick Links", bn: "দ্রুত লিঙ্ক" })}
              </h5>
              <ul className="space-y-4 text-white/60">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-green-light transition-colors font-medium text-sm"
                    >
                      {t({ en: link.en, bn: link.bn })}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">
                {t({ en: "Services", bn: "সেবাসমূহ" })}
              </h5>
              <ul className="space-y-4 text-white/60">
                {services.map((s) => (
                  <li key={s.en} className="text-sm font-medium">
                    {t(s)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h5 className="mb-6 text-sm font-bold tracking-widest text-white/90 uppercase">
                {t({ en: "Connect", bn: "যোগাযোগ" })}
              </h5>
              <ul className="space-y-4 text-white/60">
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium text-sm">
                    <Twitter className="h-4 w-4" /> X/Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium text-sm">
                    <Youtube className="h-4 w-4" /> YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 hover:text-green-light transition-colors font-medium text-sm">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </li>
              </ul>

              {/* Locations */}
              <div className="mt-8">
                <h6 className="mb-3 text-xs font-bold tracking-widest text-white/50 uppercase">
                  {t({ en: "Locations", bn: "অবস্থান" })}
                </h6>
                <p className="text-xs text-white/50 leading-relaxed">
                  {t({
                    en: "Khilgaon & Jodhivita, Dhaka, Bangladesh",
                    bn: "খিলগাঁও ও জোড়াভিটা, ঢাকা, বাংলাদেশ",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
            <p className="font-medium tracking-wide">
              © 2025 — {t({ en: "Sabit Property Management Ltd.", bn: "সাবিত প্রপার্টি ম্যানেজমেন্ট লিঃ" })}
            </p>
            <div className="flex items-center gap-8 font-medium">
              <Link href="/t&c" className="hover:text-white transition-colors">
                {t({ en: "Terms of Service", bn: "সেবার শর্তাবলী" })}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
