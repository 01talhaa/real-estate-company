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
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://sabitasset.com/#pricing",
    name: "Service Packages",
    description: "Real estate asset management service packages including portfolio management, investment advisory, property valuation, and asset optimization",
    url: "https://sabitasset.com/#pricing",
    mainEntity: {
      "@type": "PriceSpecification",
      name: "Asset Management Services",
      description: "Professional real estate asset management services with comprehensive packages",
      offers: [
        {
          "@type": "Offer",
          name: "Portfolio Assessment",
          price: "50000",
          priceCurrency: "BDT",
          description: "Comprehensive property portfolio analysis and strategic recommendations",
        },
        {
          "@type": "Offer",
          name: "Property Management",
          price: "150000",
          priceCurrency: "BDT",
          description: "Full-service property management and tenant relations",
        },
        {
          "@type": "Offer",
          name: "Investment Advisory",
          price: "200000",
          priceCurrency: "BDT",
          description: "Strategic investment advisory and market intelligence",
        },
      ],
    },
  }

    // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://pqrix.com/",
    name: "Pqrix | Software Development Company in Bangladesh",
    description:
      "Leading software development company in Bangladesh offering Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, and Desktop solutions with local payment integration.",
    url: "https://pqrix.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Pqrix",
      url: "https://pqrix.com",
      sameAs: [
        "https://twitter.com/pqrix",
        "https://www.youtube.com/@pqrix",
        "https://instagram.com/pqrix",
        "https://threads.com/pqrix",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://pqrix.com/#pricing",
        name: "Pricing Section",
        url: "https://pqrix.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] bg-white text-black">
        <SiteHeader />
        <Hero />
        <Features />
        <FeaturedPropertiesSection />
        <GalleriesSection />
        <ServicesSection />
        <LatestInsightsSection />
        <ProjectsSection />
        {/* <LogoMarquee /> */}
        {/* <Pricing /> */}
        <AppverseFooter />
      </main>
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
