"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Heart,
  Landmark,
  Layers3,
  MapPin,
  Phone,
  ShoppingBag,
  Shield,
  Trees,
  TrendingUp,
  Wifi,
  Zap,
  Bus,
  BookOpen,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { useLanguage } from "@/contexts/language-context"
import type { RealEstateProject, NearbyPlace } from "@/types"

const statusConfig = {
  handover: { label: { en: "Completed", bn: "সম্পন্ন" }, cls: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  ongoing: { label: { en: "Ongoing", bn: "চলমান" }, cls: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  upcoming: { label: { en: "Upcoming", bn: "আসন্ন" }, cls: "bg-sky-100 text-sky-700 border-sky-200", dot: "bg-sky-500" },
}

const nearbyIcon: Record<NearbyPlace["category"], React.ReactNode> = {
  hospital: <Heart className="h-4 w-4" />,
  school: <BookOpen className="h-4 w-4" />,
  college: <GraduationCap className="h-4 w-4" />,
  university: <Landmark className="h-4 w-4" />,
  mall: <ShoppingBag className="h-4 w-4" />,
  park: <Trees className="h-4 w-4" />,
  mosque: <Landmark className="h-4 w-4" />,
  transport: <Bus className="h-4 w-4" />,
}

const nearbyLabel: Record<NearbyPlace["category"], { en: string; bn: string }> = {
  hospital: { en: "Hospital", bn: "হাসপাতাল" },
  school: { en: "School", bn: "স্কুল" },
  college: { en: "College", bn: "কলেজ" },
  university: { en: "University", bn: "বিশ্ববিদ্যালয়" },
  mall: { en: "Mall / Market", bn: "মল / বাজার" },
  park: { en: "Park", bn: "পার্ক" },
  mosque: { en: "Mosque", bn: "মসজিদ" },
  transport: { en: "Transport", bn: "পরিবহন" },
}

const nearbyColor: Record<NearbyPlace["category"], string> = {
  hospital: "bg-red-50 text-red-600 border-red-100",
  school: "bg-blue-50 text-blue-600 border-blue-100",
  college: "bg-indigo-50 text-indigo-600 border-indigo-100",
  university: "bg-purple-50 text-purple-600 border-purple-100",
  mall: "bg-amber-50 text-amber-600 border-amber-100",
  park: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mosque: "bg-teal-50 text-teal-600 border-teal-100",
  transport: "bg-slate-50 text-slate-600 border-slate-200",
}

const amenityIconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  generator: <Zap className="h-4 w-4" />,
  fire: <Flame className="h-4 w-4" />,
  default: <CheckCircle2 className="h-4 w-4" />,
}

function getAmenityIcon(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes("wifi") || lower.includes("internet")) return amenityIconMap.wifi
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return amenityIconMap.security
  if (lower.includes("generator") || lower.includes("power") || lower.includes("backup")) return amenityIconMap.generator
  if (lower.includes("fire")) return amenityIconMap.fire
  return amenityIconMap.default
}

function getImageSrc(value: string | null | undefined) {
  const trimmed = typeof value === "string" ? value.trim() : ""
  if (!trimmed) return "/placeholder.svg"
  if (trimmed.startsWith("/")) return trimmed
  try {
    return new URL(trimmed).toString()
  } catch {
    return "/placeholder.svg"
  }
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const slug = params?.id
  const { t } = useLanguage()
  const [project, setProject] = useState<RealEstateProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${slug}`)
        const data = await response.json()
        if (mounted) setProject(data.success ? data.data : null)
      } catch {
        if (mounted) setProject(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (slug) loadProject()
    return () => {
      mounted = false
    }
  }, [slug])

  const cfg = project ? statusConfig[project.status] : statusConfig.upcoming
  const locationQuery = project
    ? [project.address?.en, project.location?.en]
        .filter((value): value is string => Boolean(value && value.trim()))
        .join(", ") || `${project.coordinates.lat}, ${project.coordinates.lng}`
    : ""
  const mapSrc = locationQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=16&output=embed`
    : ""

  const groupedNearby = useMemo(() => {
    const nearby = project?.nearbyPlaces ?? []
    return nearby.reduce<Partial<Record<NearbyPlace["category"], NearbyPlace[]>>>((acc, place) => {
      acc[place.category] = acc[place.category] ?? []
      acc[place.category]!.push(place)
      return acc
    }, {})
  }, [project])

  const nearbyCategories = Object.keys(groupedNearby) as NearbyPlace["category"][]

  const waHref = useMemo(() => {
    if (!project) return "https://wa.me/8801401658685"
    const message = encodeURIComponent(
      project.status === "upcoming"
        ? `Assalamu Alaikum,\n\nI am interested in your upcoming project:\n*${project.name.en}*\nLocation: ${project.address.en}\n\nCould you please share:\n- Share price & payment plan\n- Expected handover date\n- Available units\n\nThank you.`
        : `Assalamu Alaikum,\n\nI would like to enquire about:\n*${project.name.en}*\nLocation: ${project.address.en}\n\nPlease share full details, pricing, and payment schedule.\n\nThank you.`
    )
    return `https://wa.me/8801401658685?text=${message}`
  }, [project])

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-slate-950">
        <SiteHeader />
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="h-[70vh] animate-pulse rounded-[2rem] bg-slate-100" />
        </div>
        <AppverseFooter />
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-white text-slate-950">
        <SiteHeader />
        <div className="container mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Project not found</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            The requested project does not exist in the current database.
          </p>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Back to Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <AppverseFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_30%)]" />
        <div className="container relative mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div className="space-y-6">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
              {t({ en: "Back to Projects", bn: "প্রকল্পে ফিরুন" })}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
                {project.status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
                {project.flats || 0} flats
              </span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-white/80">
                {project.floors || 0} floors
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{t(project.name)}</h1>
              <p className="max-w-3xl text-lg leading-8 text-white/70">{t(project.description)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 text-emerald-300" />
              <span>{t(project.address)}</span>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
                <Phone className="h-4 w-4" />
                Enquire on WhatsApp
              </a>
              <a href="#details" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
                View Details
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="relative aspect-[4/5] w-full">
              <Image src={getImageSrc(project.image)} alt={t(project.name)} fill className="object-cover" priority sizes="(min-width: 1024px) 40vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10 text-white">
              <InfoTile label={t({ en: "Completion", bn: "সমাপ্তি" })} value={project.completionDate ? project.completionDate : "TBD"} />
              <InfoTile label={t({ en: "Progress", bn: "অগ্রগতি" })} value={project.progressPercent !== undefined ? `${project.progressPercent}%` : "—"} />
            </div>
          </div>
        </div>
      </section>

      <div id="details" className="container mx-auto max-w-7xl px-6 py-16 space-y-20">
        <section className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 lg:col-span-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
              <Building2 className="h-3.5 w-3.5" />
              Overview
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">About this project</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{project.longDescription ? t(project.longDescription) : t(project.description)}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {project.gallery?.map((image, index) => (
                <span key={`${image}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-lg shadow-slate-200/50">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              <TrendingUp className="h-3.5 w-3.5" />
              Quick facts
            </div>
            <div className="space-y-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">Budget</div>
                <div className="mt-2 text-2xl font-black">{project.financials?.sharePrice ? `৳ ${project.financials.sharePrice.toLocaleString("en-BD")}` : "TBD"}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">Price per sqft</div>
                <div className="mt-2 text-lg font-semibold text-white/85">
                  {project.financials?.pricePerSqft ? `৳ ${project.financials.pricePerSqft.toLocaleString("en-BD")}` : "TBD"}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">ROI</div>
                <div className="mt-2 text-lg font-semibold text-white/85">{project.financials?.expectedROI ? `${project.financials.expectedROI}%` : "TBD"}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-950">{t(project.name)}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t(project.address)}</p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-4">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-slate-950">Map Preview</p>
                <p className="text-xs text-slate-500">Based on the project address and location</p>
              </div>
            </div>
            {mapSrc ? (
              <iframe
                title={`Map of ${t(project.name)}`}
                src={mapSrc}
                width="100%"
                height="520"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center px-6 text-center text-sm text-slate-500">
                Location map will appear once the address or location is available.
              </div>
            )}
          </div>
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Gallery</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {project.gallery.map((image, index) => (
                <div key={image + index} className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100">
                  <Image src={getImageSrc(image)} alt={`${t(project.name)} ${index + 1}`} fill className="object-cover transition-transform duration-700 hover:scale-105" sizes="(min-width: 1280px) 33vw, 50vw" />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          {project.amenities && (
            <AmenitiesCard title={t({ en: "Amenities", bn: "সুবিধাসমূহ" })} columns={project.amenities} />
          )}
          {project.specifications && (
            <SpecCard specs={project.specifications} />
          )}
        </section>

        {project.financials && (
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Financials</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Share Price" value={project.financials.sharePrice ? `৳ ${project.financials.sharePrice.toLocaleString("en-BD")}` : "TBD"} />
              <Metric label="Price per sqft" value={project.financials.pricePerSqft ? `৳ ${project.financials.pricePerSqft.toLocaleString("en-BD")}` : "TBD"} />
              <Metric label="Expected ROI" value={project.financials.expectedROI ? `${project.financials.expectedROI}%` : "TBD"} />
            </div>
          </section>
        )}

        {project.progressPercent !== undefined && project.status === "ongoing" && (
          <section className="rounded-[1.75rem] border border-amber-100 bg-amber-50 p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">Construction Progress</h3>
              <span className="text-2xl font-black text-amber-600">{project.progressPercent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-amber-100">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${project.progressPercent}%` }} />
            </div>
          </section>
        )}

        {nearbyCategories.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Location & Connectivity</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {nearbyCategories.map((cat) => (
                <div key={cat} className={`rounded-[1.5rem] border p-5 ${nearbyColor[cat]}`}>
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${nearbyColor[cat]}`}>
                    {nearbyIcon[cat]}
                    {t(nearbyLabel[cat])}
                  </div>
                  <ul className="space-y-2.5">
                    {groupedNearby[cat]!.map((place, index) => (
                      <li key={`${place.name.en}-${index}`} className="flex items-start justify-between gap-3">
                        <span className="text-sm leading-snug text-slate-700">{t(place.name)}</span>
                        <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold text-slate-500">{place.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-2xl shadow-slate-950/20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              <Phone className="h-3.5 w-3.5" />
              Contact
            </div>
            <h2 className="text-3xl font-black tracking-tight">Want a project like this?</h2>
            <p className="text-white/70">
              Reach out for scope, budget, and delivery details. The database can be edited from the admin panel.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
              <Phone className="h-4 w-4" />
              WhatsApp
            </a>
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>

      <AppverseFooter />
    </main>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-950/55 p-5">
      <div className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-black text-slate-950">{value}</div>
    </div>
  )
}

function SpecCard({ specs }: { specs: RealEstateProject["specifications"] }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
        <Layers3 className="h-3.5 w-3.5" />
        Specifications
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Metric label="Flat Area" value={specs?.totalAreaSqft ? `${specs.totalAreaSqft} sqft` : "N/A"} />
        <Metric label="Bedrooms" value={specs?.bedrooms ? `${specs.bedrooms}` : "N/A"} />
        <Metric label="Bathrooms" value={specs?.bathrooms ? `${specs.bathrooms}` : "N/A"} />
        <Metric label="Parking" value={specs?.parkingSpaces ? `${specs.parkingSpaces}` : "N/A"} />
      </div>
    </div>
  )
}

function AmenitiesCard({ title, columns }: { title: string; columns: NonNullable<RealEstateProject["amenities"]> }) {
  const blocks = [
    { key: "interior" as const, label: "Interior" },
    { key: "exterior" as const, label: "Exterior" },
    { key: "building" as const, label: "Building" },
  ]

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.key} className="rounded-[1.25rem] bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-black uppercase tracking-[0.24em] text-slate-700">{block.label}</h4>
            <ul className="space-y-2">
              {columns[block.key].map((item) => (
                <li key={item.en} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                  <span className="mt-0.5 text-emerald-600">{getAmenityIcon(item.en)}</span>
                  <span>{tMaybe(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function tMaybe(text: { en: string; bn: string }) {
  return text.en
}
