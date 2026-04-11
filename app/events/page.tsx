import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { EventsSection } from "@/components/events-section"
import type { Metadata } from "next"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Events & Announcements | Sabit Property Management Ltd.",
  description:
    "Stay updated with Sabit Property Management's latest project launches, investor meets, and community events across Khilgaon and Jodhivita, Dhaka.",
  openGraph: {
    title: "Events & Announcements | Sabit Property Management",
    description:
      "Project launches, investor meets, and community events — stay close to Sabit.",
  },
}

export default function EventsPage() {
  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        {/* Page hero strip */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#043d2f] py-16 sm:py-20">
          <div className="container mx-auto px-4 max-w-7xl text-center text-white">
            <p className="text-green-light/80 text-xs font-bold tracking-[0.3em] uppercase mb-4">
              ইভেন্ট ও ঘোষণা · Events & Announcements
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Stay{" "}
              <span className="text-green-light">Connected with Sabit</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
              আমাদের সর্বশেষ প্রকল্প উদ্বোধন, বিনিয়োগকারী সভা ও কমিউনিটি ইভেন্ট সম্পর্কে আপডেট থাকুন।
            </p>
          </div>
        </div>

        <EventsSection />

        <AppverseFooter />
      </main>
    </>
  )
}
