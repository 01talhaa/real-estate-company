"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Plus, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Amenity, BilingualText, NearbyPlace, RealEstateProject } from "@/types"

interface ProjectFormProps {
  mode?: "create" | "edit"
  projectId?: string
  initialData?: Partial<RealEstateProject>
  onSuccess?: () => void
  onCancel?: () => void
}

const emptyBilingual = (): BilingualText => ({ en: "", bn: "" })
const emptyAmenity = (): Amenity => ({ en: "", bn: "" })
const emptyNearbyPlace = (): NearbyPlace => ({
  category: "hospital",
  name: emptyBilingual(),
  distance: "",
})

const defaultProject = (): RealEstateProject => ({
  id: "",
  slug: "",
  name: emptyBilingual(),
  location: emptyBilingual(),
  address: emptyBilingual(),
  coordinates: { lat: 0, lng: 0 },
  status: "upcoming",
  description: emptyBilingual(),
  longDescription: emptyBilingual(),
  image: "",
  gallery: [],
  completionDate: "",
  progressPercent: 0,
  flats: 0,
  floors: 0,
  specifications: {
    totalAreaSqft: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    yearBuilt: 0,
  },
  amenities: {
    interior: [],
    exterior: [],
    building: [],
  },
  financials: {
    sharePrice: 0,
    pricePerSqft: 0,
    currency: "BDT",
    expectedROI: 0,
  },
  nearbyPlaces: [],
})

function normalizeBilingual(value?: Partial<BilingualText> | null): BilingualText {
  return {
    en: value?.en ?? "",
    bn: value?.bn ?? "",
  }
}

function normalizeProject(project?: Partial<RealEstateProject> | null): RealEstateProject {
  const safeProject = project ?? {}

  return {
    ...defaultProject(),
    ...safeProject,
    name: normalizeBilingual(safeProject.name),
    location: normalizeBilingual(safeProject.location),
    address: normalizeBilingual(safeProject.address),
    description: normalizeBilingual(safeProject.description),
    longDescription: normalizeBilingual(safeProject.longDescription),
    coordinates: {
      lat: safeProject.coordinates?.lat ?? 0,
      lng: safeProject.coordinates?.lng ?? 0,
    },
    gallery: safeProject.gallery ?? [],
    specifications: {
      totalAreaSqft: safeProject.specifications?.totalAreaSqft ?? 0,
      bedrooms: safeProject.specifications?.bedrooms ?? 0,
      bathrooms: safeProject.specifications?.bathrooms ?? 0,
      parkingSpaces: safeProject.specifications?.parkingSpaces ?? 0,
      yearBuilt: safeProject.specifications?.yearBuilt ?? 0,
    },
    amenities: {
      interior: safeProject.amenities?.interior ?? [],
      exterior: safeProject.amenities?.exterior ?? [],
      building: safeProject.amenities?.building ?? [],
    },
    financials: {
      sharePrice: safeProject.financials?.sharePrice ?? 0,
      pricePerSqft: safeProject.financials?.pricePerSqft ?? 0,
      currency: safeProject.financials?.currency ?? "BDT",
      expectedROI: safeProject.financials?.expectedROI ?? 0,
    },
    nearbyPlaces: safeProject.nearbyPlaces ?? [],
  }
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

function ArrayRow({
  children,
  onRemove,
}: {
  children: React.ReactNode
  onRemove: () => void
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="grid gap-3 md:grid-cols-3">{children}</div>
      <div className="flex justify-end md:justify-center">
        <Button type="button" variant="ghost" size="icon" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function ProjectForm({ mode = "create", projectId, initialData, onSuccess, onCancel }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RealEstateProject>(() => normalizeProject(initialData))
  const storageKey = mode === "edit" ? `admin-project-draft:${projectId || "unknown"}` : "admin-project-draft:new"
  const heroPreviewUrl = formData.image.trim()
  const galleryPreview = formData.gallery || []
  const locationQuery = [formData.address?.en, formData.location?.en]
    .filter(Boolean)
    .join(", ")
  const previewMapSrc = locationQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=16&output=embed`
    : ""

  useEffect(() => {
    if (typeof window === "undefined") return

    const savedDraft = window.localStorage.getItem(storageKey)
    if (savedDraft) {
      try {
        setFormData(normalizeProject(JSON.parse(savedDraft)))
        return
      } catch {
        window.localStorage.removeItem(storageKey)
      }
    }

    if (projectId && !initialData) {
      fetchProject()
      return
    }

    setFormData(normalizeProject(initialData))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, initialData, storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(storageKey, JSON.stringify(formData))
  }, [formData, storageKey])

  async function fetchProject() {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`)
      const json = await response.json()
      if (json.success) {
        setFormData(normalizeProject(json.data))
      } else {
        toast.error(json.error || "Failed to load project")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while loading the project")
    }
  }

  function updateField<K extends keyof RealEstateProject>(key: K, value: RealEstateProject[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateBilingual(field: "name" | "location" | "address" | "description" | "longDescription", lang: keyof BilingualText, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || emptyBilingual()),
        [lang]: value,
      },
    }))
  }

  function updateCoordinates(key: keyof RealEstateProject["coordinates"], value: number) {
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [key]: value,
      },
    }))
  }

  function updateSpecifications(key: keyof NonNullable<RealEstateProject["specifications"]>, value: number) {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [key]: value,
      },
    }))
  }

  function updateFinancials(key: keyof NonNullable<RealEstateProject["financials"]>, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      financials: {
        ...(prev.financials || { currency: "BDT" }),
        [key]: value,
      },
    }))
  }

  function updateAmenityList(section: keyof NonNullable<RealEstateProject["amenities"]>, index: number, key: keyof Amenity, value: string) {
    setFormData((prev) => {
      const nextSection = [...(prev.amenities?.[section] || [])]
      nextSection[index] = {
        ...(nextSection[index] || emptyAmenity()),
        [key]: value,
      }
      return {
        ...prev,
        amenities: {
          ...(prev.amenities || { interior: [], exterior: [], building: [] }),
          [section]: nextSection,
        },
      }
    })
  }

  function addAmenity(section: keyof NonNullable<RealEstateProject["amenities"]>) {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...(prev.amenities || { interior: [], exterior: [], building: [] }),
        [section]: [...(prev.amenities?.[section] || []), emptyAmenity()],
      },
    }))
  }

  function removeAmenity(section: keyof NonNullable<RealEstateProject["amenities"]>, index: number) {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...(prev.amenities || { interior: [], exterior: [], building: [] }),
        [section]: (prev.amenities?.[section] || []).filter((_, itemIndex) => itemIndex !== index),
      },
    }))
  }

  function updateNearbyPlace(index: number, key: keyof NearbyPlace, value: string) {
    setFormData((prev) => {
      const nextNearby = [...(prev.nearbyPlaces || [])]
      const current = nextNearby[index] || emptyNearbyPlace()

      if (key === "category") {
        nextNearby[index] = { ...current, category: value as NearbyPlace["category"] }
      } else if (key === "distance") {
        nextNearby[index] = { ...current, distance: value }
      } else if (key === "name") {
        nextNearby[index] = { ...current, name: normalizeBilingual({ en: value, bn: current.name.bn }) }
      }

      return { ...prev, nearbyPlaces: nextNearby }
    })
  }

  function updateNearbyPlaceText(index: number, lang: keyof BilingualText, value: string) {
    setFormData((prev) => {
      const nextNearby = [...(prev.nearbyPlaces || [])]
      const current = nextNearby[index] || emptyNearbyPlace()
      nextNearby[index] = {
        ...current,
        name: {
          ...current.name,
          [lang]: value,
        },
      }
      return { ...prev, nearbyPlaces: nextNearby }
    })
  }

  function addNearbyPlace() {
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: [...(prev.nearbyPlaces || []), emptyNearbyPlace()],
    }))
  }

  function removeNearbyPlace(index: number) {
    setFormData((prev) => ({
      ...prev,
      nearbyPlaces: (prev.nearbyPlaces || []).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function uploadFile(file: File) {
    const uploadForm = new FormData()
    uploadForm.append("file", file)
    const response = await fetch("/api/upload/cloudinary", {
      method: "POST",
      body: uploadForm,
    })
    return response.json()
  }

  async function handleHeroUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const json = await uploadFile(file)
      if (json?.success) {
        updateField("image", json.data.secure_url)
        toast.success("Hero image uploaded")
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

  async function handleGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setLoading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of files) {
        const json = await uploadFile(file)
        if (json?.success && json.data?.secure_url) {
          uploadedUrls.push(json.data.secure_url)
        }
      }

      if (uploadedUrls.length > 0) {
        updateField("gallery", [...(formData.gallery || []), ...uploadedUrls])
        toast.success("Gallery images uploaded")
      } else {
        toast.error("No images were uploaded")
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
      const payload = normalizeProject(formData)

      if (!payload.id || !payload.slug || !payload.name.en || !payload.name.bn) {
        toast.error("Please fill all required fields")
        return
      }

      const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects"
      const method = projectId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${projectId ? "update" : "create"} project`)
      }

      toast.success(projectId ? "Project updated successfully" : "Project created successfully")
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey)
      }
      onSuccess?.()
      if (!onSuccess) router.push("/admin/projects")
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred while saving the project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-[2rem] border p-6 text-white shadow-2xl shadow-slate-900/20 ${mode === "edit" ? "border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950" : "border-emerald-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950"}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Project editor</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{mode === "edit" ? "Edit Project" : "Create New Project"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              {mode === "edit"
                ? "Update an existing project. The form mirrors the JSON structure, so every saved field stays consistent."
                : "Start a brand-new project from scratch. The form mirrors the JSON structure, so non-technical admins can add every field without raw JSON."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            <Upload className="h-3.5 w-3.5" />
            {mode === "edit" ? "Editing existing project" : "New project draft"}
          </div>
        </div>
      </div>

      <SectionCard title="Basic Information" description="Core identity, bilingual text, and the primary hero image.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Project ID *</SectionLabel>
            <Input value={formData.id} onChange={(e) => updateField("id", e.target.value)} placeholder="khilgaon-residency-a" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Slug *</SectionLabel>
            <Input value={formData.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="khilgaon-residency-a" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Name - English *</SectionLabel>
            <Input value={formData.name.en} onChange={(e) => updateBilingual("name", "en", e.target.value)} placeholder="Sabit Khilgaon Residency" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Name - Bangla *</SectionLabel>
            <Input value={formData.name.bn} onChange={(e) => updateBilingual("name", "bn", e.target.value)} placeholder="সাবিত খিলগাঁও রেসিডেন্সি" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Location - English *</SectionLabel>
            <Input value={formData.location.en} onChange={(e) => updateBilingual("location", "en", e.target.value)} placeholder="Khilgaon Thana Residential Area, Dhaka" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Location - Bangla *</SectionLabel>
            <Input value={formData.location.bn} onChange={(e) => updateBilingual("location", "bn", e.target.value)} placeholder="খিলগাঁও থানা আবাসিক এলাকা, ঢাকা" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Address - English *</SectionLabel>
            <Textarea value={formData.address.en} onChange={(e) => updateBilingual("address", "en", e.target.value)} rows={3} placeholder="Khilgaon Thana Residential Area, Khilgaon, Dhaka-1219" />
          </div>
          <div className="space-y-2">
            <SectionLabel>Address - Bangla *</SectionLabel>
            <Textarea value={formData.address.bn} onChange={(e) => updateBilingual("address", "bn", e.target.value)} rows={3} placeholder="খিলগাঁও থানা আবাসিক এলাকা, খিলগাঁও, ঢাকা-১২১৯" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <SectionLabel>Status *</SectionLabel>
            <Select value={formData.status} onValueChange={(value) => updateField("status", value as RealEstateProject["status"]) }>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="handover">handover</SelectItem>
                <SelectItem value="ongoing">ongoing</SelectItem>
                <SelectItem value="upcoming">upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <SectionLabel>Latitude *</SectionLabel>
            <Input type="number" step="any" value={formData.coordinates.lat} onChange={(e) => updateCoordinates("lat", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Longitude *</SectionLabel>
            <Input type="number" step="any" value={formData.coordinates.lng} onChange={(e) => updateCoordinates("lng", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Completion Date</SectionLabel>
            <Input value={formData.completionDate || ""} onChange={(e) => updateField("completionDate", e.target.value)} placeholder="2025-06" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-2">
            <SectionLabel>Hero Image URL *</SectionLabel>
            <div className="flex flex-col gap-3 md:flex-row">
              <Input value={formData.image} onChange={(e) => updateField("image", e.target.value)} placeholder="Upload from device or paste Cloudinary URL" />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
                <Upload className="h-4 w-4" />
                Upload Image
              </label>
            </div>
            {formData.image ? <p className="text-xs text-slate-500 break-all">{formData.image}</p> : null}
          </div>
          <div className="space-y-2">
            <SectionLabel>Quick Stats</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Flats</Label>
                <Input type="number" value={formData.flats ?? 0} onChange={(e) => updateField("flats", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Floors</Label>
                <Input type="number" value={formData.floors ?? 0} onChange={(e) => updateField("floors", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Progress %</Label>
                <Input type="number" min="0" max="100" value={formData.progressPercent ?? 0} onChange={(e) => updateField("progressPercent", Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Gallery Count</Label>
                <Input value={(formData.gallery || []).length} readOnly />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Live Preview" description="See the location, hero image, and gallery exactly as they are being built.">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950 text-white shadow-lg">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Location preview</p>
              <h3 className="mt-1 text-xl font-black">{formData.name.en || "Project location"}</h3>
              <p className="mt-1 text-sm leading-6 text-white/70">{locationQuery || "Add address and location details to preview the map."}</p>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4 bg-slate-950 p-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Address</p>
                  <p className="mt-2 text-sm leading-7 text-white/85">{formData.address.en || "English address not set"}</p>
                  <p className="mt-3 text-sm leading-7 text-white/65">{formData.address.bn || "বাংলা ঠিকানা যোগ করুন"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Latitude</p>
                    <p className="mt-2 text-lg font-black">{formData.coordinates.lat || 0}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Longitude</p>
                    <p className="mt-2 text-lg font-black">{formData.coordinates.lng || 0}</p>
                  </div>
                </div>
              </div>

              <div className="min-h-[320px] bg-slate-100">
                {previewMapSrc ? (
                  <iframe
                    title="Project location preview"
                    src={previewMapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 320 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="min-h-[320px] w-full"
                  />
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-sm text-slate-500">
                    Map preview will appear here after you enter the project address or location.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Hero image preview</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{formData.name.en || "Hero image"}</h3>
              </div>
              <div className="bg-slate-100">
                {heroPreviewUrl ? (
                  <img src={heroPreviewUrl} alt={formData.name.en || "Project hero preview"} className="h-72 w-full object-cover" />
                ) : (
                  <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-slate-500">
                    Upload a hero image to preview it here.
                  </div>
                )}
              </div>
              <div className="px-5 py-4 text-sm text-slate-500">
                This is the primary image that will appear on the project card and detail page.
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Gallery preview</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">{galleryPreview.length} image{galleryPreview.length === 1 ? "" : "s"}</h3>
              </div>
              {galleryPreview.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                  {galleryPreview.slice(0, 6).map((src, index) => (
                    <div key={`${src}-${index}`} className="overflow-hidden rounded-2xl bg-slate-100">
                      <img src={src} alt={`Gallery preview ${index + 1}`} className="h-28 w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                  Gallery images you upload will appear here immediately.
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Descriptions" description="Short and long bilingual copy for project pages and cards.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Short Description - English *</SectionLabel>
            <Textarea rows={5} value={formData.description.en} onChange={(e) => updateBilingual("description", "en", e.target.value)} placeholder="A 6-storey residential building..." />
          </div>
          <div className="space-y-2">
            <SectionLabel>Short Description - Bangla *</SectionLabel>
            <Textarea rows={5} value={formData.description.bn} onChange={(e) => updateBilingual("description", "bn", e.target.value)} placeholder="৬ তলা আবাসিক ভবনে..." />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <SectionLabel>Long Description - English</SectionLabel>
            <Textarea rows={8} value={formData.longDescription?.en || ""} onChange={(e) => updateBilingual("longDescription", "en", e.target.value)} placeholder="Detailed English project overview..." />
          </div>
          <div className="space-y-2">
            <SectionLabel>Long Description - Bangla</SectionLabel>
            <Textarea rows={8} value={formData.longDescription?.bn || ""} onChange={(e) => updateBilingual("longDescription", "bn", e.target.value)} placeholder="বিস্তারিত বাংলা প্রকল্প বিবরণ..." />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Media" description="Upload from device to Cloudinary and manage the full gallery.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Gallery Images</p>
              <p className="text-sm text-slate-500">Add one or more images from the device, then save their Cloudinary URLs in the JSON.</p>
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
              <Plus className="h-4 w-4" />
              Upload Gallery
            </label>
          </div>

          {(formData.gallery || []).length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(formData.gallery || []).map((src, index) => (
                <div key={`${src}-${index}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="aspect-[4/3] bg-slate-100">
                    <img src={src} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-3 p-4">
                    <Input value={src} onChange={(e) => updateField("gallery", (formData.gallery || []).map((item, itemIndex) => itemIndex === index ? e.target.value : item))} />
                    <div className="flex items-center justify-between gap-2">
                      <a href={src} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Open</a>
                      <Button type="button" variant="ghost" size="sm" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => updateField("gallery", (formData.gallery || []).filter((_, itemIndex) => itemIndex !== index))}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No gallery images yet. Upload from device to add them.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Specifications" description="Physical project measurements and apartment details.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <SectionLabel>Total Area (sqft)</SectionLabel>
            <Input type="number" value={formData.specifications?.totalAreaSqft ?? 0} onChange={(e) => updateSpecifications("totalAreaSqft", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Bedrooms</SectionLabel>
            <Input type="number" value={formData.specifications?.bedrooms ?? 0} onChange={(e) => updateSpecifications("bedrooms", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Bathrooms</SectionLabel>
            <Input type="number" value={formData.specifications?.bathrooms ?? 0} onChange={(e) => updateSpecifications("bathrooms", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Parking Spaces</SectionLabel>
            <Input type="number" value={formData.specifications?.parkingSpaces ?? 0} onChange={(e) => updateSpecifications("parkingSpaces", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Year Built</SectionLabel>
            <Input type="number" value={formData.specifications?.yearBuilt ?? 0} onChange={(e) => updateSpecifications("yearBuilt", Number(e.target.value))} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Financials" description="Pricing and expected returns for shareholders.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <SectionLabel>Share Price</SectionLabel>
            <Input type="number" value={formData.financials?.sharePrice ?? 0} onChange={(e) => updateFinancials("sharePrice", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Price Per Sqft</SectionLabel>
            <Input type="number" value={formData.financials?.pricePerSqft ?? 0} onChange={(e) => updateFinancials("pricePerSqft", Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Currency</SectionLabel>
            <Input value={formData.financials?.currency || "BDT"} onChange={(e) => updateFinancials("currency", e.target.value)} />
          </div>
          <div className="space-y-2">
            <SectionLabel>Expected ROI %</SectionLabel>
            <Input type="number" value={formData.financials?.expectedROI ?? 0} onChange={(e) => updateFinancials("expectedROI", Number(e.target.value))} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Amenities" description="Edit the complete interior, exterior, and building amenity lists.">
        {(["interior", "exterior", "building"] as const).map((section) => (
          <div key={section} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-700">{section}</h4>
                <p className="text-sm text-slate-500">Add bilingual amenity labels one by one.</p>
              </div>
              <Button type="button" variant="outline" className="rounded-full" onClick={() => addAmenity(section)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.amenities?.[section] || []).length > 0 ? (
                (formData.amenities?.[section] || []).map((item, index) => (
                  <ArrayRow key={`${section}-${index}`} onRemove={() => removeAmenity(section, index)}>
                    <div className="space-y-2">
                      <SectionLabel>English</SectionLabel>
                      <Input value={item.en} onChange={(e) => updateAmenityList(section, index, "en", e.target.value)} placeholder="Ceramic Tile Flooring" />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Bangla</SectionLabel>
                      <Input value={item.bn} onChange={(e) => updateAmenityList(section, index, "bn", e.target.value)} placeholder="সিরামিক টাইল মেঝে" />
                    </div>
                    <div className="space-y-2">
                      <SectionLabel>Preview</SectionLabel>
                      <Input value={`${item.en} / ${item.bn}`} readOnly />
                    </div>
                  </ArrayRow>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                  No items yet. Add the first amenity for this section.
                </div>
              )}
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Nearby Places" description="Edit all nearby amenities and transport links around the project.">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Nearby Places</p>
            <p className="text-sm text-slate-500">Each item supports bilingual names and a simple distance string like 0.5 km.</p>
          </div>
          <Button type="button" variant="outline" className="rounded-full" onClick={addNearbyPlace}>
            <Plus className="mr-2 h-4 w-4" />
            Add Nearby Place
          </Button>
        </div>

        <div className="space-y-3">
          {(formData.nearbyPlaces || []).length > 0 ? (
            (formData.nearbyPlaces || []).map((place, index) => (
              <div key={`${place.category}-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-700">Nearby Place {index + 1}</h4>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => removeNearbyPlace(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <SectionLabel>Category</SectionLabel>
                    <Select value={place.category} onValueChange={(value) => updateNearbyPlace(index, "category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">hospital</SelectItem>
                        <SelectItem value="school">school</SelectItem>
                        <SelectItem value="college">college</SelectItem>
                        <SelectItem value="university">university</SelectItem>
                        <SelectItem value="mall">mall</SelectItem>
                        <SelectItem value="park">park</SelectItem>
                        <SelectItem value="mosque">mosque</SelectItem>
                        <SelectItem value="transport">transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Name - English</SectionLabel>
                    <Input value={place.name?.en || ""} onChange={(e) => updateNearbyPlaceText(index, "en", e.target.value)} placeholder="Khilgaon General Hospital" />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Name - Bangla</SectionLabel>
                    <Input value={place.name?.bn || ""} onChange={(e) => updateNearbyPlaceText(index, "bn", e.target.value)} placeholder="খিলগাঁও জেনারেল হাসপাতাল" />
                  </div>
                  <div className="space-y-2">
                    <SectionLabel>Distance</SectionLabel>
                    <Input value={place.distance || ""} onChange={(e) => updateNearbyPlace(index, "distance", e.target.value)} placeholder="0.4 km" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No nearby places added yet.
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="rounded-full bg-slate-950 px-6 hover:bg-slate-800" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? "Saving..." : projectId ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={() => (onCancel ? onCancel() : router.push("/admin/projects"))}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
