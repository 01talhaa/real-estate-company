"use client"

import { useState, useTransition } from "react"
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
  const [isPending, startTransition] = useTransition()
  const [memberToDelete, setMemberToDelete] = useState<ManagementMember | null>(null)

  const handleDelete = async () => {
    if (!memberToDelete) return

    startTransition(async () => {
      try {
        await deleteManagementMemberAction(memberToDelete.id)
        setMembers((current) => current.filter((member) => member.id !== memberToDelete.id))
        toast.success("Management member deleted successfully")
        setMemberToDelete(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete member")
      }
    })
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
            Management Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {members.length === 0 ? (
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