"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Briefcase, FolderKanban, Users, LogOut, FlaskConical, UserCircle, FileText, Building2, Lightbulb, Images } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear the cookie
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    logout()
    router.push("/admin/login")
  }

  // If it's the login page, don't wrap with ProtectedRoute
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-white">
        {/* Admin Header */}
        <header className="border-b border-green-muted bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center h-10 w-10 bg-[#064E3B] rounded-lg shadow-md">
                  <span className="text-white font-bold text-base">SAML</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#064E3B]">Admin Panel</span>
                  <span className="text-xs text-black">Sabit Asset Management</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/properties"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Properties
                </Link>
                <Link
                  href="/admin/insights"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Insights
                </Link>
                <Link
                  href="/admin/galleries"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <Images className="w-4 h-4" />
                  Galleries
                </Link>
                <Link
                  href="/admin/services"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  Services
                </Link>
                <Link
                  href="/admin/team"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Team
                </Link>
                <Link
                  href="/admin/clients"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Clients
                </Link>
                <Link
                  href="/admin/inquiries"
                  className="text-sm text-black hover:text-green-dark transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Inquiries
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-black">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-green-light text-green-dark hover:bg-green-muted">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 bg-gradient-to-b from-green-muted to-white min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
