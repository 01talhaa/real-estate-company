"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ManagementMember } from "@/types/management"
import { createManagementMember, updateManagementMember } from "@/app/admin/management/actions"
import ImageUpload from "@/components/image-upload"

interface ManagementFormProps {
  mode?: "create" | "edit"
  memberId?: string
  initialData?: Partial<ManagementMember>
}

const emptyText = () => ({ en: "", bn: "" });

const defaultMember = (): ManagementMember => ({
  id: "",
  name: emptyText(),
  role: emptyText(),
  department: emptyText(),
  bio: emptyText(),
  image: "",
  linkedin: "",
  order: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function normalizeMember(member?: Partial<ManagementMember> | null): ManagementMember {
  const safeMember = member ?? {};
  return {
    ...defaultMember(),
    ...safeMember,
    name: { en: safeMember.name?.en ?? "", bn: safeMember.name?.bn ?? "" },
    role: { en: safeMember.role?.en ?? "", bn: safeMember.role?.bn ?? "" },
    department: { en: safeMember.department?.en ?? "", bn: safeMember.department?.bn ?? "" },
    bio: { en: safeMember.bio?.en ?? "", bn: safeMember.bio?.bn ?? "" },
  };
}

export default function ManagementForm({ mode = "create", memberId, initialData }: ManagementFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ManagementMember>(() => normalizeMember(initialData))

  useEffect(() => {
    setFormData(normalizeMember(initialData))
  }, [initialData])

  function updateField<K extends keyof ManagementMember>(key: K, value: ManagementMember[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateText(field: "name" | "role" | "department" | "bio", lang: 'en' | 'bn', value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] || emptyText()),
        [lang]: value,
      },
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const payload: ManagementMember = {
        ...formData,
        updatedAt: new Date().toISOString(),
        createdAt: mode === 'create' ? new Date().toISOString() : formData.createdAt,
      }

      if (mode === 'edit' && memberId) {
        await updateManagementMember(payload)
        toast.success("Team member updated successfully")
      } else {
        await createManagementMember(payload)
        toast.success("Team member created successfully")
      }
      router.push("/admin/management")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "edit" ? "Edit Team Member" : "Create New Team Member"}</CardTitle>
          <CardDescription>Fill in the details for the new team member.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={formData.id} onChange={(e) => updateField("id", e.target.value)} placeholder="e.g., 'john-doe'" disabled={mode === 'edit'} />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={formData.order} onChange={(e) => updateField("order", parseInt(e.target.value, 10))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name (English)</Label>
              <Input value={formData.name.en} onChange={(e) => updateText("name", "en", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Name (Bangla)</Label>
              <Input value={formData.name.bn} onChange={(e) => updateText("name", "bn", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role (English)</Label>
              <Input value={formData.role.en} onChange={(e) => updateText("role", "en", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role (Bangla)</Label>
              <Input value={formData.role.bn} onChange={(e) => updateText("role", "bn", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department (English)</Label>
              <Input value={formData.department.en} onChange={(e) => updateText("department", "en", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Department (Bangla)</Label>
              <Input value={formData.department.bn} onChange={(e) => updateText("department", "bn", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bio (English)</Label>
            <Textarea value={formData.bio.en} onChange={(e) => updateText("bio", "en", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Bio (Bangla)</Label>
            <Textarea value={formData.bio.bn} onChange={(e) => updateText("bio", "bn", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => updateField("image", url)}
            />
          </div>

          <div className="space-y-2">
            <Label>LinkedIn Profile URL</Label>
            <Input value={formData.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} placeholder="https://www.linkedin.com/in/..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {mode === "edit" ? "Update Member" : "Create Member"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/management")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

