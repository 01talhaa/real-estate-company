import ProjectForm from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 py-8 lg:px-10">
      <ProjectForm mode="create" />
    </div>
  )
}
