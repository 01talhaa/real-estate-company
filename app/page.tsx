import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import Script from "next/script"
import nextDynamic from "next/dynamic"

// Dynamic imports for below-the-fold components
const StatsSection = nextDynamic(() => import("@/components/stats-section").then((mod) => mod.StatsSection))
const ServicesSection = nextDynamic(() => import("@/components/services-section").then((mod) => mod.ServicesSection))
const FeaturedPropertiesSection = nextDynamic(() => import("@/components/featured-properties-section").then((mod) => mod.FeaturedPropertiesSection))
const GalleriesSection = nextDynamic(() => import("@/components/galleries-section").then((mod) => mod.GalleriesSection))
const BoardOfDirectorsSection = nextDynamic(() => import("@/components/board-of-directors-section").then((mod) => mod.BoardOfDirectorsSection))
const LatestInsightsSection = nextDynamic(() => import("@/components/latest-insights-section").then((mod) => mod.LatestInsightsSection))
const AppverseFooter = nextDynamic(() => import("@/components/appverse-footer").then((mod) => mod.AppverseFooter))
const WhatsAppButton = nextDynamic(() => import("@/components/whatsapp-button").then((mod) => mod.WhatsAppButton))

// Force dynamic rendering to fetch latest data
export const dynamic = "force-dynamic"

export default function Page() {
  // Structured data for real estate company
  const companyStructuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://sabitasset.com",
    name: "Sabit Asset Management LTD",
    description: "Strategic Real Estate Asset Management Services - Professional property management, investment advisory, and portfolio optimization in Bangladesh",
    url: "https://sabitasset.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD"
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh"
    },
    serviceType: [
      "Real Estate Asset Management",
      "Property Portfolio Management",
      "Investment Advisory",
      "Property Valuation",
      "Asset Optimization"
    ]
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />
        <Hero />
        <Features />
        
        {/* Corporate Milestones / Stats */}
        <StatsSection />

        {/* Core Services */}
        <ServicesSection />

        {/* Featured Properties Showcase */}
        <FeaturedPropertiesSection />

        {/* Visual Portfolio */}
        <GalleriesSection />

        {/* Leadership */}
        <BoardOfDirectorsSection />

        {/* Market Intelligence */}
        <LatestInsightsSection />

        {/* Completed Projects */}
        {/* <ProjectsSection /> */}

        <AppverseFooter />
      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* JSON-LD structured data */}
      <Script
        id="company-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(companyStructuredData),
        }}
      />
    </>
  )
}
