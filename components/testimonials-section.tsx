"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const testimonials = [
  {
    name: { en: "Md. Rafiqul Islam", bn: "মোঃ রফিকুল ইসলাম" },
    location: { en: "Khilgaon, Dhaka", bn: "খিলগাঁও, ঢাকা" },
    quote: {
      en: "I never imagined I could own a flat in Dhaka on my salary. Sabit made it possible with their easy share system. The process was transparent and the team was always available.",
      bn: "আমার বেতনে ঢাকায় ফ্ল্যাটের মালিক হওয়ার স্বপ্নও দেখিনি। সাবিতের শেয়ার পদ্ধতিতে সেটা সম্ভব হয়েছে। সম্পূর্ণ প্রক্রিয়া স্বচ্ছ ছিল এবং দল সবসময় পাশে ছিল।",
    },
    rating: 5,
    initials: "RI",
  },
  {
    name: { en: "Fatema Begum", bn: "ফাতেমা বেগম" },
    location: { en: "Jodhivita, Dhaka", bn: "জোড়াভিটা, ঢাকা" },
    quote: {
      en: "After years of paying rent, my family finally has a home we can call our own. Sabit's team guided us every step of the way. Truly a blessing.",
      bn: "বছরের পর বছর ভাড়া দেওয়ার পর অবশেষে আমাদের নিজের বাড়ি হয়েছে। সাবিতের দল প্রতিটি পদক্ষেপে আমাদের সাহায্য করেছে। সত্যিই একটি আশীর্বাদ।",
    },
    rating: 5,
    initials: "FB",
  },
  {
    name: { en: "Md. Kamal Hossain", bn: "মোঃ কামাল হোসেন" },
    location: { en: "Khilgaon, Dhaka", bn: "খিলগাঁও, ঢাকা" },
    quote: {
      en: "The legal documentation was handled professionally and I received my flat on time. I recommend Sabit to every middle-income family in Dhaka.",
      bn: "আইনি কাগজপত্র সম্পূর্ণ পেশাদারভাবে পরিচালনা করা হয়েছিল এবং আমি সময়মতো ফ্ল্যাট পেয়েছি। ঢাকার প্রতিটি মধ্যবিত্ত পরিবারকে সাবিতের কথা বলি।",
    },
    rating: 5,
    initials: "KH",
  },
]

export function TestimonialsSection() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [isAutoPlaying, next])

  const current = testimonials[active]

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#064E3B]/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-[#064E3B] mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              {t({ en: "Testimonials", bn: "প্রশংসাপত্র" })}
            </p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#064E3B] mb-4">
            {t({ en: "What Our Clients Say", bn: "আমাদের ক্লায়েন্টরা কী বলেন" })}
          </h2>
          <p className="text-lg text-[#064E3B] font-light">
            {t({
              en: "Real words from real homeowners who trusted Sabit.",
              bn: "সাবিতকে বিশ্বাস করে বাড়ির মালিক হওয়া মানুষদের কথা।",
            })}
          </p>
        </div>

        {/* Card */}
        <div
          className="relative bg-[#064E3B] backdrop-blur-xl border border-white/15 rounded-[2rem] p-8 md:p-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <Quote className="absolute top-8 left-8 w-10 h-10 text-[#10B981]/30" />

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10B981] to-[#064E3B] flex items-center justify-center text-white text-2xl font-black mb-6 shadow-lg shadow-[#10B981]/20">
              {current.initials}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#10B981] text-[#10B981]" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-8">
              "{t(current.quote)}"
            </blockquote>

            {/* Author */}
            <div>
              <p className="text-white font-bold text-lg">{t(current.name)}</p>
              <p className="text-white/50 text-sm mt-1">{t(current.location)}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); setIsAutoPlaying(false) }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`transition-all rounded-full ${i === active
                    ? "w-6 h-2.5 bg-[#10B981]"
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next"
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
