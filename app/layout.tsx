import type React from "react"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import Plasma from "@/components/plasma"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL('https://sabitasset.com'),
  title: {
    default: "Sabit Asset Management LTD | Strategic Real Estate Asset Management Services",
    template: "%s | Sabit Asset Management"
  },
  description:
    "Sabit Asset Management LTD - Your trusted partner in real estate asset management. We provide comprehensive property portfolio management, investment advisory, property valuation, and strategic asset optimization services. Maximize your property investments with our expert team.",
  keywords: [
    // Company & Location
    "asset management company",
    "real estate asset management",
    "property management company",
    "asset management services",
    "real estate investment management",
    "property portfolio management",
    "asset management firm",
    "commercial property management",
    "residential property management",
    "real estate advisory",
    "property investment advisory",
    "real estate consultancy",
    
    // Core Services
    "property portfolio management",
    "real estate portfolio optimization",
    "property valuation services",
    "asset valuation",
    "property appraisal",
    "investment advisory",
    "real estate investment strategy",
    "property acquisition services",
    "property disposal services",
    "asset optimization",
    "property performance analysis",
    "real estate due diligence",
    "property market analysis",
    "investment risk management",
    "property asset planning",
    "real estate financial analysis",
    "property ROI optimization",
    "asset allocation",
    "property investment consulting",
    "real estate wealth management",
    
    // Property Management Services
    "commercial property management",
    "residential property management",
    "retail property management",
    "office property management",
    "industrial property management",
    "mixed-use property management",
    "property leasing services",
    "tenant management",
    "lease administration",
    "rent collection services",
    "property maintenance management",
    "facility management",
    "building management",
    "property operations",
    "landlord representation",
    "tenant relations",
    
    // Investment & Advisory
    "real estate investment advisory",
    "property investment strategy",
    "investment portfolio diversification",
    "real estate market research",
    "property acquisition advisory",
    "property disposal strategy",
    "investment opportunity analysis",
    "real estate investment trust",
    "REIT management",
    "property investment returns",
    "capital appreciation strategy",
    "rental yield optimization",
    "property income generation",
    "real estate capital markets",
    "property fund management",
    
    // Valuation & Analysis
    "property valuation",
    "real estate appraisal",
    "asset valuation services",
    "market value assessment",
    "property worth evaluation",
    "comparative market analysis",
    "property inspection services",
    "real estate feasibility study",
    "highest and best use analysis",
    "property condition assessment",
    "building valuation",
    "land valuation",
    "commercial property valuation",
    "residential property valuation",
    
    // Financial Services
    "property financial planning",
    "real estate financial analysis",
    "property cash flow analysis",
    "operating expense management",
    "property budgeting",
    "real estate accounting",
    "property tax optimization",
    "capital expenditure planning",
    "property financial reporting",
    "investment return calculation",
    "property performance metrics",
    "asset financial management",
    
    // Strategic Services
    "asset optimization services",
    "property portfolio strategy",
    "real estate repositioning",
    "property redevelopment advisory",
    "asset enhancement strategy",
    "property value maximization",
    "real estate exit strategy",
    "property turnaround services",
    "asset lifecycle management",
    "property strategic planning",
    "real estate risk mitigation",
    
    // Market & Research
    "real estate market analysis",
    "property market trends",
    "real estate research",
    "property demand analysis",
    "market opportunity assessment",
    "competitive property analysis",
    "real estate market intelligence",
    "property sector analysis",
    "location analysis",
    "demographic research",
    "real estate forecasting",
    
    // Transaction Support
    "property acquisition services",
    "real estate due diligence",
    "property purchase advisory",
    "sale transaction support",
    "property negotiation services",
    "real estate transaction management",
    "property closing services",
    "title review services",
    "property legal advisory",
    
    // Asset Types
    "office building management",
    "retail center management",
    "shopping mall management",
    "apartment complex management",
    "condominium management",
    "warehouse management",
    "logistics facility management",
    "medical office building",
    "hotel asset management",
    "land asset management",
    "parking facility management",
    
    // Client Types
    "institutional property management",
    "private investor services",
    "corporate real estate services",
    "family office real estate",
    "pension fund property management",
    "insurance company real estate",
    "bank owned property",
    "developer services",
    
    // Technology & Reporting
    "property management software",
    "real estate analytics",
    "property performance dashboard",
    "asset tracking system",
    "property reporting services",
    "real estate data analysis",
    "property management platform",
    "customer portal",
    "vendor portal",
    "B2B software",
    "B2C software",
    "B2B2C platform",
    "multi-tenant software",
    "white label software",
    "franchise software",
    
    // Development Processes
    "software development lifecycle",
    "SDLC",
    "requirement gathering",
    "system design",
    "database design",
    "UI design",
    "UX design",
    "user interface",
    "user experience",
    "interaction design",
    "prototyping",
    "mockup design",
    "coding",
    "programming",
    "testing",
    "quality assurance",
    "deployment",
    "go-live",
    "post-launch support",
    
    // Business Terms
    "digital solution",
    "business automation",
    "workflow automation",
    "process automation",
    "digital transformation",
    "software integration",
    "system integration",
    "data migration",
    "software upgrade",
    "technology consulting",
    "IT consulting",
    "software architect",
    "solution architect",
    "technical lead",
    "software engineer",
    "programmer",
    "developer",
    "coder",
    
    // Quality & Security
    "secure software",
    "data security",
    "encryption",
    "authentication",
    "authorization",
    "RBAC",
    "role based access",
    "two factor authentication",
    "OAuth integration",
    "GDPR compliant",
    "HIPAA compliant",
    "PCI DSS",
    "penetration testing",
    "security audit",
    "vulnerability assessment",
    "code review",
    "peer review",
    "clean code",
    "best practices",
    "coding standards",
    "software quality",
    "high performance",
    "scalable software",
    "reliable software",
    "maintainable code",
    
    // Client-focused
    "software for startups",
    "startup software",
    "SME software",
    "small business software",
    "enterprise solutions",
    "corporate software",
    "government software",
    "NGO software",
    "non-profit software",
    "software for agencies",
    "white label solutions"
  ],
  authors: [{ name: "Pqrix Studio" }],
  creator: "Pqrix",
  publisher: "Pqrix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pqrix.com",
    siteName: "Pqrix",
    title: "Pqrix | Professional Software Development Company in Bangladesh",
    description: "Expert software development services in Bangladesh: Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, Desktop Applications. Local payment integration (bKash/Nagad). Starting ৳8,500.",
    images: [
      {
        url: "/icons/pqrix-logo.png",
        width: 1200,
        height: 630,
        alt: "Pqrix - Software Development Company Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pqrix | Software Development Company in Bangladesh",
    description: "Leading software development company offering Web/SaaS, Mobile Apps, 3D Web/XR, and Desktop Solutions in Bangladesh. bKash/Nagad integration available.",
    images: ["/icons/pqrix-logo.png"],
    creator: "@pqrix",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/pqrix-icon.svg", type: "image/svg+xml" },
      { url: "/icons/pqrix-icon.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icons/pqrix-icon.svg", sizes: "16x16", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/pqrix-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/pqrix-white.svg",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://pqrix.com",
  },
  category: "Software Development Services",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Font Preload */}
        <link
          rel="preload"
          href="/fonts/Inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          fetchPriority="high"
        />

        {/* Structured Data for Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Pqrix",
              url: "https://pqrix.com",
              logo: "https://pqrix.com/icons/pqrix-logo.png",
              description: "Professional software development company in Bangladesh specializing in Discovery & Strategy, Web/SaaS Development, Mobile App Development, Custom 3D Web/XR, and Desktop Application Solutions with local payment gateway integration.",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix",
                "https://linkedin.com/company/pqrix"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+880-1401-658685",
                contactType: "customer service",
                availableLanguage: ["English", "Bengali"],
                areaServed: "BD"
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka"
              },
              areaServed: ["BD", "Worldwide"],
              serviceType: [
                "Discovery & Strategy Services",
                "Web Development",
                "SaaS Development",
                "Mobile App Development",
                "Custom 3D Web Development",
                "WebGL Development",
                "Desktop Application Development",
                "Software Consultation"
              ],
              priceRange: "৳৳৳"
            })
          }}
        />

        {/* Structured Data for Professional Service */}
        <Script
          id="service-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Pqrix Software Development",
              image: "https://pqrix.com/icons/pqrix-logo.png",
              "@id": "https://pqrix.com",
              url: "https://pqrix.com",
              telephone: "+880-1401-658685",
              priceRange: "৳8,500 - ৳3,00,000+",
              address: {
                "@type": "PostalAddress",
                addressCountry: "BD",
                addressRegion: "Dhaka"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 23.8103,
                longitude: 90.4125
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                opens: "00:00",
                closes: "23:59"
              },
              paymentAccepted: ["bKash", "Nagad", "Bank Transfer", "Cash"],
              currenciesAccepted: "BDT",
              sameAs: [
                "https://twitter.com/pqrix",
                "https://www.youtube.com/@pqrix",
                "https://instagram.com/pqrix"
              ]
            })
          }}
        />

        {/* Google Tag Manager (deferred) */}
        <Script id="gtm-script" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NFLHXXGK');`}
        </Script>

        {/* Google Analytics (deferred) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W6LV22900R" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6LV22900R');
          `}
        </Script>
      </head>
      <body>
        <div className="fixed inset-0 z-0 bg-white">
          <Plasma
            color="#064E3B"
            speed={0.8}
            direction="forward"
            scale={1.5}
            opacity={0.10}
            mouseInteractive={true}
          />
        </div>
        <div className="relative z-10">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
