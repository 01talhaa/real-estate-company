import { getProjects } from "@/app/admin/projects/actions"
import ProjectForm from "@/components/project-form"
import { notFound } from "next/navigation"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projectId = params.id
  const projects = await getProjects()
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-8 lg:px-10">
      <ProjectForm mode="edit" projectId={projectId} initialData={project} />
    </div>
  )
}
