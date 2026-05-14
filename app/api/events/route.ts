import { NextResponse } from "next/server"
import { getEvents } from "@/src/lib/github/event-operations"

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json({ success: true, data: events })
  } catch (error) {
    console.error("Error fetching public events:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 })
  }
}
