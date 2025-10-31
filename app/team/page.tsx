import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Mail } from "lucide-react"
import Link from "next/link"
import { getAllTeamMembersForBuild } from "@/lib/get-team"

export const dynamic = 'force-static'
export const revalidate = 60

export const metadata = {
  title: "Our Team | Sabit Asset Management - Meet Our Experts",
  description:
    "Meet the talented team behind Sabit Asset Management LTD. Our professionals bring years of experience in real estate asset management, investment advisory, and portfolio optimization.",
}

async function getTeamMembers() {
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (isProductionBuild) {
    return await getAllTeamMembersForBuild()
  }

  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/team`, {
      next: { revalidate: 60 }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.data : []
    }
  } catch (error) {
    console.error('API fetch failed, falling back to database:', error)
  }
  
  return await getAllTeamMembersForBuild()
}

function getAllDepartments(members: any[]) {
  if (!Array.isArray(members)) return ['All']
  const departments = new Set(members.map((m: any) => m.department))
  return ['All', ...Array.from(departments)]
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()
  const departments = getAllDepartments(teamMembers)
  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 bg-gradient-to-b from-white via-green-muted to-white">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-[#064E3B] mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-black">
              <span className="block">Meet Our</span>
              <span className="block text-green-dark drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">Creative Team</span>
            </h1>
            <p className="text-lg text-black sm:text-xl">
              Talented professionals passionate about bringing your vision to life through exceptional creative work
            </p>
          </div>
        </section>

        {/* Department Filter */}
        <section className="container mx-auto px-4 pb-8 bg-gradient-to-b from-green-muted to-white">
          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={dept === "All" ? "default" : "outline"}
                className={
                  dept === "All"
                    ? "rounded-full bg-green-dark text-white  shadow-lg "
                    : "rounded-full border-green-muted bg-white text-black hover:bg-green-muted"
                }
              >
                {dept}
              </Button>
            ))}
          </div>
        </section>

        {/* Team Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24 bg-gradient-to-b from-white to-green-muted">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Link key={member.id} href={`/team/${member.id}`}>
                <Card className="group liquid-glass border border-green-muted bg-white/80 backdrop-blur-xl overflow-hidden transition-all hover:border-green-light hover:bg-white/90 h-full shadow-lg shadow-green-muted/30">
                  <div className="relative aspect-square overflow-hidden bg-green-muted">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-green-dark/60 via-green-dark/10 to-transparent" />

                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-green-dark"
                        asChild
                      >
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-green-dark"
                        asChild
                      >
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-green-dark"
                        asChild
                      >
                        <a href={`mailto:${member.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {/* Department Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-green-dark border border-green-light">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-[#064E3B] mb-1 text-xl font-bold text-black group-hover:text-green-dark transition-colors">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-green-dark">{member.role}</p>
                    <p className="text-sm text-black line-clamp-2">{member.bio}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Join Team CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl text-center p-8 sm:p-12">
            <h2 className="text-[#064E3B] mb-4 text-3xl font-bold text-white sm:text-4xl">Want to Join Our Team?</h2>
            <p className="mb-8 text-lg text-gray-300">
              We're always looking for talented creatives to join our growing team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300"
            >
              <Link href="mailto:careers@sabitasset.com">View Open Positions</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
