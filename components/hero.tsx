"use client"

import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Shield, Users, ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function Hero() {
  const [counters, setCounters] = useState({ aum: 0, properties: 0, roi: 0, clients: 0 })

  useEffect(() => {
    const animateCounter = (target: number, key: keyof typeof counters, duration: number = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = start

      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 16)
    }

    animateCounter(250, 'aum')
    animateCounter(180, 'properties')
    animateCounter(18, 'roi')
    animateCounter(450, 'clients')
  }, [])

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col lg:flex-row overflow-hidden bg-[#FAFAFA]">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-[10%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[30%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[50%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[70%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 left-[90%] w-[1px] h-full bg-black/[0.03]" />
        <div className="absolute top-0 right-0 w-[45%] h-full bg-[#064E3B] transform -skew-x-[12deg] origin-bottom translate-x-32 shadow-2xl z-0" />
      </div>

      {/* Left Content Half */}
      <div className="lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:pl-24 lg:pr-12 pt-28 pb-16 z-10 relative">
        <div className="animate-in slide-in-from-left-12 fade-in duration-1000 fill-mode-both">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-12 h-[2px] bg-[#064E3B]" />
            <span className="text-[#064E3B] font-bold tracking-[0.2em] text-xs uppercase">Since 2024</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.05]">
            <span className="block text-gray-900">Strategic Asset</span>
            <span className="block text-[#064E3B] mt-1 relative">
              Optimization
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-light" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
              </svg>
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mb-12 leading-relaxed font-normal">
            Elevate your portfolio with Sabit's premier real estate asset management. 
            We blend strategic foresight with rigorous market data to maximize your yields and minimize risks.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Button asChild size="lg" className="rounded-none px-8 py-7 bg-[#064E3B] hover:bg-gray-900 border border-transparent text-white transition-all text-sm font-bold tracking-widest uppercase relative overflow-hidden group">
              <a href="https://wa.me/8801401658685?text=Hi!%20I'm%20interested%20in%20your%20asset%20management%20services" target="_blank" rel="noopener noreferrer">
                <span className="relative z-10 flex items-center">
                  Schedule Consultation
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </Button>
            <div className="flex items-center gap-4 cursor-pointer group mt-2 sm:mt-0">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#064E3B] group-hover:bg-[#064E3B] transition-all">
                <Play className="w-4 h-4 text-[#064E3B] group-hover:text-white translate-x-0.5" fill="currentColor" />
              </div>
              <span className="font-bold text-sm tracking-widest uppercase text-gray-700 group-hover:text-[#064E3B]">Watch Reel</span>
            </div>
          </div>
        </div>

        {/* Stats Section Modernized */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-10 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
          <div>
            <div className="text-4xl font-black text-gray-900 mb-1">{counters.aum}<span className="text-[#064E3B]">M+</span></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">AUM ($)</p>
          </div>
          <div>
            <div className="text-4xl font-black text-gray-900 mb-1">{counters.properties}<span className="text-[#064E3B]">+</span></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Properties</p>
          </div>
          <div>
            <div className="text-4xl font-black text-gray-900 mb-1">{counters.roi}<span className="text-[#064E3B]">%</span></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg ROI</p>
          </div>
          <div>
            <div className="text-4xl font-black text-gray-900 mb-1">{counters.clients}<span className="text-[#064E3B]">+</span></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Investors</p>
          </div>
        </div>
      </div>

      {/* Right Image Half */}
      <div className="lg:w-[45%] relative min-h-[500px] lg:min-h-full z-10 flex items-center justify-center p-6 lg:p-12 animate-in slide-in-from-right-12 fade-in duration-1000 delay-100 fill-mode-both">
        <div className="relative w-full h-[600px] shadow-2xl group overflow-hidden bg-gray-100 transform lg:-translate-x-12">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="Premium Real Estate Building"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[20%]"
          />
          {/* Accent Box overlay */}
          <div className="absolute -bottom-6 -left-6 w-3/4 h-32 bg-white p-6 shadow-xl lg:flex items-center hidden gap-4 group-hover:translate-x-2 transition-transform duration-500">
             <div className="w-12 h-12 bg-green-light flex items-center justify-center shrink-0">
               <Building2 className="text-[#064E3B] w-6 h-6" />
             </div>
             <div>
               <h4 className="font-bold text-gray-900">Prime Commercial Assets</h4>
               <p className="text-xs text-gray-500">View our latest additions to the portfolio</p>
             </div>
          </div>
        </div>
      </div>

    </section>
  )
}
