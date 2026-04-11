"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, ArrowRight, Building2, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { realEstateProjects, type RealEstateProject } from "@/data/real-estate-projects"

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig = {
  handover: {
    badge: { en: "Completed", bn: "সম্পন্ন" },
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  ongoing: {
    badge: { en: "Ongoing", bn: "চলমান" },
    pill: "bg-orange-100 text-orange-700 border border-orange-200",
    dot: "bg-orange-500",
  },
  upcoming: {
    badge: { en: "Upcoming", bn: "আসন্ন" },
    pill: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
  },
}

// ── Filter tabs ───────────────────────────────────────────────────────────────
type FilterKey = "all" | "handover" | "ongoing" | "upcoming"

const filterTabs: Array<{ key: FilterKey; label: { en: string; bn: string }; color: string }> = [
  { key: "all", label: { en: "All Projects", bn: "সব প্রকল্প" }, color: "bg-[#064E3B]" },
  { key: "handover", label: { en: "Completed", bn: "সম্পন্ন" }, color: "bg-emerald-600" },
  { key: "ongoing", label: { en: "Ongoing", bn: "চলমান" }, color: "bg-orange-500" },
  { key: "upcoming", label: { en: "Upcoming", bn: "আসন্ন" }, color: "bg-blue-600" },
]

// ── Filter pill counts ────────────────────────────────────────────────────────
function countByStatus(key: FilterKey) {
  if (key === "all") return realEstateProjects.length
  return realEstateProjects.filter((p) => p.status === key).length
}

// ── Animated pill indicator ───────────────────────────────────────────────────
function FilterBar({
  active,
  onChange,
}: {
  active: FilterKey
  onChange: (key: FilterKey) => void
}) {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const activeEl = container.querySelector<HTMLElement>(`[data-key="${active}"]`)
    if (!activeEl) return
    setIndicatorStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth })
  }, [active])

  return (
    // Outer scroll wrapper — lets the pill bar scroll horizontally on small screens
    <div className="w-full overflow-x-auto pb-1 -mb-1">
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm min-w-max"
      >
        {/* Sliding background indicator */}
        <span
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-[#064E3B] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-lg shadow-[#064E3B]/20"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />

        {filterTabs.map((tab) => {
          const count = countByStatus(tab.key)
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              data-key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative z-10 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 whitespace-nowrap ${
                isActive ? "text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t(tab.label)}
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-black transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  /** Homepage preview → show first 3, hide filter */
  preview?: boolean
}

// ── Main Section ──────────────────────────────────────────────────────────────
export function ProjectsBilingualSection({ preview = false }: Props) {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")

  const projects = preview
    ? realEstateProjects.slice(0, 3)
    : activeFilter === "all"
    ? realEstateProjects
    : realEstateProjects.filter((p) => p.status === activeFilter)

  return (
    <section id="projects" className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-[#f8fcfb] -z-10" />
      <div className="container mx-auto px-6 max-w-7xl">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex flex-col gap-4 mb-6">
              <span className="w-16 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">
                {t({ en: "Our Projects", bn: "আমাদের প্রকল্পসমূহ" })}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 leading-[1.05]">
              {t({ en: "Every Project,", bn: "প্রতিটি প্রকল্পে," })}
              {" "}
              <span className="text-[#064E3B]">
                {t({ en: "Delivered with Integrity", bn: "সততার নিশ্চয়তা" })}
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              {t({
                en: "From concept to keys — our residential projects in Khilgaon and Jodhivita are built on trust, quality, and transparent pricing.",
                bn: "পরিকল্পনা থেকে চাবি হস্তান্তর পর্যন্ত — খিলগাঁও ও জোড়াভিটায় আমাদের আবাসিক প্রকল্পগুলো বিশ্বাস, মান ও স্বচ্ছ মূল্যায়নের ভিত্তিতে নির্মিত।",
              })}
            </p>
          </div>
          {/* Only show "Explore All" on the homepage preview, not on the full projects page */}
          {preview && (
            <div className="pb-2">
              <Button
                asChild
                size="lg"
                className="rounded-none px-8 h-12 bg-transparent text-[#064E3B] border border-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-all text-sm font-bold tracking-widest uppercase group"
              >
                <Link href="/projects" id="explore-all-projects-btn">
                  {t({ en: "Explore All Projects", bn: "সব প্রকল্প দেখুন" })}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* ── Filter Bar (full page only) ── */}
        {!preview && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-16">
            <FilterBar active={activeFilter} onChange={setActiveFilter} />

            {/* Result count */}
            <p className="text-sm text-gray-400 font-medium">
              {projects.length}{" "}
              {t({ en: "project(s) found", bn: "টি প্রকল্প পাওয়া গেছে" })}
            </p>
          </div>
        )}

        {/* ── Alternating Case-Study Cards ── */}
        {projects.length > 0 ? (
          <div className="flex flex-col gap-32">
            {projects.map((project, index) => (
              <ProjectCaseStudy key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg font-medium">
              {t({ en: "No projects in this category yet.", bn: "এই বিভাগে এখনো কোনো প্রকল্প নেই।" })}
            </p>
          </div>
        )}

      </div>
    </section>
  )
}

// ── Project Case Study Card ───────────────────────────────────────────────────
function ProjectCaseStudy({ project, index }: { project: RealEstateProject; index: number }) {
  const { t } = useLanguage()
  const isEven = index % 2 !== 0
  const cfg = statusConfig[project.status]

  return (
    <div
      className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center group ${isEven ? "lg:flex-row-reverse" : ""}`}
    >
      {/* ── Image Side ── */}
      <div className="w-full lg:w-1/2 relative">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shadow-[0_20px_50px_-15px_rgba(6,78,59,0.2)] lg:group-hover:-translate-y-2 transition-transform duration-700">
          <Image
            src={project.image}
            alt={t(project.name)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />

          {/* Status badge */}
          <div className="absolute top-6 left-6 flex gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-sm ${cfg.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {t(cfg.badge)}
            </div>
          </div>
        </div>

        {/* Decorative border block */}
        <div
          className={`absolute top-8 ${isEven ? "-right-8" : "-left-8"} w-full h-full border border-[#064E3B]/10 -z-10 bg-[#064E3B]/[0.02] transition-transform duration-700 group-hover:translate-x-0 ${isEven ? "translate-x-4" : "-translate-x-4"}`}
        />
      </div>

      {/* ── Content Side ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="text-[#064E3B] font-black tracking-widest text-xs uppercase bg-[#064E3B]/5 px-3 py-1 border border-[#064E3B]/10">
            {t({ en: "Residential", bn: "আবাসিক" })}
          </span>
          <span className="w-8 h-[1px] bg-gray-300" />
          <span className="text-gray-500 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {t(project.location)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1] group-hover:text-[#064E3B] transition-colors">
          {t(project.name)}
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
          {t(project.description)}
        </p>

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {project.flats && (
            <div className="border-l-2 border-gray-200 pl-5">
              <div className="text-2xl lg:text-3xl font-black text-gray-900 mb-1 tracking-tight flex items-center gap-2">
                {project.flats}
                <Building2 className="w-5 h-5 text-[#064E3B]" />
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t({ en: "Total Flats", bn: "মোট ফ্ল্যাট" })}
              </div>
            </div>
          )}
          {project.floors && (
            <div className="border-l-2 border-[#064E3B] pl-5">
              <div className="text-2xl lg:text-3xl font-black text-[#064E3B] mb-1 tracking-tight flex items-center gap-2">
                {project.floors}
                <TrendingUp className="w-5 h-5 text-green-light" />
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {t({ en: "Storeys", bn: "তলা বিশিষ্ট" })}
              </div>
            </div>
          )}
        </div>

        {/* Progress bar (ongoing only) */}
        {project.status === "ongoing" && project.progressPercent !== undefined && (
          <div className="mb-10">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-gray-500 uppercase tracking-wider">
                {t({ en: "Construction Progress", bn: "নির্মাণ অগ্রগতি" })}
              </span>
              <span className="text-[#064E3B] font-black">{project.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#064E3B] to-[#10B981] rounded-full"
                style={{ width: `${project.progressPercent}%`, transition: "width 1.2s ease-out" }}
              />
            </div>
          </div>
        )}

        {/* Completion / expected */}
        {project.completionDate && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-10 font-semibold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            {project.status === "handover"
              ? t({ en: "Delivered:", bn: "হস্তান্তর:" })
              : t({ en: "Expected:", bn: "প্রত্যাশিত:" })}{" "}
            {new Date(project.completionDate).toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </div>
        )}

        {/* CTA */}
        {project.status === "upcoming" ? (
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Details link — same as other statuses */}
            <Button
              asChild
              className="rounded-none px-8 py-6 bg-gray-900 hover:bg-[#064E3B] text-white font-bold tracking-widest uppercase text-xs transition-all shadow-xl hover:shadow-[0_10px_30px_-15px_rgba(6,78,59,0.5)]"
            >
              <Link href={`/projects/${project.slug}`} id={`view-project-${project.id}`}>
                {t({ en: "View Details", bn: "বিস্তারিত দেখুন" })}
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </Button>

            {/* WhatsApp with pre-filled project-specific message */}
            <Button
              asChild
              className="rounded-none px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-widest uppercase text-xs transition-all shadow-xl"
            >
              <a
                href={`https://wa.me/8801401658685?text=${encodeURIComponent(
                  `Assalamu Alaikum,\n\nI am interested in the upcoming project:\n*${project.name.en}*\nLocation: ${project.location.en}\n\nCould you please share details on:\n- Share price & payment plan\n- Expected handover date\n- Available units\n\nThank you.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                id={`register-interest-${project.id}`}
              >
                {t({ en: "Register Interest", bn: "আগ্রহ জানান" })}
                <ArrowRight className="ml-3 w-4 h-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div>
            <Button
              asChild
              className="rounded-none px-8 py-6 bg-gray-900 hover:bg-[#064E3B] text-white font-bold tracking-widest uppercase text-xs transition-all shadow-xl hover:shadow-[0_10px_30px_-15px_rgba(6,78,59,0.5)]"
            >
              <Link href={`/projects/${project.slug}`} id={`view-project-${project.id}`}>
                {t({ en: "View Project Details", bn: "প্রকল্পের বিস্তারিত দেখুন" })}
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
