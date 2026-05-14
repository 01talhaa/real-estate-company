import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Linkedin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getManagementMemberById, getManagementTeam } from "@/src/lib/github/management-operations"

export const dynamic = "force-static"
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const members = await getManagementTeam()
  return members.map((member) => ({ id: member.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getManagementMemberById(id)
  if (!member) return {}

  return {
    title: `${member.name.en} | Sabit Property Management Ltd.`,
    description: member.bio.en,
  }
}

export default async function ManagementMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getManagementMemberById(id)

  if (!member) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-white text-slate-950">
        <SiteHeader />

        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/management">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Management
            </Link>
          </Button>
        </div>

        <section className="container mx-auto px-4 py-10 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
              <img src={member.image} alt={member.name.en} className="h-full w-full object-cover" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{member.department.en}</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{member.name.en}</h1>
                <p className="mt-3 text-lg font-semibold text-emerald-700">{member.role.en}</p>
              </div>

              <Card className="rounded-[1.75rem] border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Bio</h2>
                  <p className="mt-4 text-base leading-8 text-slate-700">{member.bio.en}</p>
                  <p className="mt-3 text-base leading-8 text-slate-500">{member.bio.bn}</p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3">
                {member.linkedin ? (
                  <Button asChild className="rounded-full bg-slate-950 px-5 hover:bg-slate-800">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
