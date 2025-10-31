"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import { Menu, Briefcase, Tag, HelpCircle, Wrench, FolderOpen, Users, LogOut, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

    // Listen for client update events
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
        // The API returns { client: {...} }, so we need to extract the client object
        const clientData = data.client || data
        console.log('Site header client data:', clientData)
        console.log('Avatar URL:', clientData.avatar)
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
    { href: "/services", label: "Services", icon: Wrench },
    { href: "/team", label: "Team", icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center justify-between px-6 liquid-glass-header rounded-full shadow-md shadow-green-muted/30">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 bg-[#064E3B] rounded-md">
              <span className="text-white font-bold text-sm">SAML</span>
            </div>
            <span className="font-semibold tracking-wide text-sm">
              <span className="text-[#064E3B]">Sabit Asset</span>
              <span className="text-black"> Management</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm text-black md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-green-dark transition-colors font-medium">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            {!loading && (
              client ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-green-light">
                      <AvatarImage src={client.avatar} alt={client.name || 'Client'} />
                      <AvatarFallback className="bg-green-muted text-green-dark font-semibold">
                        {client.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-black">{client.name}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-green-muted">
                    <DropdownMenuLabel className="text-black">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-green-muted" />
                    <DropdownMenuItem asChild>
                      <Link href="/client/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/client/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-green-muted" />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="rounded-lg px-6 py-2.5 shadow-lg"
                >
                  <Link href="/client/login">Client Login</Link>
                </Button>
              )
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-green-muted p-0 w-64 flex flex-col bg-white/95">
                {/* Brand Header */}
                <div className="flex items-center gap-2 px-4 py-4 border-b border-green-muted">
                  <div className="flex items-center justify-center h-8 w-8 bg-[#064E3B] rounded-md">
                    <span className="text-white font-bold text-sm">SAML</span>
                  </div>
                  <span className="font-semibold tracking-wide text-sm">
                    <span className="text-[#064E3B]">Sabit Asset</span>
                    <span className="text-black"> Management</span>
                  </span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-black">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-green-muted hover:text-green-dark transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-green-dark">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button at Bottom */}
                <div className="mt-auto border-t border-green-muted p-4 space-y-2">
                  {!loading && (
                    client ? (
                      <>
                        <div className="flex items-center gap-3 px-2 py-3 bg-green-muted rounded-lg mb-3">
                          <Avatar className="h-10 w-10 border-2 border-green-light">
                            <AvatarImage src={client.avatar} alt={client.name || 'Client'} />
                            <AvatarFallback className="bg-green-muted text-green-dark font-semibold">
                              {client.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-black truncate">{client.name}</p>
                            <p className="text-xs text-black truncate">{client.email}</p>
                          </div>
                        </div>
                        <Button
                          asChild
                          className="w-full rounded-lg px-6 py-2.5"
                        >
                          <Link href="/client/dashboard">Dashboard</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-lg px-6 py-2.5"
                        >
                          <Link href="/client/profile">Profile</Link>
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full rounded-lg px-6 py-2.5"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="w-full rounded-lg px-6 py-2.5"
                        >
                          <Link href="/client/login">Client Login</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-lg px-6 py-2.5"
                        >
                          <Link href="https://wa.me/8801401658685?text=Hi!%20I'd%20like%20to%20get%20a%20quote">Get a Quote</Link>
                        </Button>
                      </>
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
