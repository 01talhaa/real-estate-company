"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight, ExternalLink } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { type SabitEvent } from "@/types"

type FilterTab = "all" | "upcoming" | "past"

const typeColors: Record<SabitEvent["type"], string> = {
  launch: "bg-emerald-100 text-emerald-700",
  "investor-meet": "bg-blue-100 text-blue-700",
  community: "bg-amber-100 text-amber-700",
  announcement: "bg-purple-100 text-purple-700",
}

const typeLabel: Record<SabitEvent["type"], { en: string; bn: string }> = {
  launch: { en: "Launch", bn: "উদ্বোধন" },
  "investor-meet": { en: "Investor Meet", bn: "বিনিয়োগকারী সভা" },
  community: { en: "Community", bn: "কমিউনিটি" },
  announcement: { en: "Announcement", bn: "ঘোষণা" },
}

function formatDate(iso: string, lang: "en" | "bn") {
  const d = new Date(iso)
  if (lang === "bn") {
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })
  }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

interface Props {
  preview?: boolean // show only upcoming 3 on homepage
}

export function EventsSection({ preview = false }: Props) {
  const { t, lang } = useLanguage()
  const [filter, setFilter] = useState<FilterTab>("all")
  const [events, setEvents] = useState<SabitEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadEvents() {
      try {
        const response = await fetch("/api/events")
        const json = await response.json()
        if (mounted) {
          const nextEvents = Array.isArray(json.data) ? json.data : []
          setEvents(nextEvents)
        }
      } catch {
        if (mounted) setEvents([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadEvents()
    return () => {
      mounted = false
    }
  }, [])

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events]
  )

  const filtered = preview
    ? sortedEvents.filter((e) => e.isUpcoming).slice(0, 3)
    : filter === "upcoming"
    ? sortedEvents.filter((e) => e.isUpcoming)
    : filter === "past"
    ? sortedEvents.filter((e) => !e.isUpcoming)
    : sortedEvents

  const tabs: Array<{ key: FilterTab; label: { en: string; bn: string } }> = [
    { key: "all", label: { en: "All", bn: "সকল" } },
    { key: "upcoming", label: { en: "Upcoming", bn: "আসন্ন" } },
    { key: "past", label: { en: "Past", bn: "অতীত" } },
  ]

  return (
    <section id="events" className="py-20 sm:py-28 bg-gradient-to-br from-[#F0FDF4] via-white to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className={`${preview ? "max-w-3xl mx-auto text-center" : ""} mb-12`}>
          <div className={`inline-flex items-center gap-3 mb-6 ${preview ? "" : ""}`}>
            <span className="w-10 h-px bg-[#064E3B]" />
            <p className="text-xs font-bold tracking-[0.2em] text-[#064E3B] uppercase">
              {t({ en: "Events", bn: "ইভেন্ট" })}
            </p>
            <span className="w-10 h-px bg-[#064E3B]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-5">
            {t({ en: "Events & Announcements", bn: "ইভেন্ট ও ঘোষণা" })}
          </h2>
          <p className="text-lg text-gray-500 font-light max-w-2xl">
            {t({
              en: "Stay updated with our latest project launches, investor meets, and community events.",
              bn: "আমাদের সর্বশেষ প্রকল্প উদ্বোধন, বিনিয়োগকারী সভা ও কমিউনিটি ইভেন্ট সম্পর্কে আপডেট থাকুন।",
            })}
          </p>
        </div>

        {/* Filter tabs — only on full page */}
        {!preview && (
          <div className="flex flex-wrap gap-3 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`event-tab-${tab.key}`}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === tab.key
                    ? "bg-[#064E3B] text-white shadow-lg shadow-[#064E3B]/20"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#064E3B]/30 hover:text-[#064E3B]"
                }`}
              >
                {t(tab.label)}
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className={`grid gap-6 ${preview ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {loading ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              Loading events...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
              No events found.
            </div>
          ) : filtered.map((ev) => (
            <div
              key={ev.id}
              className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                ev.isUpcoming
                  ? "bg-white border-gray-100 shadow-sm hover:border-[#064E3B]/20"
                  : "bg-gray-50/70 border-gray-100 opacity-80"
              }`}
            >
              {ev.displayImage ? (
                <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                  <img
                    src={ev.displayImage}
                    alt={t(ev.title)}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : null}

              {/* Type badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeColors[ev.type]}`}>
                  {t(typeLabel[ev.type])}
                </span>
                {ev.isUpcoming && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#064E3B] text-white">
                    {t({ en: "Upcoming", bn: "আসন্ন" })}
                  </span>
                )}
              </div>

              <h3 className={`font-bold text-lg mb-3 leading-snug ${ev.isUpcoming ? "text-gray-900 group-hover:text-[#064E3B]" : "text-gray-600"} transition-colors`}>
                {t(ev.title)}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-[#064E3B]/60 shrink-0" />
                  <span>{formatDate(ev.date, lang)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-[#064E3B]/60 shrink-0" />
                  <span>{t(ev.location)}</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                {t(ev.description)}
              </p>

              {ev.isUpcoming && ev.registrationLink ? (
                <a
                  href={ev.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`register-${ev.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#064E3B] text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-colors"
                >
                  {t({ en: "Register Now", bn: "নিবন্ধন করুন" })}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-gray-400 font-medium">
                  {t({ en: "Event Concluded", bn: "ইভেন্ট সম্পন্ন" })}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CTA to full events page */}
        {preview && (
          <div className="text-center mt-12">
            <Link
              href="/events"
              id="view-all-events-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#064E3B] text-[#064E3B] font-bold rounded-full hover:bg-[#064E3B] hover:text-white transition-all"
            >
              {t({ en: "View All Events", bn: "সব ইভেন্ট দেখুন" })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
