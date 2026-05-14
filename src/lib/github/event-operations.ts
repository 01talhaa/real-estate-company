/**
 * Event CRUD operations via GitHub API
 */

import { SabitEvent, ApiResponse } from "@/types"
import { getGitHubClient } from "./client"
import fs from "fs/promises"
import path from "path"

const EVENTS_PATH = "data/events.json"
const LOCAL_EVENTS_PATH = path.resolve(process.cwd(), "data", "events.json")

async function readLocalEvents(): Promise<SabitEvent[]> {
  try {
    const content = await fs.readFile(LOCAL_EVENTS_PATH, "utf8")
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeLocalEvents(events: SabitEvent[]) {
  await fs.mkdir(path.dirname(LOCAL_EVENTS_PATH), { recursive: true })
  await fs.writeFile(LOCAL_EVENTS_PATH, JSON.stringify(events, null, 2), "utf8")
}

/**
 * Get all events
 */
export async function getEvents(): Promise<SabitEvent[]> {
  try {
    const client = getGitHubClient()
    const events = await client.getJSON<SabitEvent[]>(EVENTS_PATH)
    return Array.isArray(events) ? events : []
  } catch (error) {
    console.error("Error fetching events:", error)

    if (process.env.NODE_ENV !== "production") {
      try {
        return await readLocalEvents()
      } catch (fsErr) {
        console.error("Local events fallback failed:", fsErr)
      }
    }

    return []
  }
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<SabitEvent | null> {
  try {
    const events = await getEvents()
    return events.find((e) => e.id === id) || null
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error)
    return null
  }
}

/**
 * Create new event
 */
export async function createEvent(event: SabitEvent): Promise<ApiResponse<SabitEvent>> {
  const newEvent: SabitEvent = {
    ...event,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    const client = getGitHubClient()
    const events = await getEvents()

    // Check if event with same ID already exists
    if (events.some((e) => e.id === event.id)) {
      return {
        success: false,
        error: "Event with this ID already exists",
      }
    }

    // Add timestamps
    const updatedEvents = [...events, newEvent]

    await client.updateJSON(EVENTS_PATH, updatedEvents, `Create event: ${event.title.en}`)

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      data: newEvent,
      message: "Event created successfully",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create event"

    if (process.env.NODE_ENV !== "production") {
      try {
        const events = await readLocalEvents()

        if (events.some((existing) => existing.id === event.id)) {
          return {
            success: false,
            error: "Event with this ID already exists",
          }
        }

        const updatedEvents = [...events, newEvent]
        await writeLocalEvents(updatedEvents)

        return {
          success: true,
          data: newEvent,
          message: "Event saved locally (GitHub access unavailable).",
        }
      } catch (fsErr) {
        console.error("Local event fallback write failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Update event
 */
export async function updateEvent(id: string, updates: Partial<SabitEvent>): Promise<ApiResponse<SabitEvent>> {
  try {
    const client = getGitHubClient()
    const events = await getEvents()

    const eventIndex = events.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return {
        success: false,
        error: "Event not found",
      }
    }

    const updatedEvent: SabitEvent = {
      ...events[eventIndex],
      ...updates,
      id: events[eventIndex].id,
      createdAt: events[eventIndex].createdAt,
      updatedAt: new Date().toISOString(),
    }

    events[eventIndex] = updatedEvent

    await client.updateJSON(EVENTS_PATH, events, `Update event: ${id}`)

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      data: updatedEvent,
      message: "Event updated successfully",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update event"

    if (process.env.NODE_ENV !== "production") {
      try {
        const events = await readLocalEvents()
        const eventIndex = events.findIndex((e) => e.id === id)

        if (eventIndex === -1) {
          return {
            success: false,
            error: "Event not found",
          }
        }

        const updatedEvent: SabitEvent = {
          ...events[eventIndex],
          ...updates,
          id: events[eventIndex].id,
          createdAt: events[eventIndex].createdAt,
          updatedAt: new Date().toISOString(),
        }

        events[eventIndex] = updatedEvent
        await writeLocalEvents(events)

        return {
          success: true,
          data: updatedEvent,
          message: "Event updated locally (GitHub access unavailable).",
        }
      } catch (fsErr) {
        console.error("Local event fallback update failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Delete event
 */
export async function deleteEvent(id: string): Promise<ApiResponse> {
  try {
    const client = getGitHubClient()
    const events = await getEvents()

    const eventIndex = events.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return {
        success: false,
        error: "Event not found",
      }
    }

    const deletedEvent = events[eventIndex]
    const updatedEvents = events.filter((e) => e.id !== id)

    await client.updateJSON(EVENTS_PATH, updatedEvents, `Delete event: ${id}`)

    // Trigger Vercel redeploy
    await client.triggerRedeploy(process.env.VERCEL_REDEPLOY_WEBHOOK)

    return {
      success: true,
      message: `Event "${deletedEvent.title.en}" deleted successfully`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete event"

    if (process.env.NODE_ENV !== "production") {
      try {
        const events = await readLocalEvents()
        const event = events.find((existing) => existing.id === id)

        if (!event) {
          return {
            success: false,
            error: "Event not found",
          }
        }

        await writeLocalEvents(events.filter((existing) => existing.id !== id))

        return {
          success: true,
          message: `Event "${event.title.en}" deleted locally (GitHub access unavailable).`,
        }
      } catch (fsErr) {
        console.error("Local event fallback delete failed:", fsErr)
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Get upcoming events
 */
export async function getUpcomingEvents(): Promise<SabitEvent[]> {
  try {
    const events = await getEvents()
    return events.filter((e) => e.isUpcoming).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

/**
 * Get past events
 */
export async function getPastEvents(): Promise<SabitEvent[]> {
  try {
    const events = await getEvents()
    return events.filter((e) => !e.isUpcoming).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error fetching past events:", error)
    return []
  }
}
