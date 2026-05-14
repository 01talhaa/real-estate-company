"use client"

/**
 * Projects management page
 */

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { RealEstateProject } from "@/types"
import { ProjectFormSchema, RealEstateProjectInput } from "@/lib/validations/project"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BilingualInput } from "@/components/admin/bilingual-input"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { TableSkeleton } from "@/components/admin/skeletons"
import { toast } from "sonner"

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<RealEstateProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<RealEstateProject | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RealEstateProjectInput>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      name: { en: "", bn: "" },
      location: { en: "", bn: "" },
      address: { en: "", bn: "" },
      coordinates: { lat: 0, lng: 0 },
      status: "upcoming",
      description: { en: "", bn: "" },
      image: "",
      gallery: [],
      amenities: {
        interior: [],
        exterior: [],
        building: [],
      },
    },
  })

  // Fetch projects
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/projects")
      if (!response.ok) throw new Error("Failed to fetch projects")
      const data = await response.json()
      setProjects(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch projects")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (formData: RealEstateProjectInput) => {
    try {
      setIsSubmitting(true)

      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : "/api/admin/projects"
      const method = editingProject ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Operation failed")
      }

      toast.success(result.message || "Project saved successfully")
      setIsDialogOpen(false)
      setEditingProject(null)
      form.reset()
      await fetchProjects()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (project: RealEstateProject) => {
    setEditingProject(project)
    form.reset(project)
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`/api/admin/projects/${deleteConfirm.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete")
      }

      toast.success("Project deleted successfully")
      setDeleteConfirm({ open: false })
      await fetchProjects()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete"
      toast.error(message)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProject(null)
    form.reset()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">Manage real estate projects and their details</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No projects yet</h3>
            <p className="text-gray-600 mt-2">Create your first project to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{project.name.en}</p>
                      <p className="text-sm text-gray-500 mt-1">{project.name.bn}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.location.en}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === "handover"
                            ? "bg-green-100 text-green-700"
                            : project.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {project.progressPercent ? `${project.progressPercent}%` : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm({ open: true, id: project.id })}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDialog}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <BilingualInput
                  control={form.control}
                  name="name"
                  label="Project Name"
                />
                <BilingualInput
                  control={form.control}
                  name="location"
                  label="Location"
                />
                <BilingualInput
                  control={form.control}
                  name="address"
                  label="Address"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <BilingualInput
                control={form.control}
                name="description"
                label="Description"
                type="textarea"
              />
            </div>

            {/* Status & Progress */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <select
                    {...form.register("status")}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="handover">Handover</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
                <div>
                  <Label>Progress %</Label>
                  <Input
                    {...form.register("progressPercent", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    max="100"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <Label>Featured Image URL</Label>
              <Input
                {...form.register("image")}
                type="url"
                placeholder="https://..."
                className="mt-2"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open })}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  )
}
