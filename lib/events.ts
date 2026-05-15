import { getGithubFile, updateGithubFile } from "./github"
import { Event } from "@/types/event"
import { revalidatePath } from "next/cache"

const EVENTS_FILE_PATH = "data/events.json"

export async function getEvents(): Promise<Event[]> {
  const file = await getGithubFile(EVENTS_FILE_PATH)
  if (!file) {
    return []
  }
  const events = JSON.parse(file.content) as Event[]
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function createEvent(event: Event) {
  const events = await getEvents()
  const newEvents = [event, ...events]
  const file = await getGithubFile(EVENTS_FILE_PATH)
  await updateGithubFile(
    EVENTS_FILE_PATH,
    JSON.stringify(newEvents, null, 2),
    file?.sha || ""
  )
  revalidatePath("/admin/events")
  revalidatePath("/events")
}

export async function updateEvent(updatedEvent: Event) {
  const events = await getEvents()
  const newEvents = events.map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  )
  const file = await getGithubFile(EVENTS_FILE_PATH)
  await updateGithubFile(
    EVENTS_FILE_PATH,
    JSON.stringify(newEvents, null, 2),
    file?.sha || ""
  )
  revalidatePath("/admin/events")
  revalidatePath(`/admin/events/edit/${updatedEvent.id}`)
  revalidatePath("/events")
}

export async function deleteEvent(eventId: string) {
  const events = await getEvents()
  const newEvents = events.filter((event) => event.id !== eventId)
  const file = await getGithubFile(EVENTS_FILE_PATH)
  await updateGithubFile(
    EVENTS_FILE_PATH,
    JSON.stringify(newEvents, null, 2),
    file?.sha || ""
  )
  revalidatePath("/admin/events")
  revalidatePath("/events")
}
