"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Project {
  id: string
  title: string
  client: string
  category: string
  description: string
  image?: string
  images?: string[]
  video?: string
  tags: string[]
  year?: string
}

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          // Get only first 4 projects
          const projectsData = data.data || data || []
          setProjects(projectsData.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-white via-sky-50 to-white">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Featured Projects</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700">Loading projects...</p>
        </div>
      </section>
    )
  }
  return (
    <section id="projects" className="container mx-auto px-4 py-12 sm:py-16 bg-gradient-to-b from-white via-sky-50 to-white">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Featured <span className="text-sky-500">Projects</span></h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-700">See how we've helped brands stand out with innovative design and creative solutions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button 
          asChild 
          size="lg"
          className="rounded-full bg-sky-500 px-8 text-white hover:bg-sky-600 shadow-lg shadow-sky-400/30"
        >
          <Link href="/projects">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/projects/${project.id}`}>
      <Card
        className="group liquid-glass border border-sky-200 bg-white/80 backdrop-blur-xl overflow-hidden transition-all hover:border-sky-300 hover:bg-white/90 h-full flex flex-col shadow-lg shadow-sky-200/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden bg-sky-100">
          {project.video ? (
            <>
              <video
                src={project.video}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent" />
            </>
          ) : (
            <>
              <img
                src={project.image || project.images?.[0] || "/placeholder.svg"}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 to-transparent" />
            </>
          )}

          {/* Play button overlay for video projects */}
          {project.video && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/90 backdrop-blur-sm shadow-lg">
                <Play className="h-7 w-7 text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-sky-600 border border-sky-300">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-1 text-sm text-gray-600">
            <span>{project.client}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-black group-hover:text-sky-500 transition-colors">
            {project.title}
          </h3>
          <p className="mb-3 text-gray-700 text-sm flex-grow line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs text-gray-700 border border-sky-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}