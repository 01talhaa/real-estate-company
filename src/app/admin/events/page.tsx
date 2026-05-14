"use client"

/**
 * Events management page
 */

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { SabitEvent } from "@/types"
import { EventFormSchema, SabitEventInput } from "@/lib/validations/event"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BilingualInput } from "@/components/admin/bilingual-input"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { TableSkeleton } from "@/components/admin/skeletons"
import { toast } from "sonner"

export default function EventsManagementPage() {
  const [events, setEvents] = useState<SabitEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<SabitEvent | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string }>({ open: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SabitEventInput>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: { en: "", bn: "" },
      date: new Date().toISOString(),
      location: { en: "", bn: "" },
      description: { en: "", bn: "" },
      type: "launch",
      registrationLink: "",
      isUpcoming: true,
    },
  })

  // Fetch events
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data.data || [])
    } catch (error) {
      toast.error("Failed to fetch events")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (formData: SabitEventInput) => {
    try {
      setIsSubmitting(true)

      const url = editingEvent ? `/api/admin/events/${editingEvent.id}` : "/api/admin/events"
      const method = editingEvent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Operation failed")
      }

      toast.success(result.message || "Event saved successfully")
      setIsDialogOpen(false)
      setEditingEvent(null)
      form.reset()
      await fetchEvents()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event: SabitEvent) => {
    setEditingEvent(event)
    form.reset({
      title: event.title,
      date: new Date(event.date).toISOString(),
      location: event.location,
      description: event.description,
      type: event.type,
      registrationLink: event.registrationLink || "",
      isUpcoming: event.isUpcoming,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteConfirm.id) return

    try {
      const response = await fetch(`/api/admin/events/${deleteConfirm.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete")
      }

      toast.success("Event deleted successfully")
      setDeleteConfirm({ open: false })
      await fetchEvents()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete"
      toast.error(message)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEvent(null)
    form.reset()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Manage company events and announcements</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={5} />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">No events yet</h3>
            <p className="text-gray-600 mt-2">Create your first event to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{event.title.en}</p>
                      <p className="text-sm text-gray-500 mt-1">{event.title.bn}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          event.isUpcoming
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(event)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm({ open: true, id: event.id })}
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
                {editingEvent ? "Edit Event" : "Create New Event"}
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
                  name="title"
                  label="Event Title"
                />
                <BilingualInput
                  control={form.control}
                  name="location"
                  label="Location"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <BilingualInput
                control={form.control}
                name="description"
                label="Event Description"
                type="textarea"
              />
            </div>

            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <Label>Event Date & Time</Label>
                  <Input
                    {...form.register("date")}
                    type="datetime-local"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Event Type</Label>
                  <select
                    {...form.register("type")}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="launch">Launch</option>
                    <option value="investor-meet">Investor Meet</option>
                    <option value="community">Community</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <Label>Status</Label>
                  <select
                    {...form.register("isUpcoming", { setValueAs: (v) => v === "true" })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="true">Upcoming</option>
                    <option value="false">Past</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Registration Link */}
            <div>
              <Label>Registration Link (Optional)</Label>
              <Input
                {...form.register("registrationLink")}
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
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open })}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  )
}
