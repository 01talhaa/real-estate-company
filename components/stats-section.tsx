"use client"

import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    {
      value: "$250M+",
      label: "Assets Under Management",
      description: "Optimizing yields across a diverse institutional portfolio"
    },
    {
      value: "120+",
      label: "Premium Properties",
      description: "Strategically located assets delivering consistent returns"
    },
    {
      value: "15+",
      label: "Years Experience",
      description: "Deep market expertise and established industry relationships"
    },
    {
      value: "98%",
      label: "Client Retention",
      description: "Building long-term partnerships through transparent results"
    }
  ]

  return (
    <section className="py-20 bg-[#064E3B] text-white relative overflow-hidden">
      {/* Background Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <p className="text-sm font-bold tracking-[0.25em] text-green-200 uppercase mb-4">By The Numbers</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Proven Track Record of Exceptional Performance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
              <span className="text-5xl lg:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-green-200">
                {stat.value}
              </span>
              <h3 className="text-xl font-bold mb-3">{stat.label}</h3>
              <p className="text-green-100/70 font-light text-sm leading-relaxed max-w-[200px]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
