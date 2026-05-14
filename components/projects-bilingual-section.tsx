"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Building2, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { RealEstateProject } from "@/types"

type FilterKey = "all" | "handover" | "ongoing" | "upcoming"

const filters: Array<{ key: FilterKey; label: { en: string; bn: string } }> = [
  { key: "all", label: { en: "All Projects", bn: "সব প্রকল্প" } },
  { key: "handover", label: { en: "Completed", bn: "সম্পন্ন" } },
  { key: "ongoing", label: { en: "Ongoing", bn: "চলমান" } },
  { key: "upcoming", label: { en: "Upcoming", bn: "আসন্ন" } },
]

const statusStyles: Record<string, string> = {
  handover: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-amber-100 text-amber-700 border-amber-200",
  upcoming: "bg-sky-100 text-sky-700 border-sky-200",
}

export function ProjectsBilingualSection({ preview = false }: { preview?: boolean }) {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<RealEstateProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  useEffect(() => {
    let mounted = true

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        if (mounted) {
          setProjects(data.success ? data.data : [])
        }
      } catch {
        if (mounted) setProjects([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProjects()
    return () => {
      mounted = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    const subset = activeFilter === "all" ? projects : projects.filter((project) => project.status === activeFilter)
    return preview ? subset.slice(0, 3) : subset
  }, [projects, activeFilter, preview])

  const countByStatus = (key: FilterKey) => {
    if (key === "all") return projects.length
    return projects.filter((project) => project.status === key).length
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-white py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.05),transparent_35%)]" />
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              {t({ en: "Our Projects", bn: "আমাদের প্রকল্পসমূহ" })}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {t({ en: "Every Project,", bn: "প্রতিটি প্রকল্পে," })} <span className="text-emerald-700">{t({ en: "delivered with integrity", bn: "সততার নিশ্চয়তা" })}</span>
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                {t({
                  en: "Explore the latest residential developments, each stored in the exact JSON structure used by the admin panel.",
                  bn: "সর্বশেষ আবাসিক প্রকল্পগুলো দেখুন, যেগুলো অ্যাডমিন প্যানেলের একই JSON স্ট্রাকচারে সংরক্ষিত।",
                })}
              </p>
            </div>
          </div>

          {preview && (
            <Button asChild className="h-12 rounded-full bg-slate-950 px-6 font-semibold text-white hover:bg-slate-800">
              <Link href="/projects">
                {t({ en: "View All Projects", bn: "সব প্রকল্প দেখুন" })}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {!preview && (
          <div className="mb-10 flex flex-wrap gap-3">
            {filters.map((filter) => {
              const active = filter.key === activeFilter
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    active ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {t(filter.label)} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{countByStatus(filter.key)}</span>
                </button>
              )
            })}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[1.75rem] bg-slate-100" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <article key={project.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-2xl">
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image src={project.image} alt={t(project.name)} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950 backdrop-blur">
                        {t({ en: "Residential", bn: "আবাসিক" })}
                      </span>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur ${statusStyles[project.status] || statusStyles.upcoming}`}>
                        {t(project.status === "handover" ? { en: "Completed", bn: "সম্পন্ন" } : project.status === "ongoing" ? { en: "Ongoing", bn: "চলমান" } : { en: "Upcoming", bn: "আসন্ন" })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="line-clamp-1 text-xl font-black text-slate-950">{t(project.name)}</h3>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                          {project.floors || 0} floors
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {t(project.location)}
                      </p>
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-slate-600">{t(project.description)}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.status === "ongoing" && project.progressPercent !== undefined && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{project.progressPercent}% complete</span>
                      )}
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {project.gallery?.length || 0} photos
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white px-8 py-16 text-center text-slate-500">
            <Building2 className="mb-4 h-10 w-10 text-slate-300" />
            <p className="text-lg font-medium">{t({ en: "No projects available yet.", bn: "এখনও কোনো প্রকল্প নেই।" })}</p>
          </div>
        )}
      </div>
    </section>
  )
}
