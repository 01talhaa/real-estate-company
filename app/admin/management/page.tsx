"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { ManagementMember } from "@/src/lib/github/management-operations"

export default function AdminManagementPage() {
  const [members, setMembers] = useState<ManagementMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/management")
      const json = await response.json()
      if (json.success) {
        setMembers(json.data)
      } else {
        toast.error(json.error || "Failed to load management members")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load management members")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this management member?")) return

    try {
      const response = await fetch(`/api/admin/management/${id}`, { method: "DELETE" })
      const json = await response.json()
      if (response.ok && json.success) {
        toast.success("Management member deleted successfully")
        setMembers((current) => current.filter((member) => member.id !== id))
      } else {
        toast.error(json.error || "Failed to delete management member")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete management member")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Management</h1>
          <p className="mt-2 text-sm text-slate-500">Manage the leadership and operations team with Cloudinary images.</p>
        </div>
        <Button asChild className="rounded-full bg-slate-950 px-5 hover:bg-slate-800">
          <Link href="/admin/management/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Link>
        </Button>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-950">
            <Users className="h-5 w-5" />
            Management Members
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading management members...</div>
          ) : members.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              No management members found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id} className="overflow-hidden rounded-[1.5rem] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {member.image ? (
                      <img src={member.image} alt={member.name.en} className="h-full w-full object-cover" />
                    ) : null}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge className="rounded-full bg-slate-950 text-white">{member.department.en}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-slate-950">{member.name.en}</CardTitle>
                    <p className="text-sm text-slate-500">{member.role.en}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600">{member.bio.en}</p>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 rounded-full">
                        <Link href={`/management/${member.id}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button asChild className="flex-1 rounded-full bg-slate-950 hover:bg-slate-800">
                        <Link href={`/admin/management/edit/${member.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button type="button" variant="destructive" className="rounded-full" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
