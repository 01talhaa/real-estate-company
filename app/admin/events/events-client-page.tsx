"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Search, Sparkles, CalendarDays } from "lucide-react"
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
import { toast } from "sonner"
import { Event } from "@/types/event"
import { deleteEvent } from "./actions"

const typeBadge: Record<Event["type"], string> = {
  announcement: "bg-purple-100 text-purple-700 border-purple-200",
  event: "bg-blue-100 text-blue-700 border-blue-200",
  milestone: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

function safeText(value: unknown) {
  return typeof value === "string" ? value : ""
}

export default function EventsClientPage({ events }: { events: Event[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return events
    return events.filter((event) => {
      return [event.id, event.title.en, event.title.bn, event.location.en, event.location.bn, event.type]
        .map((value) => safeText(value))
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [events, searchTerm])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteEvent(deleteId)
      toast.success("Event deleted")
      setDeleteId(null)
    } catch (error) {
      toast.error("Failed to delete event")
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
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Events</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Manage announcements and event entries that power the events page and homepage section.
              </p>
            </div>
          </div>
          <Button onClick={() => router.push("/admin/events/new")} className="h-12 rounded-full bg-white px-6 font-semibold text-slate-950 hover:bg-slate-100">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by id, title, location, or type..."
            className="h-12 rounded-2xl border-slate-200 bg-white pl-11 shadow-sm"
          />
        </div>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <CalendarDays className="h-4 w-4 text-emerald-600" />
          {filtered.length} event{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
            No events found.
          </div>
        ) : (
          filtered.map((event) => (
            <article key={event.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="line-clamp-1 text-xl font-black text-slate-950">{event.title.en || event.id || "Untitled event"}</h3>
                      <Badge className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${typeBadge[event.type]}`}>
                        {event.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">{event.location.en || event.location.bn || "Location not set"}</p>
                    <p className="mt-1 text-xs text-slate-400">{event.id}</p>
                  </div>
                  <Badge className={event.isUpcoming ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}>
                    {event.isUpcoming ? "Upcoming" : "Past"}
                  </Badge>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-600">{event.description.en || event.description.bn || "No description provided"}</p>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500">{new Date(event.date).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => router.push(`/admin/events/edit/${event.id}`)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => setDeleteId(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete event?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the event from the GitHub JSON file.</AlertDialogDescription>
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
