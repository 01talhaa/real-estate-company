"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Upload, ImagePlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Event } from "@/types/event"
import { createEvent, updateEvent } from "@/app/admin/events/actions"

interface EventFormProps {
  mode?: "create" | "edit"
  eventId?: string
  initialData?: Partial<Event>
  onSuccess?: () => void
  onCancel?: () => void
}

const emptyText = () => ({ en: "", bn: "" });

const defaultEvent = (): Event => ({
  id: "",
  title: emptyText(),
  date: "",
  location: emptyText(),
  description: emptyText(),
  type: "announcement",
  displayImage: "",
  registrationLink: "",
  isUpcoming: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function normalizeEvent(event?: Partial<Event> | null): Event {
  const safeEvent = event ?? {};
  return {
    ...defaultEvent(),
    ...safeEvent,
    title: { en: safeEvent.title?.en ?? "", bn: safeEvent.title?.bn ?? "" },
    location: { en: safeEvent.location?.en ?? "", bn: safeEvent.location?.bn ?? "" },
    description: { en: safeEvent.description?.en ?? "", bn: safeEvent.description?.bn ?? "" },
    date: safeEvent.date ? safeEvent.date.slice(0, 16) : "",
  };
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-lg font-black text-slate-950">{title}</CardTitle>
        <CardDescription className="text-sm text-slate-500">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-6">{children}</CardContent>
    </Card>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{children}</Label>
}

export default function EventForm({ mode = "create", eventId, initialData, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Event>(() => normalizeEvent(initialData))
  const storageKey = mode === "edit" ? `admin-event-draft:${eventId || "unknown"}` : "admin-event-draft:new"

  const locationPreview = [formData.location.en, formData.location.bn].filter(Boolean).join(" · ")

  useEffect(() => {
    if (typeof window === "undefined") return

    const savedDraft = window.localStorage.getItem(storageKey)
    if (savedDraft) {
      try {
        setFormData(normalizeEvent(JSON.parse(savedDraft)))
        return
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }

    setFormData(normalizeEvent(initialData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(storageKey, JSON.stringify(formData))
  }, [formData, storageKey])

  function updateField<K extends keyof Event>(key: K, value: Event[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateText(field: "title" | "location" | "description", lang: 'en' | 'bn', value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || emptyText()),
        [lang]: value,
      },
    }))
  }

  async function uploadImage(file: File) {
    const uploadForm = new FormData()
    uploadForm.append("file", file)
    const response = await fetch("/api/upload/cloudinary", {
      method: "POST",
      body: uploadForm,
    })
    return response.json()
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const json = await uploadImage(file)
      if (json?.success) {
        updateField("displayImage", json.data.secure_url)
        toast.success("Event image uploaded")
      } else {
        toast.error(json?.error || "Upload failed")
      }
    } catch (error) {
      console.error(error)
      toast.error("Upload failed")
    } finally {
      setLoading(false)
      event.target.value = ""
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      if (!formData.id || !formData.title.en || !formData.title.bn || !formData.location.en || !formData.location.bn || !formData.description.en || !formData.description.bn || !formData.date || !formData.displayImage) {
        toast.error("Please fill all required fields")
        setLoading(false)
        return
      }

      const payload: Event = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      }

      if (mode === 'edit' && eventId) {
        await updateEvent(payload)
        toast.success("Event updated successfully")
      } else {
        await createEvent(payload)
        toast.success("Event created successfully")
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey)
      }
      onSuccess?.()
      if (!onSuccess) router.push("/admin/events")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "An error occurred while saving the event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-[2rem] border p-6 text-white shadow-2xl shadow-slate-900/20 ${mode === "edit" ? "border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950" : "border-emerald-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950"}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Event editor</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{mode === "edit" ? "Edit Event" : "Create New Event"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              {mode === "edit"
                ? "Update an existing event. The form mirrors the JSON structure used by the homepage and events page."
                : "Create a new event from scratch. The form mirrors the JSON structure used by the homepage and events page."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            <Upload className="h-3.5 w-3.5" />
            {mode === "edit" ? "Editing existing event" : "New event draft"}
          </div>
        </div>
      </div>

      <SectionCard title="Event Details" description="Title, timing, image, type, and RSVP link.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Event ID *</SectionLabel>
            <Input value={formData.id} onChange={(e) => updateField("id", e.target.value)} placeholder="project-launch-block-b-2025" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Date & Time *</SectionLabel>
            <Input type="datetime-local" value={formData.date} onChange={(e) => updateField("date", e.target.value)} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Title - English *</SectionLabel>
            <Input value={formData.title.en} onChange={(e) => updateText("title", "en", e.target.value)} placeholder="Project Launch: Sabit Khilgaon Block B" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Title - Bangla *</SectionLabel>
            <Input value={formData.title.bn} onChange={(e) => updateText("title", "bn", e.target.value)} placeholder="প্রকল্প উদ্বোধন: সাবিত খিলগাঁও ব্লক বি" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Location - English *</SectionLabel>
            <Input value={formData.location.en} onChange={(e) => updateText("location", "en", e.target.value)} placeholder="Khilgaon Community Hall, Dhaka" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Location - Bangla *</SectionLabel>
            <Input value={formData.location.bn} onChange={(e) => updateText("location", "bn", e.target.value)} placeholder="খিলগাঁও কমিউনিটি হল, ঢাকা" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Description - English *</SectionLabel>
            <Textarea rows={5} value={formData.description.en} onChange={(e) => updateText("description", "en", e.target.value)} placeholder="Join us for the official handover ceremony..." />
          </div>
          <div className="space-y-2">
            <SectionLabel>Description - Bangla *</SectionLabel>
            <Textarea rows={5} value={formData.description.bn} onChange={(e) => updateText("description", "bn", e.target.value)} placeholder="আনুষ্ঠানিক হস্তান্তর অনুষ্ঠানে যোগ দিন..." />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <SectionLabel>Event Type *</SectionLabel>
            <select
              value={formData.type}
              onChange={(e) => updateField("type", e.target.value as Event["type"])}
              className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-emerald-500"
            >
              <option value="announcement">announcement</option>
              <option value="event">event</option>
              <option value="milestone">milestone</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <SectionLabel>Registration Link</SectionLabel>
            <Input value={formData.registrationLink} onChange={(e) => updateField("registrationLink", e.target.value)} placeholder="https://wa.me/..." />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <SectionLabel>Display Image URL *</SectionLabel>
            <Input value={formData.displayImage} onChange={(e) => updateField("displayImage", e.target.value)} placeholder="Upload from device or paste Cloudinary URL" />
            {formData.displayImage ? <p className="break-all text-xs text-slate-500">{formData.displayImage}</p> : null}
          </div>
          <div className="space-y-2">
            <SectionLabel>Upload From Device</SectionLabel>
            <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <ImagePlus className="h-4 w-4" />
              Upload Display Image
            </label>
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <input type="checkbox" checked={formData.isUpcoming} onChange={(e) => updateField("isUpcoming", e.target.checked)} />
          Mark as upcoming event
        </label>
      </SectionCard>

      <SectionCard title="Live Preview" description="See what the events page card will look like.">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Event card preview</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${formData.isUpcoming ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {formData.isUpcoming ? "Upcoming" : "Past"}
              </span>
            </div>
            {formData.displayImage ? (
              <div className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <img src={formData.displayImage} alt={formData.title.en || "Event display"} className="h-48 w-full object-cover" />
              </div>
            ) : null}
            <h3 className="text-2xl font-black tracking-tight text-slate-950">{formData.title.en || "Event title"}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{locationPreview || "Event location preview"}</p>
            <p className="mt-4 text-sm leading-7 text-slate-500">{formData.description.en || "Event description preview will appear here."}</p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Preview data</p>
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">Date</div>
                <div className="mt-2 text-lg font-semibold text-white/90">{formData.date || "Select a date"}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">Type</div>
                <div className="mt-2 text-lg font-semibold text-white/90">{formData.type}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-white/45">RSVP</div>
                <div className="mt-2 break-all text-sm text-white/75">{formData.registrationLink || "No registration link yet"}</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="rounded-full bg-slate-950 px-6 hover:bg-slate-800" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? "Saving..." : eventId ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={() => (onCancel ? onCancel() : router.push("/admin/events"))}>
          Cancel
        </Button>
      </div>
    </form>
  )
}