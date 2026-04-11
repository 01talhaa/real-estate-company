"use client"

import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, Play } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"
import { useLanguage } from "@/contexts/language-context"

// ── Headline word pairs that cycle via typewriter ─────────────────────────────
const headlineWords = [
  // { en: "Homeownership", bn: "বাড়ির মালিকানা" },
  // { en: "Your Dream Flat", bn: "আপনার স্বপ্নের ফ্ল্যাট" },
  // { en: "A Better Future", bn: "একটি উজ্জ্বল ভবিষ্যৎ" },
  { en: "Sabit Property Management Ltd", bn: "সাবিত প্রপার্টি ম্যানেজমেন্ট লিঃ" },
]

// How long to pause on a fully typed word before erasing
const HOLD_MS = 1800
// Typing speed (ms per character)
const TYPE_SPEED = 60
// Erasing speed (ms per character)
const ERASE_SPEED = 30

export function Hero() {
  const { t, lang } = useLanguage()
  const [counters, setCounters] = useState({ projects: 0, families: 0, years: 0, locations: 0 })

  // Typewriter state
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Counter animation
  useEffect(() => {
    const animateCounter = (target: number, key: keyof typeof counters, duration = 1800) => {
      const increment = target / (duration / 16)
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) { current = target; clearInterval(timer) }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 16)
    }
    animateCounter(4, "projects")
    animateCounter(20, "families")
    animateCounter(10, "years")
    animateCounter(2, "locations")
  }, [])

  // Reset typewriter when language changes so it re-types in the new language
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDisplayed("")
    setPhase("typing")
    // small delay so the word resets cleanly
    timeoutRef.current = setTimeout(() => { }, 10)
  }, [lang])

  // Typewriter loop
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    const fullWord = lang === "en" ? headlineWords[wordIdx].en : headlineWords[wordIdx].bn

    if (phase === "typing") {
      if (displayed.length < fullWord.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(fullWord.slice(0, displayed.length + 1))
        }, TYPE_SPEED)
      } else {
        // Fully typed → hold
        setPhase("holding")
      }
    }

    if (phase === "holding") {
      timeoutRef.current = setTimeout(() => {
        setPhase("erasing")
      }, HOLD_MS)
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(displayed.slice(0, displayed.length - 1))
        }, ERASE_SPEED)
      } else {
        // Move to next word
        setWordIdx(i => (i + 1) % headlineWords.length)
        setPhase("typing")
      }
    }

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [displayed, phase, wordIdx, lang])

  // Widest word in the current language — used to reserve space so layout never shifts
  const longestWord = headlineWords.reduce((acc, w) => {
    const word = lang === "en" ? w.en : w.bn
    return word.length > acc.length ? word : acc
  }, "")

  const stats = [
    { num: counters.projects, suffix: "+", en: "Projects Delivered", bn: "সম্পন্ন প্রকল্প" },
    { num: counters.families, suffix: "+", en: "Families Housed", bn: "পরিবার গৃহায়ন" },
    { num: counters.years, suffix: "+", en: "Years Experience", bn: "বছরের অভিজ্ঞতা" },
    { num: counters.locations, suffix: "", en: "Prime Locations", bn: "প্রাইম লোকেশন" },
  ]

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col lg:flex-row overflow-hidden bg-[#FAFAFA]">

      {/* Decorative grid lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[30%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[70%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[90%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 right-0 w-[45%] h-full bg-[#064E3B] transform -skew-x-[12deg] origin-bottom translate-x-32 shadow-2xl z-0" />
      </div>

      {/* ── LEFT: Content ── */}
      <div className="lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:pl-24 lg:pr-12 pt-28 pb-16 z-10 relative">
        <div className="animate-in slide-in-from-left-12 fade-in duration-1000 fill-mode-both">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-12 h-[2px] bg-[#064E3B]" />
            <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
              {t({ en: "Since 2014", bn: "২০১৪ থেকে" })}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
            {/* Static first line */}
            {/* <span className="block text-gray-900 mb-1">
              {t({ en: "We Make", bn: "আমরা করি" })}
            </span> */}

            {/*
              Typewriter line — fixed height to never cause layout shift.
              We use an invisible ghost span (the longest word) to always
              reserve the correct width, and position the visible typed text
              on top of it via absolute positioning within a relative wrapper.
            */}
            <span className="block text-[#064E3B] relative" style={{ minHeight: "1em" }}>
              {/* Ghost span — invisible, reserves width of longest word */}
              <span
                aria-hidden
                className="invisible select-none"
                style={{ whiteSpace: "nowrap" }}
              >
                {longestWord}
              </span>

              {/* Visible typed text — absolute so it overlays the ghost */}
              <span
                className="absolute left-0 top-0 whitespace-nowrap"
                aria-live="polite"
              >
                {displayed}
                {/* Blinking cursor */}
                <span
                  className="inline-block w-[3px] h-[0.85em] bg-[#10B981] ml-[2px] align-middle"
                  style={{
                    animation: "blink 0.75s step-end infinite",
                  }}
                />
              </span>

              {/* Underline accent */}
              {/* <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-green-light"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
              </svg> */}
            </span>

            {/* <span className="block text-gray-900 mt-2 text-3xl sm:text-4xl lg:text-[2.8rem] font-bold">
              {t({ en: "Possible.", bn: "সম্ভব।" })}
            </span> */}
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-600 max-w-xl mb-12 leading-relaxed font-normal">
            {t({
              en: "Sabit Property Management Ltd. helps middle-income Bangladeshi families own their dream flat in prime Dhaka locations — on easy monthly installments, through our innovative share-based model.",
              bn: "সাবিত প্রপার্টি ম্যানেজমেন্ট লিঃ মধ্যবিত্ত বাংলাদেশি পরিবারকে সহজ মাসিক কিস্তিতে আমাদের শেয়ার-ভিত্তিক পদ্ধতিতে ঢাকার প্রাইম লোকেশনে স্বপ্নের ফ্ল্যাটের মালিক হতে সাহায্য করে।",
            })}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Button
              asChild
              size="lg"
              className="rounded-none px-8 py-7 bg-[#064E3B] hover:bg-gray-900 border border-transparent text-white transition-all text-sm font-bold tracking-widest uppercase relative overflow-hidden group"
            >
              <a
                href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20a%20flat%20from%20Sabit%20Property"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10 flex items-center">
                  {t({ en: "Get Your Flat Today", bn: "আজই ফ্ল্যাট পান" })}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </Button>

            <div className="flex items-center gap-4 cursor-pointer group mt-2 sm:mt-0">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#064E3B] group-hover:bg-[#064E3B] transition-all">
                <Play className="w-4 h-4 text-[#064E3B] group-hover:text-white translate-x-0.5" fill="currentColor" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase text-gray-700 group-hover:text-[#064E3B]">
                {t({ en: "Learn More", bn: "আরও জানুন" })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-10 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
          {stats.map(({ num, suffix, en, bn: bnL }) => (
            <div key={en}>
              <div className="text-4xl font-black text-gray-900 mb-1">
                {num}<span className="text-[#064E3B]">{suffix}</span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t({ en, bn: bnL })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Image ── */}
      <div className="lg:w-[45%] relative min-h-[500px] lg:min-h-full z-10 flex items-center justify-center p-6 lg:p-12 animate-in slide-in-from-right-12 fade-in duration-1000 delay-100 fill-mode-both">
        <div className="relative w-full h-[600px] shadow-2xl group overflow-hidden bg-gray-100 transform lg:-translate-x-12">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt={t({ en: "Modern residential building in Dhaka", bn: "ঢাকার আধুনিক আবাসিক ভবন" })}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[15%]"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute -bottom-6 -left-6 w-3/4 h-32 bg-white p-6 shadow-xl lg:flex items-center hidden gap-4 group-hover:translate-x-2 transition-transform duration-500">
            <div className="w-12 h-12 bg-green-light flex items-center justify-center shrink-0">
              <Building2 className="text-[#064E3B] w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">
                {t({ en: "Prime Residential Flats", bn: "প্রাইম আবাসিক ফ্ল্যাট" })}
              </h4>
              <p className="text-xs text-gray-500">
                {t({ en: "Khilgaon & Jodhivita, Dhaka", bn: "খিলগাঁও ও জোড়াভিটা, ঢাকা" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blink keyframe — injected once at section level */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
