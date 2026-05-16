"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Users, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ManagementMember } from "@/types/management"
import { deleteManagementMemberAction } from "./actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ManagementClientPage({ members: initialMembers }: { members: ManagementMember[] }) {
  const [members, setMembers] = useState(initialMembers)
  const [isLoading, setIsLoading] = useState(initialMembers.length === 0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [memberToDelete, setMemberToDelete] = useState<ManagementMember | null>(null)

  const fetchMembers = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const response = await fetch("/api/management", { cache: "no-store" })
      const json = await response.json()
      if (json?.success && Array.isArray(json.data)) {
        setMembers(json.data)
      }
    } catch (error) {
      toast.error("Failed to load team")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers(initialMembers.length === 0)
  }, [fetchMembers, initialMembers.length])

  const handleDelete = async () => {
    if (!memberToDelete) return

    startTransition(async () => {
      try {
        setMembers((current) => current.filter((member) => member.id !== memberToDelete.id))
        await deleteManagementMemberAction(memberToDelete.id)
        toast.success("Management member deleted successfully")
        setMemberToDelete(null)
        fetchMembers()
      } catch (error) {
        await fetchMembers()
        toast.error(error instanceof Error ? error.message : "Failed to delete member")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Management</h1>
          <p className="mt-2 text-sm text-slate-500">Manage leadership profiles and keep the team directory up to date.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full border-slate-200 px-5" onClick={() => fetchMembers()} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button asChild className="rounded-full bg-slate-950 px-5 hover:bg-slate-800">
            <Link href="/admin/management/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50">
          <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-950">
            <Users className="h-5 w-5" />
            Management Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              Loading team...
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
              No management members found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id} className="flex flex-col overflow-hidden rounded-[1.5rem] border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {member.image ? (
                      <img src={member.image} alt={member.name.en} className="h-full w-full object-cover" />
                    ) : null}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge className="rounded-full bg-slate-950 text-white">{member.department.en}</Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge className="rounded-full bg-slate-50/80 text-slate-600 backdrop-blur-sm">
                        Order: {member.order}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-black text-slate-950">{member.name.en}</CardTitle>
                    <p className="text-sm text-slate-500">{member.role.en}</p>
                  </CardHeader>
                  <CardFooter className="mt-auto flex justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                      <Link href={`/admin/management/edit/${member.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => setMemberToDelete(member)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This will permanently delete the team member{" "}
                            <span className="font-bold">{memberToDelete?.name.en}</span>. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setMemberToDelete(null)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                            {isPending ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}