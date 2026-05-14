"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { RealEstateProject } from "@/types"

export function ProjectsSection() {
  const [projects, setProjects] = useState<RealEstateProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) return
        const data = await response.json()
        if (mounted) {
          setProjects((data.data || data || []).slice(0, 4))
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProjects()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-14 flex flex-col gap-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Projects
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Featured <span className="text-emerald-700">Projects</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-slate-600">
            A fast, polished preview of the real-estate projects stored in the JSON CMS.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-[1.75rem] bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="group h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-2xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={project.image}
                      alt={project.name.en}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {project.status}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{project.floors || 0} floors</span>
                    </div>
                    <h3 className="line-clamp-1 text-xl font-black text-slate-950">{project.name.en}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">{project.description.en}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="rounded-full bg-slate-950 px-8 shadow-lg hover:bg-slate-800">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
