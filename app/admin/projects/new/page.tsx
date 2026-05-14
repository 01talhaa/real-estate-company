"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ProjectForm from "@/components/project-form"

export default function NewProjectPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

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
        <h1 className="text-3xl font-black text-slate-950">Create New Project</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fill in all the details to create a new project
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  )
}
