"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2, Search, Sparkles, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Project } from "@/types/project"
import { toast } from "sonner"
import { deleteProject } from "./actions"

const statusStyles: Record<string, string> = {
  handover: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-amber-100 text-amber-700 border-amber-200",
  upcoming: "bg-sky-100 text-sky-700 border-sky-200",
}

function safeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback
}

export default function ProjectsClientPage({ projects: initialProjects }: { projects: Project[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchProjects = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const response = await fetch("/api/projects", { cache: "no-store" })
      const data = await response.json()
      if (data?.success && Array.isArray(data.data)) {
        setProjects(data.data)
      }
    } catch (error) {
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects(initialProjects.length === 0)
  }, [fetchProjects, initialProjects.length])

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return projects
    return projects.filter((project) => {
      return [
        project.id,
        project.slug,
        safeText(project.name?.en),
        safeText(project.name?.bn),
        safeText(project.location?.en),
        safeText(project.location?.bn),
        safeText(project.address?.en),
        safeText(project.address?.bn),
        project.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [projects, searchTerm])

  const openCreate = () => {
    router.push("/admin/projects/new")
  }

  const openEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setProjects((current) => current.filter((project) => project.id !== deleteId))
      await deleteProject(deleteId)
      toast.success("Project deleted")
      setDeleteId(null)
      fetchProjects()
    } catch (error) {
      await fetchProjects()
      toast.error("Failed to delete project")
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Real-Estate CMS
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Projects</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Manage real-estate projects with real-time updates and publishing controls.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="h-12 rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white/20" onClick={() => fetchProjects()} disabled={isRefreshing}>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button onClick={openCreate} className="h-12 rounded-full bg-white px-6 font-semibold text-slate-950 hover:bg-slate-100">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by id, slug, location, address, or status..."
            className="h-12 rounded-2xl border-slate-200 bg-white pl-11 shadow-sm"
          />
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <MapPin className="h-4 w-4 text-emerald-600" />
          {filteredProjects.length} project{filteredProjects.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading projects...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            No projects found.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name?.en || project.slug || "Project image"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge className="rounded-full border-white/10 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur">
                    {project.status}
                  </Badge>
                  <Badge className="rounded-full border-white/10 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur">
                    {project.slug}
                  </Badge>
                  <Badge className="rounded-full border-white/10 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur">
                    {project.id}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="line-clamp-1 text-xl font-black text-slate-950">{project.name?.en || project.slug || "Untitled project"}</h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                      {project.floors || 0} floors
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-500">{project.location?.en || project.address?.en || "Location not set"}</p>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-600">{project.description?.en || project.description?.bn || "No description provided"}</p>

                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[project.status] || statusStyles.upcoming}`}>
                    {project.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {project.coordinates?.lat?.toFixed ? project.coordinates.lat.toFixed(4) : "0.0000"}, {project.coordinates?.lng?.toFixed ? project.coordinates.lng.toFixed(4) : "0.0000"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Button variant="outline" className="rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50" onClick={() => setSelectedProject(project)}>
                    Preview
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => openEdit(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteId(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-[2rem] border-slate-200 bg-white p-0">
          {selectedProject && (
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                <img src={selectedProject.image} alt={selectedProject.name.en} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-5 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full bg-slate-900 px-3 py-1 text-white">{selectedProject.status}</Badge>
                  <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{selectedProject.slug}</Badge>
                  <Badge className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{selectedProject.id}</Badge>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {selectedProject.floors || 0} floors
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-950">{selectedProject.name.en}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{selectedProject.location?.en || selectedProject.address?.en || "Location not set"}</p>
                </div>
                <p className="text-sm leading-7 text-slate-600">{selectedProject.longDescription?.en || selectedProject.description?.en || selectedProject.description?.bn || "No description provided"}</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Financials</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      <li>Share price: {selectedProject.financials?.sharePrice ?? "N/A"}</li>
                      <li>Price per sqft: {selectedProject.financials?.pricePerSqft ?? "N/A"}</li>
                      <li>ROI: {selectedProject.financials?.expectedROI ?? "N/A"}%</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Highlights</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      <li>{selectedProject.gallery?.length || 0} gallery images</li>
                      <li>{selectedProject.nearbyPlaces?.length || 0} nearby places</li>
                      <li>{selectedProject.flats || 0} flats</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the project from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
