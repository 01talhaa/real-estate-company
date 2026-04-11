import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import Script from "next/script"
import nextDynamic from "next/dynamic"

// Immediately after hero
const OurStorySection = nextDynamic(() => import("@/components/our-story-section").then((m) => m.OurStorySection))
const WhyChooseSection = nextDynamic(() => import("@/components/why-choose-section").then((m) => m.WhyChooseSection))

// Below the fold — all lazy
const StatsSection = nextDynamic(() => import("@/components/stats-section").then((m) => m.StatsSection))
const ServicesSection = nextDynamic(() => import("@/components/services-section").then((m) => m.ServicesSection))
const ProjectsBilingualSection = nextDynamic(() => import("@/components/projects-bilingual-section").then((m) => m.ProjectsBilingualSection))
const GalleriesSection = nextDynamic(() => import("@/components/galleries-section").then((m) => m.GalleriesSection))
const BoardOfDirectorsSection = nextDynamic(() => import("@/components/board-of-directors-section").then((m) => m.BoardOfDirectorsSection))
const TestimonialsSection = nextDynamic(() => import("@/components/testimonials-section").then((m) => m.TestimonialsSection))
const EventsSection = nextDynamic(() => import("@/components/events-section").then((m) => m.EventsSection))
const LatestInsightsSection = nextDynamic(() => import("@/components/latest-insights-section").then((m) => m.LatestInsightsSection))
const AppverseFooter = nextDynamic(() => import("@/components/appverse-footer").then((m) => m.AppverseFooter))
const WhatsAppButton = nextDynamic(() => import("@/components/whatsapp-button").then((m) => m.WhatsAppButton))

export const dynamic = "force-static"

export default function Page() {
  const companyStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://sabitproperty.com",
    name: "Sabit Property Management Ltd.",
    alternateName: "সাবিত প্রপার্টি ম্যানেজমেন্ট লিঃ",
    description:
      "Share-based flat acquisition for middle-income Bangladeshi families in Khilgaon and Jodhivita, Dhaka",
    url: "https://sabitproperty.com",
    address: { "@type": "PostalAddress", addressCountry: "BD", addressLocality: "Dhaka" },
    areaServed: { "@type": "City", name: "Dhaka" },
    serviceType: ["Residential Flat Sales", "Share-Based Property Acquisition", "Property Management"],
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />

        {/* 1 — Hero (bilingual + animated headline) */}
        <Hero />

        {/* 2 — Our Story */}
        <OurStorySection />



        {/* 4 — Stats */}
        {/* <StatsSection /> */}

        {/* 5 — Services */}
        {/* <ServicesSection /> */}

        {/* 6 — Projects (alternating case-study layout, preview=3) */}
        <ProjectsBilingualSection preview />

        {/* 3 — Why Choose Sabit */}
        <WhyChooseSection />
        {/* 7 — Photo Galleries */}
        {/* <GalleriesSection /> */}

        {/* 8 — Board of Directors */}
        <BoardOfDirectorsSection />



        {/* 10 — Events preview */}
        <EventsSection preview />
        {/* 9 — Testimonials carousel */}
        <TestimonialsSection />

        {/* 11 — Market Insights */}
        {/* <LatestInsightsSection /> */}

        <AppverseFooter />
      </main>

      <WhatsAppButton />

      <Script
        id="company-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyStructuredData) }}
      />
    </>
  )
}
