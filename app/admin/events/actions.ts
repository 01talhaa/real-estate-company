"use server"

import {
  createEvent as apiCreateEvent,
  deleteEvent as apiDeleteEvent,
  getEvents as apiGetEvents,
  updateEvent as apiUpdateEvent,
} from "@/lib/events"
import { Event } from "@/types/event"
import { revalidatePath } from "next/cache"

export async function getEvents() {
  return await apiGetEvents()
}

export async function createEvent(event: Event) {
  await apiCreateEvent(event)
  revalidatePath("/admin/events")
}

export async function updateEvent(event: Event) {
  await apiUpdateEvent(event)
  revalidatePath("/admin/events")
  revalidatePath(`/admin/events/edit/${event.id}`)
}

export async function deleteEvent(eventId: string) {
  await apiDeleteEvent(eventId)
  revalidatePath("/admin/events")
}
