import { NextResponse } from "next/server"
import { getEventsCached } from "@/lib/events"

export async function GET() {
  try {
    const events = await getEventsCached()
    const response = NextResponse.json({ success: true, data: events })
    response.headers.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300")
    return response
  } catch (error) {
    console.error("Error fetching public events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
