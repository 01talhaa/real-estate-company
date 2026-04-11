"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft, ArrowRight, MapPin, Building2, Layers, Car, Bath, BedDouble,
  Calendar, TrendingUp, CheckCircle2, Wifi, Shield, Zap, Trees, ShoppingBag,
  GraduationCap, Heart, Bus, BookOpen, Landmark, Flame, Phone,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/contexts/language-context"
import { realEstateProjects, type NearbyPlace } from "@/data/real-estate-projects"
import { GalleryGrid } from "@/components/gallery-lightbox"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig = {
  handover: { label: { en: "Completed", bn: "সম্পন্ন" }, cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  ongoing:  { label: { en: "Ongoing",   bn: "চলমান"  }, cls: "bg-orange-100 text-orange-700 border-orange-200",   dot: "bg-orange-500"  },
  upcoming: { label: { en: "Upcoming",  bn: "আসন্ন"  }, cls: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-500"    },
}

const nearbyIcon: Record<NearbyPlace["category"], React.ReactNode> = {
  hospital:   <Heart    className="w-4 h-4" />,
  school:     <BookOpen className="w-4 h-4" />,
  college:    <GraduationCap className="w-4 h-4" />,
  university: <Landmark className="w-4 h-4" />,
  mall:       <ShoppingBag className="w-4 h-4" />,
  park:       <Trees    className="w-4 h-4" />,
  mosque:     <Landmark className="w-4 h-4" />,
  transport:  <Bus      className="w-4 h-4" />,
}

const nearbyLabel: Record<NearbyPlace["category"], { en: string; bn: string }> = {
  hospital:   { en: "Hospital",   bn: "হাসপাতাল"     },
  school:     { en: "School",     bn: "স্কুল"        },
  college:    { en: "College",    bn: "কলেজ"         },
  university: { en: "University", bn: "বিশ্ববিদ্যালয়" },
  mall:       { en: "Mall / Market", bn: "মল / বাজার" },
  park:       { en: "Park",       bn: "পার্ক"        },
  mosque:     { en: "Mosque",     bn: "মসজিদ"        },
  transport:  { en: "Transport",  bn: "পরিবহন"       },
}

const nearbyColor: Record<NearbyPlace["category"], string> = {
  hospital:   "bg-red-50 text-red-600 border-red-100",
  school:     "bg-blue-50 text-blue-600 border-blue-100",
  college:    "bg-indigo-50 text-indigo-600 border-indigo-100",
  university: "bg-purple-50 text-purple-600 border-purple-100",
  mall:       "bg-amber-50 text-amber-600 border-amber-100",
  park:       "bg-green-50 text-green-600 border-green-100",
  mosque:     "bg-teal-50 text-teal-600 border-teal-100",
  transport:  "bg-gray-50 text-gray-600 border-gray-200",
}

const amenityIconMap: Record<string, React.ReactNode> = {
  "wifi": <Wifi className="w-4 h-4" />,
  "security": <Shield className="w-4 h-4" />,
  "generator": <Zap className="w-4 h-4" />,
  "fire": <Flame className="w-4 h-4" />,
  "default": <CheckCircle2 className="w-4 h-4" />,
}

function getAmenityIcon(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes("wifi") || lower.includes("internet")) return amenityIconMap["wifi"]
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return amenityIconMap["security"]
  if (lower.includes("generator") || lower.includes("power") || lower.includes("backup")) return amenityIconMap["generator"]
  if (lower.includes("fire")) return amenityIconMap["fire"]
  return amenityIconMap["default"]
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = use(params)
  const project = realEstateProjects.find((p) => p.slug === slug)
  const { t, lang } = useLanguage()

  if (!project) notFound()

  const cfg = statusConfig[project.status]
  const mapSrc = `https://maps.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}&z=16&output=embed`

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD").format(n)

  // Group nearby places by category
  const groupedNearby = (project.nearbyPlaces ?? []).reduce<Partial<Record<NearbyPlace["category"], NearbyPlace[]>>>(
    (acc, place) => {
      acc[place.category] = acc[place.category] ?? []
      acc[place.category]!.push(place)
      return acc
    },
    {}
  )

  const nearbyCategories = Object.keys(groupedNearby) as NearbyPlace["category"][]

  const waMsg = encodeURIComponent(
    project.status === "upcoming"
      ? `Assalamu Alaikum,\n\nI am interested in your upcoming project:\n*${project.name.en}*\nLocation: ${project.address.en}\n\nCould you please share:\n- Share price & payment plan\n- Expected handover date\n- Available units\n\nThank you.`
      : `Assalamu Alaikum,\n\nI would like to enquire about:\n*${project.name.en}*\nLocation: ${project.address.en}\n\nPlease share full details, pricing, and payment schedule.\n\nThank you.`
  )
  const waHref = `https://wa.me/8801401658685?text=${waMsg}`

  return (
    <main className="min-h-[100dvh] bg-white text-black">
      <SiteHeader />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={t(project.name)}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-semibold hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t({ en: "Back to Projects", bn: "প্রকল্পে ফিরুন" })}
          </Link>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="container mx-auto max-w-7xl">
            {/* Status pill */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border mb-4 ${cfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {t(cfg.label)}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
              {t(project.name)}
            </h1>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4 text-green-400" />
              <span>{t(project.address)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#064E3B] text-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/10">
            {[
              { icon: <Building2 className="w-5 h-5" />, label: t({ en: "Flats", bn: "ফ্ল্যাট" }), value: project.flats ?? "—" },
              { icon: <Layers    className="w-5 h-5" />, label: t({ en: "Storeys", bn: "তলা" }), value: project.floors ?? "—" },
              { icon: <BedDouble className="w-5 h-5" />, label: t({ en: "Bedrooms", bn: "শোবার ঘর" }), value: project.specifications?.bedrooms ?? "—" },
              { icon: <Bath      className="w-5 h-5" />, label: t({ en: "Bathrooms", bn: "বাথরুম" }), value: project.specifications?.bathrooms ?? "—" },
              { icon: <Car       className="w-5 h-5" />, label: t({ en: "Parking", bn: "পার্কিং" }), value: project.specifications?.parkingSpaces ?? "—" },
              {
                icon: <Calendar  className="w-5 h-5" />,
                label: project.status === "handover" ? t({ en: "Delivered", bn: "হস্তান্তর" }) : t({ en: "Expected", bn: "প্রত্যাশিত" }),
                value: project.completionDate
                  ? new Date(project.completionDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  : "—",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-4 px-3 text-center gap-1">
                <span className="text-green-300/70">{item.icon}</span>
                <span className="text-xl font-black">{item.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-16 space-y-24">

        {/* ── Description ───────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
                {t({ en: "About This Project", bn: "এই প্রকল্প সম্পর্কে" })}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
              {t(project.name)}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">{t(project.description)}</p>
            {project.longDescription && (
              <p className="text-gray-500 leading-relaxed">{t(project.longDescription)}</p>
            )}
          </div>

          {/* Financials card */}
          {project.financials && (
            <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2f] rounded-3xl p-8 text-white shadow-2xl shadow-[#064E3B]/20">
              <p className="text-green-300/70 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                {t({ en: "Investment Info", bn: "বিনিয়োগ তথ্য" })}
              </p>
              <div className="space-y-5">
                {project.financials.sharePrice && (
                  <div className="flex justify-between items-center border-b border-white/10 pb-5">
                    <span className="text-white/60 text-sm font-medium">
                      {t({ en: "Share Price", bn: "শেয়ারের মূল্য" })}
                    </span>
                    <span className="text-2xl font-black">
                      ৳ {fmt(project.financials.sharePrice)}
                    </span>
                  </div>
                )}
                {project.financials.pricePerSqft && (
                  <div className="flex justify-between items-center border-b border-white/10 pb-5">
                    <span className="text-white/60 text-sm font-medium">
                      {t({ en: "Price per sqft", bn: "প্রতি বর্গফুট মূল্য" })}
                    </span>
                    <span className="text-xl font-black">
                      ৳ {fmt(project.financials.pricePerSqft)}
                    </span>
                  </div>
                )}
                {project.specifications?.totalAreaSqft && (
                  <div className="flex justify-between items-center border-b border-white/10 pb-5">
                    <span className="text-white/60 text-sm font-medium">
                      {t({ en: "Flat Area", bn: "ফ্ল্যাটের আয়তন" })}
                    </span>
                    <span className="text-xl font-black">
                      {project.specifications.totalAreaSqft} {t({ en: "sqft", bn: "বর্গফুট" })}
                    </span>
                  </div>
                )}
                {project.financials.expectedROI && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm font-medium">
                      {t({ en: "Expected ROI", bn: "প্রত্যাশিত রিটার্ন" })}
                    </span>
                    <span className="text-xl font-black text-green-300">
                      {project.financials.expectedROI}% <TrendingUp className="inline w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-white text-[#064E3B] font-black text-sm rounded-2xl hover:bg-green-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t({ en: "Enquire via WhatsApp", bn: "হোয়াটসঅ্যাপে যোগাযোগ করুন" })}
              </a>
            </div>
          )}
        </div>

        {/* ── Progress (ongoing only) ────────────────────────────────────────── */}
        {project.status === "ongoing" && project.progressPercent !== undefined && (
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {t({ en: "Construction Progress", bn: "নির্মাণ অগ্রগতি" })}
              </h3>
              <span className="text-2xl font-black text-orange-600">{project.progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
            <p className="text-orange-600/70 text-sm mt-3 font-medium">
              {t({
                en: `Expected completion: ${new Date(project.completionDate!).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
                bn: `প্রত্যাশিত সমাপ্তি: ${new Date(project.completionDate!).toLocaleDateString("bn-BD", { month: "long", year: "numeric" })}`,
              })}
            </p>
          </div>
        )}

        {/* ── Amenities ─────────────────────────────────────────────────────── */}
        {project.amenities && (
          <div>
            <div className="inline-flex items-center gap-3 mb-10">
              <span className="w-10 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
                {t({ en: "Amenities & Features", bn: "সুযোগ-সুবিধা ও বৈশিষ্ট্য" })}
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: "interior" as const, title: { en: "Interior", bn: "অভ্যন্তরীণ" }, bg: "bg-green-50", border: "border-green-100", icon: "text-green-600" },
                { key: "exterior" as const, title: { en: "Exterior", bn: "বাহ্যিক"    }, bg: "bg-blue-50",  border: "border-blue-100",  icon: "text-blue-600"  },
                { key: "building" as const, title: { en: "Building", bn: "ভবন"        }, bg: "bg-purple-50", border: "border-purple-100", icon: "text-purple-600" },
              ].map(({ key, title, bg, border, icon }) => (
                <div key={key} className={`${bg} border ${border} rounded-2xl p-6`}>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-5">{t(title)}</h3>
                  <ul className="space-y-3">
                    {project.amenities![key].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`mt-0.5 shrink-0 ${icon}`}>
                          {getAmenityIcon(item.en)}
                        </span>
                        <span className="text-gray-700 text-sm leading-snug">{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Photo Gallery ─────────────────────────────────────────────────── */}
        {project.gallery && project.gallery.length > 0 && (
          <div>
            <div className="inline-flex items-center gap-3 mb-10">
              <span className="w-10 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
                {t({ en: "Photo Gallery", bn: "ফটো গ্যালারি" })}
              </span>
            </div>
            <GalleryGrid
              images={project.gallery}
              projectName={t(project.name)}
            />
          </div>
        )}

        {/* ── Nearby Places ─────────────────────────────────────────────────── */}
        {nearbyCategories.length > 0 && (
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-10 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
                {t({ en: "Location & Connectivity", bn: "অবস্থান ও সংযোগ" })}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-10">
              {t({
                en: "Distances are approximate straight-line estimates.",
                bn: "দূরত্বগুলো আনুমানিক সরলরেখার মাপ।",
              })}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {nearbyCategories.map((cat) => (
                <div key={cat} className={`rounded-2xl border p-5 ${nearbyColor[cat].replace("text-", "border-").split(" ")[1]}`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 border ${nearbyColor[cat]}`}>
                    {nearbyIcon[cat]}
                    {t(nearbyLabel[cat])}
                  </div>
                  <ul className="space-y-2.5">
                    {groupedNearby[cat].map((place, i) => (
                      <li key={i} className="flex items-start justify-between gap-3">
                        <span className="text-gray-700 text-sm leading-snug">{t(place.name)}</span>
                        <span className="shrink-0 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {place.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── Embedded Google Map ──────────────────────────────────────── */}
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-[#064E3B]/10 border border-gray-100">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#064E3B]" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t(project.name)}</p>
                  <p className="text-gray-500 text-xs">{t(project.address)}</p>
                </div>
              </div>
              <iframe
                title={`Map of ${t(project.name)}`}
                src={mapSrc}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] to-[#043d2f] p-10 sm:p-16 text-center shadow-2xl">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />

          <p className="text-green-300/70 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            {t({ en: "Interested?", bn: "আগ্রহী?" })}
          </p>
          <h2 className="text-white text-3xl sm:text-4xl font-extrabold mb-4">
            {project.status === "upcoming"
              ? t({ en: "Register Your Interest Today", bn: "আজই আপনার আগ্রহ জানান" })
              : t({ en: "Want to Own a Flat Here?", bn: "এখানে ফ্ল্যাটের মালিক হতে চান?" })}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
            {t({
              en: "Contact us via WhatsApp to get full details, pricing, and payment schedule. We respond within the hour.",
              bn: "হোয়াটসঅ্যাপে যোগাযোগ করুন সম্পূর্ণ বিবরণ, মূল্য এবং পেমেন্ট সময়সূচি পেতে। আমরা এক ঘণ্টার মধ্যে সাড়া দিই।",
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#064E3B] font-black text-sm rounded-full hover:bg-green-50 transition-colors shadow-xl"
            >
              <Phone className="w-4 h-4" />
              {t({ en: "WhatsApp Us Now", bn: "এখনই হোয়াটসঅ্যাপ করুন" })}
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-bold text-sm rounded-full hover:bg-white/10 transition-colors"
            >
              {t({ en: "View All Projects", bn: "সব প্রকল্প দেখুন" })}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      <AppverseFooter />
    </main>
  )
}
