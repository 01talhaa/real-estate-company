import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ServicesSection } from "@/components/services-section"
import { LogoMarquee } from "@/components/logo-marquee"
import { Pricing } from "@/components/pricing"
import { AppverseFooter } from "@/components/appverse-footer"
import { ProjectsSection } from "@/components/projects-section"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { FeaturedPropertiesSection } from "@/components/featured-properties-section"
import { LatestInsightsSection } from "@/components/latest-insights-section"
import { GalleriesSection } from "@/components/galleries-section"
import Script from "next/script"

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
        
        {/* Core Services */}
        <ServicesSection />
        
        {/* Featured Properties Showcase */}
        <FeaturedPropertiesSection />
        
        {/* Visual Portfolio */}
        <GalleriesSection />
        
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
