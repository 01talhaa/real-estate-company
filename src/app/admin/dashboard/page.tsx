"use client"

/**
 * Admin dashboard page
 */

import { useEffect, useState } from "react"
import { Building2, Calendar, BarChart3, TrendingUp } from "lucide-react"
import { RealEstateProject, SabitEvent } from "@/types"
import { DashboardCardSkeleton } from "@/components/admin/skeletons"

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<RealEstateProject[]>([])
  const [events, setEvents] = useState<SabitEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, eventsRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/events"),
        ])

        if (projectsRes.ok) {
          const data = await projectsRes.json()
          setProjects(data.data || [])
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json()
          setEvents(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: Building2,
      color: "blue",
    },
    {
      label: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "purple",
    },
    {
      label: "Ongoing Projects",
      value: projects.filter((p) => p.status === "ongoing").length,
      icon: BarChart3,
      color: "green",
    },
    {
      label: "Upcoming Events",
      value: events.filter((e) => e.isUpcoming).length,
      icon: TrendingUp,
      color: "orange",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: "bg-blue-50 text-blue-600 border-blue-200",
            purple: "bg-purple-50 text-purple-600 border-purple-200",
            green: "bg-green-50 text-green-600 border-green-200",
            orange: "bg-orange-50 text-orange-600 border-orange-200",
          }

          if (isLoading) {
            return <DashboardCardSkeleton key={index} />
          }

          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg border ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h2>
          {isLoading ? (
            <div className="space-y-3">
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(-3).map((project) => (
                <div
                  key={project.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <p className="font-medium text-gray-900">{project.name.en}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{project.location.en}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        project.status === "handover"
                          ? "bg-green-100 text-green-700"
                          : project.status === "ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No projects yet. Create your first project!</p>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Events</h2>
          {isLoading ? (
            <div className="space-y-3">
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(-3).map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <p className="font-medium text-gray-900">{event.title.en}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        event.isUpcoming
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No events yet. Create your first event!</p>
          )}
        </div>
      </div>
    </div>
  )
}
