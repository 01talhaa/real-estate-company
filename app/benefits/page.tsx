import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import servicesDataRaw from "@/data/services.json"

export const dynamic = 'force-static'

export const metadata = {
  title: "Investment Benefits | Sabit Asset Management",
  description: "Explore the unparalleled benefits and strategic advantages of partnering with Sabit Asset Management for premium real estate investments.",
}

export default async function BenefitsPage() {
  const services = servicesDataRaw as any[]
  
  return (
    <>
      <main className="min-h-[100dvh] bg-white">
        <SiteHeader />

        <section className="relative pt-32 pb-24 bg-[#064E3B] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-[#03291E] md:-skew-x-[20deg] origin-top translate-x-20 opacity-50" />
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="w-12 h-[2px] bg-green-light" />
                <span className="text-green-light font-bold tracking-[0.2em] text-xs uppercase">Why Choose Us</span>
              </div>
              <h1 className="text-white mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.05]">
                <span className="block text-white">Partnering</span>
                <span className="block text-green-light mt-1">Advantages</span>
              </h1>
              <p className="text-lg text-white/80 max-w-xl font-light leading-relaxed">
                Unlock exclusive institutional-grade real estate benefits when investing through our heavily optimized asset structure.
              </p>
            </div>
          </div>
        </section>

        <section className="py-32 bg-[#FAFAFA]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col gap-20">
              {services.map((service: any, index: number) => {
                const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
                const isEven = index % 2 !== 0

                return (
                  <div key={service.id} className={`flex flex-col lg:flex-row items-center gap-16 ${isEven ? 'lg:flex-row-reverse' : ''} group`}>
                    
                    <div className="lg:w-1/2 relative">
                       <div className="aspect-[4/3] w-full rounded-[2rem] overflow-hidden bg-gray-200 relative group-hover:shadow-[0_30px_60px_-15px_rgba(6,78,59,0.2)] transition-shadow duration-700">
                         {service.image ? (
                           <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                         ) : (
                           <div className={`w-full h-full bg-gradient-to-br ${service.color || 'from-[#064E3B]/20 to-[#064E3B]/5'} flex items-center justify-center`}>
                             <IconComponent className="w-24 h-24 text-[#064E3B]/40" />
                           </div>
                         )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       </div>
                    </div>

                    <div className="lg:w-1/2 flex flex-col justify-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                        <IconComponent className="h-8 w-8 text-[#064E3B]" />
                      </div>
                      
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">{service.title}</h2>
                      <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                        {service.description}
                      </p>

                      <div className="mb-10">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block border-b border-gray-200 pb-2">Included Systems</span>
                        <ul className="grid sm:grid-cols-2 gap-4">
                          {service.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#064E3B]/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#064E3B] transition-colors">
                                <Check className="w-3 h-3 text-[#064E3B] group-hover:text-white" strokeWidth={3} />
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button asChild size="lg" className="self-start rounded-none px-10 h-14 bg-gray-900 hover:bg-[#064E3B] text-white tracking-widest uppercase font-bold text-xs transition-all shadow-xl">
                        <Link href={`/benefits/${service.id}`}>
                          Examine Advantage <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-32 border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Ready to Command High Yields?</h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-10">
              Reach out to our strategic investment board to discuss onboarding and portfolio optimization.
            </p>
            <Button asChild size="lg" className="rounded-none px-12 h-16 bg-[#064E3B] hover:bg-[#03291E] shadow-2xl text-white font-bold tracking-widest uppercase">
              <Link href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20partnering">
                Speak With An Advisor
              </Link>
            </Button>
          </div>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
