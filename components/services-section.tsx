"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import { useEffect, useState } from "react"

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
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          // Get only first 4 services
          const servicesData = data.success ? data.data : data
          setServices(servicesData.slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="container mx-auto px-4 py-16 sm:py-20 bg-gradient-to-b from-white via-green-muted to-white">
        <div className="mb-12 text-center">
          <h2 className="text-[#064E3B] mb-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Our <span className="text-green-dark">Services</span></h2>
          <p className="mx-auto max-w-2xl text-lg text-black">Loading services...</p>
        </div>
      </section>
    )
  }
  return (
    <section id="services" className="container mx-auto px-4 py-16 sm:py-20 bg-gradient-to-b from-white via-green-muted to-white">
      <div className="mb-12 text-center">
        <h2 className="text-[#064E3B] mb-4 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">Our <span className="text-green-dark">Services</span></h2>
        <p className="mx-auto max-w-2xl text-lg text-black">
          From concept to completion, we deliver premium creative solutions that drive results
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
          return (
          <Card
            key={service.id}
            className="group liquid-glass border border-green-muted bg-white/80 backdrop-blur-xl transition-all hover:border-green-light hover:bg-white/90 shadow-lg shadow-green-muted/30"
          >
            <CardHeader>
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-black">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-black">{service.description}</p>
              <ul className="space-y-2">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-black">
                    <Check className="h-3 w-3 text-green-dark flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="ghost"
                className="group/btn w-full justify-between text-green-dark hover:bg-green-muted hover:text-green-dark"
              >
                <Link href={`/services/${service.id}`}>
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )})}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          size="lg"
          className="rounded-full  px-8   shadow-lg "
        >
          <Link href="/services">
            View All Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
