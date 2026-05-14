/**
 * Admin utility functions
 */

import { RealEstateProject, SabitEvent } from "@/types"

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Format date and time
 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Get status color classes
 */
export function getStatusColor(
  status: "handover" | "ongoing" | "upcoming"
): string {
  switch (status) {
    case "handover":
      return "bg-green-100 text-green-700"
    case "ongoing":
      return "bg-blue-100 text-blue-700"
    case "upcoming":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

/**
 * Get event type color classes
 */
export function getEventTypeColor(type: string): string {
  switch (type) {
    case "launch":
      return "bg-purple-100 text-purple-700"
    case "investor-meet":
      return "bg-blue-100 text-blue-700"
    case "community":
      return "bg-green-100 text-green-700"
    case "announcement":
      return "bg-orange-100 text-orange-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname)
  } catch {
    return false
  }
}

/**
 * Calculate project progress display
 */
export function getProgressPercentage(project: RealEstateProject): number {
  return project.progressPercent || 0
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressBarColor(percentage: number): string {
  if (percentage < 33) return "bg-red-500"
  if (percentage < 66) return "bg-yellow-500"
  if (percentage < 100) return "bg-blue-500"
  return "bg-green-500"
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = "BDT"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "BDT" ? "BDT" : currency,
  }).format(amount)
}

/**
 * Calculate days until event
 */
export function getDaysUntilEvent(date: string): number {
  const eventDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)
  const timeDiff = eventDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
}

/**
 * Check if event is happening soon (within 7 days)
 */
export function isEventSoon(date: string): boolean {
  const daysUntil = getDaysUntilEvent(date)
  return daysUntil > 0 && daysUntil <= 7
}

/**
 * Get event status display
 */
export function getEventStatus(isUpcoming: boolean): string {
  return isUpcoming ? "Upcoming" : "Past"
}

/**
 * Format project summary for display
 */
export function getProjectSummary(project: RealEstateProject): string {
  const flats = project.flats ? `${project.flats} Flats` : ""
  const floors = project.floors ? `${project.floors} Floors` : ""
  const area = project.specifications?.totalAreaSqft
    ? `${project.specifications.totalAreaSqft.toLocaleString()} sqft`
    : ""

  return [flats, floors, area].filter(Boolean).join(" • ")
}

/**
 * Export projects to CSV
 */
export function exportProjectsToCSV(projects: RealEstateProject[]): string {
  const headers = [
    "ID",
    "Name (EN)",
    "Name (BN)",
    "Location (EN)",
    "Status",
    "Progress %",
    "Flats",
    "Floors",
  ]

  const rows = projects.map((p) => [
    p.id,
    p.name.en,
    p.name.bn,
    p.location.en,
    p.status,
    p.progressPercent || "",
    p.flats || "",
    p.floors || "",
  ])

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n")

  return csv
}

/**
 * Export events to CSV
 */
export function exportEventsToCSV(events: SabitEvent[]): string {
  const headers = ["ID", "Title (EN)", "Title (BN)", "Date", "Type", "Status"]

  const rows = events.map((e) => [
    e.id,
    e.title.en,
    e.title.bn,
    formatDate(e.date),
    e.type,
    e.isUpcoming ? "Upcoming" : "Past",
  ])

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n")

  return csv
}

/**
 * Download data as file
 */
export function downloadFile(data: string, filename: string): void {
  const element = document.createElement("a")
  element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`)
  element.setAttribute("download", filename)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
