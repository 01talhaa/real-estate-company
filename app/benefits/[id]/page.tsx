import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { notFound } from "next/navigation"
import { getAllServicesForBuild, getServiceByIdForBuild } from "@/lib/get-services"
import * as LucideIcons from "lucide-react"

export const dynamic = 'force-static'
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const services = await getAllServicesForBuild()
  return services.map((service: any) => ({ id: service.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceByIdForBuild(id)
  if (!service) return {}

  const s = service as any

  return {
    title: `${s.title} | Sabit Asset Management Benefits`,
    description: s.description,
  }
}

export default async function BenefitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  let service: any
  
  if (isProductionBuild) {
    service = await getServiceByIdForBuild(id)
  } else {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/services/${id}`, {
        next: { revalidate: 60 }
      })
      
      if (response.ok) {
        const data = await response.json()
        service = data.success ? data.data : null
      } else {
        service = await getServiceByIdForBuild(id)
      }
    } catch (error) {
      console.error('API fetch failed, falling back to database:', error)
      service = await getServiceByIdForBuild(id)
    }
  }

  if (!service) {
    notFound()
  }

  const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Box

  return (
    <>
      <main className="min-h-[100dvh] bg-white">
        <SiteHeader />

        <div className="bg-[#FAFAFA] border-b border-gray-100">
          <div className="container mx-auto px-6 max-w-7xl py-6">
            <Button asChild variant="ghost" className="text-gray-500 hover:text-[#064E3B] hover:bg-[#064E3B]/5 transition-colors -ml-4">
              <Link href="/benefits">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Benefits
              </Link>
            </Button>
          </div>
        </div>

        <section className="relative py-24 lg:py-32 bg-[#FAFAFA] overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#064E3B]/[0.02] transform -skew-x-[20deg]" />
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl mb-8">
                  <Icon className="h-10 w-10 text-[#064E3B]" />
                </div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-8 h-[2px] bg-[#064E3B]" />
                  <span className="text-xs font-bold text-[#064E3B] uppercase tracking-widest">{service.tagline || 'Core Benefit'}</span>
                </div>
                <h1 className="text-gray-900 mb-8 text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                  {service.title}
                </h1>
                <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
                  {service.description}
                </p>
                {service.longDescription && (
                  <p className="text-gray-700 leading-relaxed max-w-lg shadow-[inset_4px_0_0_0_#064E3B] pl-6 py-2 bg-gray-50 italic">
                    {service.longDescription}
                  </p>
                )}
              </div>
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${service.color || 'from-[#064E3B]/10 to-[#064E3B]/5'}`} />
                )}
                <div className="absolute inset-0 border-[3px] border-white/20 rounded-[2rem] pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {service.stats && service.stats.length > 0 && (
          <section className="py-20 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {service.stats.map((stat: any, idx: number) => {
                  const StatIcon = (LucideIcons as any)[stat.icon] || LucideIcons.TrendingUp
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center p-10 bg-[#FAFAFA] border border-gray-100 rounded-3xl text-center group hover:bg-[#064E3B] transition-colors duration-500">
                      <StatIcon className="h-10 w-10 text-[#064E3B] group-hover:text-white mb-6 transition-colors" />
                      <div className="text-5xl font-black text-gray-900 group-hover:text-white mb-2 tracking-tighter transition-colors">{stat.value}</div>
                      <div className="text-sm font-semibold text-gray-500 group-hover:text-green-light uppercase tracking-widest transition-colors">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Structural Integration</h2>
              <p className="text-lg text-gray-600 font-light">
                When acquiring this advantage through our portfolio, the following components are delivered natively as standard.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-6 bg-[#FAFAFA] rounded-2xl border border-gray-100 hover:border-[#064E3B]/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#064E3B]/5 flex items-center justify-center mt-1 shrink-0">
                     <Check className="h-4 w-4 text-[#064E3B]" strokeWidth={3} />
                  </div>
                  <span className="text-gray-800 font-semibold leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {service.process && (
          <section className="py-24 bg-[#064E3B]">
            <div className="container mx-auto px-6 max-w-7xl">
              <h2 className="text-3xl font-extrabold text-white mb-16 text-center">Deployment Pipeline</h2>
              <div className="grid gap-8 md:grid-cols-5 relative">
                <div className="hidden md:block absolute top-10 left-10 right-10 h-[2px] bg-white/10" />
                {service.process.map((item: any, idx: number) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-[#03291E] rounded-2xl flex items-center justify-center font-black text-2xl text-green-light shadow-xl border border-white/5 mb-6">
                      0{idx + 1}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">{item.step}</h3>
                    <p className="text-sm text-white/70 font-light">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-32 bg-white">
           <div className="container mx-auto px-6 max-w-3xl text-center">
             <div className="w-20 h-20 bg-green-light/20 rounded-full flex items-center justify-center mx-auto mb-8">
               <TrendingUp className="w-10 h-10 text-[#064E3B]" />
             </div>
             <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">Ready to leverage this advantage?</h2>
             <p className="text-xl text-gray-600 font-light mb-12">
               Let's orchestrate a specialized integration strategy tailored perfectly to your overall portfolio metrics.
             </p>
             <Button asChild size="lg" className="rounded-none px-12 h-16 bg-gray-900 hover:bg-[#064E3B] shadow-2xl text-white tracking-widest uppercase font-bold text-sm transition-all">
               <Link href="https://wa.me/8801401658685?text=Hi!%20I'd%20like%20to%20utilize%20this%20advantage%20for%20my%20portfolio">
                 Consult Advisory Board
               </Link>
             </Button>
           </div>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
