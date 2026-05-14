"use client"

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Upload, ImagePlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BilingualText } from "@/types"
import type { ManagementMember } from "@/src/lib/github/management-operations"

interface ManagementFormProps {
  mode?: "create" | "edit"
  memberId?: string
  initialData?: Partial<ManagementMember>
  onSuccess?: () => void
  onCancel?: () => void
}

type Draft = {
  id: string
  name: BilingualText
  role: BilingualText
  department: BilingualText
  bio: BilingualText
  image: string
  linkedin: string
}

const emptyText = (): BilingualText => ({ en: "", bn: "" })

const defaultDraft = (): Draft => ({
  id: "",
  name: emptyText(),
  role: emptyText(),
  department: emptyText(),
  bio: emptyText(),
  image: "",
  linkedin: "",
})

function normalize(member?: Partial<ManagementMember> | null): Draft {
  const safe = member ?? {}
  return {
    ...defaultDraft(),
    id: safe.id ?? "",
    name: { en: safe.name?.en ?? "", bn: safe.name?.bn ?? "" },
    role: { en: safe.role?.en ?? "", bn: safe.role?.bn ?? "" },
    department: { en: safe.department?.en ?? "", bn: safe.department?.bn ?? "" },
    bio: { en: safe.bio?.en ?? "", bn: safe.bio?.bn ?? "" },
    image: safe.image ?? "",
    linkedin: safe.linkedin ?? "",
  }
}

export default function ManagementForm({ mode = "create", memberId, initialData, onSuccess, onCancel }: ManagementFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Draft>(() => normalize(initialData))
  const storageKey = mode === "edit" ? `admin-management-draft:${memberId || "unknown"}` : "admin-management-draft:new"

  const previewTitle = useMemo(() => formData.name.en || "Management member", [formData.name.en])

  useEffect(() => {
    async function loadMember() {
      if (mode !== "edit" || !memberId) {
        // For "create" mode, load from localStorage if available
        if (typeof window !== "undefined") {
          const savedDraft = window.localStorage.getItem(storageKey)
          if (savedDraft) {
            try {
              setFormData(normalize(JSON.parse(savedDraft)))
            } catch {
              window.localStorage.removeItem(storageKey)
            }
          }
        }
        return
      }

      // For "edit" mode, always fetch fresh data
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/management/${memberId}`)
        const json = await response.json()
        if (json.success) {
          // Check for a more recent draft in localStorage
          const savedDraft = window.localStorage.getItem(storageKey)
          if (savedDraft) {
            try {
              const draftData = normalize(JSON.parse(savedDraft))
              // A simple check: if draft has a name, it might be intentional
              if (draftData.name.en || draftData.name.bn) {
                setFormData(draftData)
                toast.info("Loaded a saved draft for this member.")
                return
              }
            } catch {
              window.localStorage.removeItem(storageKey)
            }
          }
          // Otherwise, use fetched data
          setFormData(normalize(json.data))
        } else {
          toast.error(json.error || "Failed to load management member")
        }
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while loading the management member")
      } finally {
        setLoading(false)
      }
    }

    loadMember()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, mode, storageKey])

  useEffect(() => {
    if (typeof window === "undefined" || loading) return
    window.localStorage.setItem(storageKey, JSON.stringify(formData))
  }, [formData, storageKey, loading])

  function updateField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateText(field: "name" | "role" | "department" | "bio", lang: keyof BilingualText, value: string) {
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
        updateField("image", json.data.secure_url)
        toast.success("Profile image uploaded")
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
      if (!formData.id || !formData.name.en || !formData.name.bn || !formData.role.en || !formData.role.bn || !formData.department.en || !formData.department.bn || !formData.bio.en || !formData.bio.bn || !formData.image) {
        toast.error("Please fill all required fields")
        return
      }

      const url = memberId ? `/api/admin/management/${memberId}` : "/api/admin/management"
      const method = memberId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${memberId ? "update" : "create"} management member`)
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey)
      }

      toast.success(memberId ? "Management member updated successfully" : "Management member created successfully")
      onSuccess?.()
      if (!onSuccess) router.push("/admin/management")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "An error occurred while saving the management member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`rounded-[2rem] border p-6 text-white shadow-2xl shadow-slate-900/20 ${mode === "edit" ? "border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950" : "border-emerald-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950"}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Management editor</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">{mode === "edit" ? "Edit Member" : "Create New Member"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              {mode === "edit" ? "Update an existing management member profile." : "Create a management member profile with bilingual text and a Cloudinary image."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            <Upload className="h-3.5 w-3.5" />
            {mode === "edit" ? "Editing existing member" : "New member draft"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="text-lg font-black text-slate-950">Profile</CardTitle>
            <CardDescription className="text-sm text-slate-500">Identity, bilingual labels, and image upload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Member ID *</Label>
              <Input value={formData.id} onChange={(e) => updateField("id", e.target.value)} placeholder="chief-executive-officer" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name - English *</Label>
                <Input value={formData.name.en} onChange={(e) => updateText("name", "en", e.target.value)} placeholder="Md. Sabit Hossain" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name - Bangla *</Label>
                <Input value={formData.name.bn} onChange={(e) => updateText("name", "bn", e.target.value)} placeholder="মোঃ সাবিত হোসেন" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role - English *</Label>
                <Input value={formData.role.en} onChange={(e) => updateText("role", "en", e.target.value)} placeholder="Chief Executive Officer" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role - Bangla *</Label>
                <Input value={formData.role.bn} onChange={(e) => updateText("role", "bn", e.target.value)} placeholder="প্রধান নির্বাহী কর্মকর্তা" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Department - English *</Label>
                <Input value={formData.department.en} onChange={(e) => updateText("department", "en", e.target.value)} placeholder="Executive" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Department - Bangla *</Label>
                <Input value={formData.department.bn} onChange={(e) => updateText("department", "bn", e.target.value)} placeholder="নির্বাহী" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bio - English *</Label>
                <Textarea rows={5} value={formData.bio.en} onChange={(e) => updateText("bio", "en", e.target.value)} placeholder="Short bio in English..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bio - Bangla *</Label>
                <Textarea rows={5} value={formData.bio.bn} onChange={(e) => updateText("bio", "bn", e.target.value)} placeholder="বাংলা বায়ো..." />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Image URL *</Label>
                <Input value={formData.image} onChange={(e) => updateField("image", e.target.value)} placeholder="Upload from device or paste Cloudinary URL" />
                {formData.image ? <p className="break-all text-xs text-slate-500">{formData.image}</p> : null}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload From Device</Label>
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <ImagePlus className="h-4 w-4" />
                  Upload Image
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">LinkedIn URL</Label>
              <Input value={formData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.75rem] border-slate-200 bg-slate-950 text-white shadow-sm shadow-slate-200/40">
          <CardHeader className="border-b border-white/10 bg-white/5">
            <CardTitle className="text-lg font-black text-white">Live Preview</CardTitle>
            <CardDescription className="text-sm text-white/60">How this member appears on the management page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {formData.image ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img src={formData.image} alt={previewTitle} className="h-64 w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 text-sm text-white/50">
                Image preview will appear here.
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Name</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{formData.name.en || "Member name"}</h3>
              <p className="mt-1 text-sm text-white/65">{formData.name.bn || "সদস্যের নাম"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Role</p>
              <p className="mt-2 text-base font-semibold text-white/90">{formData.role.en || "Role title"}</p>
              <p className="mt-1 text-sm text-white/65">{formData.role.bn || "পদের নাম"}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">Department</p>
              <p className="mt-2 text-sm text-white/80">{formData.department.en || "Department"}</p>
            </div>

            <p className="text-sm leading-7 text-white/70">{formData.bio.en || "A short bio preview will appear here."}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="rounded-full bg-slate-950 px-6 hover:bg-slate-800" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {loading ? "Saving..." : memberId ? "Update Member" : "Create Member"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={() => (onCancel ? onCancel() : router.push("/admin/management"))}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
