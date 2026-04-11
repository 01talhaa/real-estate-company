import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { BoardOfDirectorsSection } from "@/components/board-of-directors-section"
import { ManagementTeamSection } from "@/components/management-team-section"
import type { Metadata } from "next"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Our Team | Sabit Property Management Ltd.",
  description:
    "Meet the Board of Directors and Management Team behind Sabit Property Management Ltd. — committed to making homeownership accessible for every Bangladeshi family.",
  openGraph: {
    title: "Our Team | Sabit Property Management",
    description: "Leadership and management team dedicated to your homeownership dream.",
  },
}

export default function TeamPage() {
  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        {/* Page hero */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2f] py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-7xl text-center text-white">
            <p className="text-green-light/80 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              আমাদের দল · Our Team
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              People Who{" "}
              <span className="text-green-light">Make It Happen</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
              পরিচালনা পর্ষদ থেকে ব্যবস্থাপনা দল — প্রতিটি সদস্য আপনার স্বপ্নের জন্য কাজ করছেন।
            </p>
          </div>
        </div>

        {/* Board of Directors */}
        <BoardOfDirectorsSection />

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Management Team */}
        <ManagementTeamSection />

        <AppverseFooter />
      </main>
    </>
  )
}
