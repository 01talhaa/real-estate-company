"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import servicesDataRaw from "@/data/services.json"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
  color: string
  pricing?: string
}

export function ServicesSection() {
  const services = (servicesDataRaw as Service[]).slice(0, 4)
  return (
    <section id="benefits" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[#f8fcfb] -z-10" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 mb-24 lg:items-end justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex flex-col gap-4 mb-6">
              <span className="w-16 h-[2px] bg-[#064E3B]" />
              <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">What You Get</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 leading-[1.05]">
              Partnering <span className="text-[#064E3B]">Benefits</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              When you invest in our designated projects, you unlock unparalleled value extraction, dedicated advisory, and seamless operational oversight. 
            </p>
          </div>
          <div className="pb-2">
            <Button asChild size="lg" className="rounded-none px-8 h-12 bg-transparent text-[#064E3B] border border-[#064E3B] hover:bg-[#064E3B] hover:text-white transition-all text-sm font-bold tracking-widest uppercase group">
              <Link href="/benefits">
                View Full Integration <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {services.map((service) => {
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
            return (
              <Link 
                href={`/benefits/${service.id}`}
                key={service.id} 
                className="block group cursor-pointer flex flex-col sm:flex-row gap-8 p-10 bg-white border border-gray-100 hover:border-[#064E3B]/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_-15px_rgba(6,78,59,0.15)] transition-all duration-700 rounded-[2rem] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-light/10 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#064E3B]/5 to-green-muted/20 text-[#064E3B] flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-[0_10px_20px_-10px_rgba(6,78,59,0.5)]">
                    <IconComponent className="w-10 h-10 transition-colors duration-500" />
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#064E3B] transition-colors">{service.title}</h3>
                  <p className="text-base text-gray-600 mb-8 font-light leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mt-auto">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">Key Advantages Included</span>
                    <ul className="grid sm:grid-cols-1 gap-y-3 gap-x-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#064E3B]/5 border border-[#064E3B]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#064E3B] group-hover:border-[#064E3B] transition-colors duration-300">
                            <Check className="w-3 h-3 text-[#064E3B] group-hover:text-white transition-colors" strokeWidth={3} />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}