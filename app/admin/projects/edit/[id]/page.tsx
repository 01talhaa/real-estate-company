"use client"

import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"
import ProjectForm from "@/components/project-form"

export default function EditProjectPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-8 lg:px-10">
      <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Edit Project</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update the project details
        </p>
      </div>

      <ProjectForm mode="edit" projectId={projectId} />
    </div>
  )
}
