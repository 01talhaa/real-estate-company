// app/about/page.tsx
import React from "react";

export default function AboutPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sabit Asset Management LTD",
    url: "https://sabitasset.com",
    logo: "https://sabitasset.com/logo.png",
    description:
      "Sabit Asset Management LTD is a professional real estate asset management firm offering comprehensive property portfolio management, investment advisory, property valuation, and strategic asset optimization services.",
    sameAs: [
      "https://www.instagram.com/sabitasset",
      "https://www.linkedin.com/company/sabitasset",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+880-1401-658685",
        contactType: "customer service",
      },
    ],
    areaServed: [
      { "@type": "Place", name: "Bangladesh" },
      { "@type": "Place", name: "South Asia" },
      { "@type": "Place", name: "Asia Pacific" },
    ],
  };

  return (
    <>
      {/* SEO Schema for Google + LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-muted to-white text-black py-20 px-6 md:px-12 lg:px-20 text-center">
        <h1 className="text-[#064E3B] text-4xl md:text-6xl font-bold mb-6">
          About <span className="text-green-dark">Sabit Asset Management</span> <span className="text-black">LTD</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-black">
          Your trusted partner in strategic real estate asset management and portfolio optimization.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white text-black px-6 md:px-12 lg:px-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Portfolio Management",
              desc: "Comprehensive property portfolio management services to maximize asset value and performance.",
            },
            {
              title: "Investment Advisory",
              desc: "Strategic real estate investment guidance and market analysis for optimal returns.",
            },
            {
              title: "Property Valuation",
              desc: "Professional property appraisal and valuation services using industry-leading methodologies.",
            },
            {
              title: "Asset Optimization",
              desc: "Strategic planning and implementation to enhance property value and operational efficiency.",
            },
            {
              title: "Market Intelligence",
              desc: "In-depth market research and analysis to inform investment decisions.",
            },
            {
              title: "Client-Focused Service",
              desc: "Personalized asset management strategies tailored to your investment goals.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-green-muted border border-green-muted p-6 rounded-2xl shadow-lg shadow-green-muted/30 hover:scale-105 hover:shadow-xl hover: transform transition-all duration-300"
            >
              <h3 className="text-[#064E3B] text-xl font-semibold mb-3 text-green-dark">{feature.title}</h3>
              <p className="text-black">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-green-muted to-white text-center text-black px-6">
        <h2 className="text-[#064E3B] text-3xl md:text-4xl font-bold mb-6">
          Ready to Elevate Your Brand?
        </h2>
        <p className="text-lg text-black mb-8">
          Let Pqrix International bring your products to life.
        </p>
        <a
          href="/contact"
          className="  px-6 py-3 rounded-full font-semibold  shadow-lg  transition-all inline-block"
        >
          Get in Touch
        </a>
      </section>
    </>
  );
}
