"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, LogOut, FolderOpen, Wrench, HelpCircle, Tag, Briefcase, Menu, Users, ChevronDown } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NoticeMarquee } from "@/components/notice-marquee"

interface Client {
  _id: string
  name: string
  email: string
  avatar?: string
}

export function SiteHeader() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()

    const handleClientUpdate = () => {
      checkAuth()
    }

    window.addEventListener('clientUpdated', handleClientUpdate)

    return () => {
      window.removeEventListener('clientUpdated', handleClientUpdate)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/client/me', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        const clientData = data.client || data
        setClient(clientData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/client/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setClient(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const links = [
    { href: "/", label: "Home", icon: Briefcase },
    { href: "/properties", label: "Properties", icon: FolderOpen },
    { href: "/galleries", label: "Galleries", icon: Tag },
    { href: "/insights", label: "Insights", icon: HelpCircle },
    { href: "/benefits", label: "Benefits", icon: Wrench },
    { href: "/team", label: "Team", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-white shadow-[0_10px_30px_-15px_rgba(6,78,59,0.15)] border-b border-gray-100 transition-all duration-300">
      {/* Notice Marquee (Below Header, Attached and Sticky) */}
      <NoticeMarquee />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center p-2.5 bg-gradient-to-br from-green-light to-[#064E3B] rounded-xl shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
              <span className="text-white font-black text-sm tracking-widest">SAML</span>
            </div>
            <span className="font-extrabold tracking-tight text-lg">
              <span className="text-[#064E3B]">Sabit Asset</span>
              <span className="text-gray-900 group-hover:text-[#064E3B] transition-colors"> Management</span>
            </span>
          </Link>

          {/* Desktop Nav Ultra-Fast CSS Hover Menu */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            <Link href="/" className="text-gray-700 font-bold hover:text-[#064E3B] text-[15px] h-full flex items-center transition-colors">
              Home
            </Link>

            {/* Services CSS Dropdown */}
            <div className="group h-full flex items-center relative">
              <Link href="/benefits" className="text-gray-700 font-bold group-hover:text-[#064E3B] text-[15px] transition-colors flex items-center gap-1 cursor-pointer">
                Benefits <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(6,78,59,0.2)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 grid grid-cols-2 p-3 gap-1 z-50">
                <div className="p-6 bg-gradient-to-b from-[#064E3B]/5 to-green-muted/30 rounded-xl">
                  <Wrench className="w-8 h-8 text-[#064E3B] mb-4" />
                  <h4 className="text-lg font-bold text-[#064E3B] mb-2">Core Benefits</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Comprehensive asset management tailored for premium portfolios.</p>
                </div>
                <div className="flex flex-col gap-2 p-3">
                  <Link href="/benefits#property-management" className="p-3 hover:bg-gray-50 rounded-lg group/link transition-colors">
                    <h5 className="font-bold text-gray-900 group-hover/link:text-[#064E3B]">Property Management</h5>
                    <p className="text-xs text-gray-500 mt-1">End-to-end management</p>
                  </Link>
                  <Link href="/benefits#advisory" className="p-3 hover:bg-gray-50 rounded-lg group/link transition-colors">
                    <h5 className="font-bold text-gray-900 group-hover/link:text-[#064E3B]">Strategic Advisory</h5>
                    <p className="text-xs text-gray-500 mt-1">Data-driven guidance</p>
                  </Link>
                  <Link href="/benefits#valuation" className="p-3 hover:bg-gray-50 rounded-lg group/link transition-colors">
                    <h5 className="font-bold text-gray-900 group-hover/link:text-[#064E3B]">Property Valuation</h5>
                    <p className="text-xs text-gray-500 mt-1">Accurate assessment</p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Properties CSS Dropdown */}
            <div className="group h-full flex items-center relative">
              <Link href="/properties" className="text-gray-700 font-bold group-hover:text-[#064E3B] text-[15px] transition-colors flex items-center gap-1 cursor-pointer">
                Properties <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </Link>
              <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[350px] bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(6,78,59,0.2)] rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 p-3 flex flex-col gap-1 z-50">
                <Link href="/properties?type=residential" className="p-4 hover:bg-gray-50 rounded-lg group/prop transition-colors">
                  <h5 className="font-bold text-gray-900 group-hover/prop:text-[#064E3B]">Residential Properties</h5>
                  <p className="text-sm text-gray-500">Luxury apartments & villas</p>
                </Link>
                <Link href="/properties?type=commercial" className="p-4 hover:bg-gray-50 rounded-lg group/prop transition-colors">
                  <h5 className="font-bold text-gray-900 group-hover/prop:text-[#064E3B]">Commercial Spaces</h5>
                  <p className="text-sm text-gray-500">Office suites & retail centers</p>
                </Link>
                <Link href="/properties?type=mixed" className="p-4 hover:bg-gray-50 rounded-lg group/prop transition-colors">
                  <h5 className="font-bold text-gray-900 group-hover/prop:text-[#064E3B]">Mixed-Use Developments</h5>
                  <p className="text-sm text-gray-500">Integrated lifestyle hubs</p>
                </Link>
              </div>
            </div>

            <Link href="/galleries" className="text-gray-700 font-bold hover:text-[#064E3B] text-[15px] h-full flex items-center transition-colors">
              Galleries
            </Link>

            <Link href="/insights" className="text-gray-700 font-bold hover:text-[#064E3B] text-[15px] h-full flex items-center transition-colors">
              Insights
            </Link>

            <Link href="/team" className="text-gray-700 font-bold hover:text-[#064E3B] text-[15px] h-full flex items-center transition-colors">
              Team
            </Link>
          </nav>

          {/* Desktop Right Side Auth / Client */}
          <div className="hidden lg:flex items-center gap-4">
            {!loading && (
              client ? (
                <div className="group relative">
                  <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-full transition-colors pr-4 border border-transparent hover:border-gray-200">
                    <Avatar className="h-10 w-10 border-2 border-green-light shadow-sm">
                      <AvatarImage src={client.avatar} alt={client.name || 'Client'} />
                      <AvatarFallback className="bg-[#064E3B]/10 text-[#064E3B] font-bold">
                        {client.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 leading-tight">{client.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Client Portal</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#064E3B]" />
                  </div>
                  {/* Account Dropdown */}
                  <div className="absolute top-16 right-0 w-56 bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-50 mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</span>
                    </div>
                    <Link href="/client/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-semibold text-gray-700 hover:text-[#064E3B] transition-colors">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/client/profile" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-semibold text-gray-700 hover:text-[#064E3B] transition-colors">
                      <Wrench className="w-4 h-4" /> Profile
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg font-semibold text-red-600 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  asChild
                  className="rounded-full px-8 h-12 bg-gray-900 hover:bg-[#064E3B] text-white shadow-lg font-bold transition-all text-sm"
                >
                  <Link href="/client/login">Client Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Nav Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-gray-200 bg-gray-50 text-gray-900 border active:scale-95">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-white border-l border-gray-100 p-0 flex flex-col">
                <div className="flex items-center gap-3 p-6 border-b border-gray-50">
                  <div className="flex items-center justify-center p-2 bg-gradient-to-br from-green-light to-[#064E3B] rounded-lg">
                    <span className="text-white font-black text-xs tracking-wider">SAML</span>
                  </div>
                  <span className="font-extrabold text-gray-900">Sabit Asset</span>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="flex flex-col gap-2">
                    {links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 text-gray-700 font-bold active:bg-gray-100 transition-colors"
                      >
                        <l.icon className="h-5 w-5 text-gray-400" />
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                  {!loading && (
                    client ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-2 py-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-2">
                          <Avatar className="h-12 w-12 border-2 border-green-light">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="bg-[#064E3B]/10 text-[#064E3B] font-bold">
                              {client.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-bold text-gray-900 truncate">{client.name}</p>
                            <p className="text-xs text-gray-500 font-medium truncate">{client.email}</p>
                          </div>
                        </div>
                        <Button asChild className="w-full rounded-xl h-12 font-bold" variant="outline">
                          <Link href="/client/dashboard">Dashboard</Link>
                        </Button>
                        <Button onClick={handleLogout} className="w-full rounded-xl h-12 bg-red-50 text-red-600 hover:bg-red-100 font-bold border-0 shadow-none">
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button asChild className="w-full rounded-xl h-12 bg-gray-900 hover:bg-[#064E3B] font-bold shadow-lg">
                          <Link href="/client/login">Client Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full rounded-xl h-12 font-bold border-gray-200">
                          <Link href="https://wa.me/8801401658685">Get a Quote</Link>
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>


    </header>
  )
}
