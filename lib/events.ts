import dbConnect from './mongoose';
import EventModel from './models/EventModel';
import { apiCache, CacheTTL, withCache } from './cache';
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { Event } from '@/types/event';

const EVENTS_CACHE_KEY = 'events:all';

function serializeEvent(doc: any): Event {
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) delete obj._id;
  if (obj.__v !== undefined) delete obj.__v;
  return obj as Event;
}

export async function getEvents(): Promise<Event[]> {
  await dbConnect();
  try {
    return await withCache(
      EVENTS_CACHE_KEY,
      async () => {
        const events = await EventModel.find().sort({ date: -1 }).lean();
        return events.map((e: any) => {
          if (e._id) delete e._id;
          if (e.__v !== undefined) delete e.__v;
          return e as Event;
        });
      },
      CacheTTL.MEDIUM
    );
  } catch (error) {
    console.error('Error fetching events from MongoDB:', error);
    return [];
  }
}

export const getEventsCached = unstable_cache(
  async () => getEvents(),
  ["events:all"],
  { revalidate: 60, tags: ["events"] }
);

export async function createEvent(event: Event) {
  await dbConnect();
  await EventModel.create(event);
  apiCache.delete(EVENTS_CACHE_KEY);
  revalidateTag("events");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function updateEvent(updatedEvent: Event) {
  await dbConnect();
  await EventModel.findOneAndUpdate({ id: updatedEvent.id }, updatedEvent);
  apiCache.delete(EVENTS_CACHE_KEY);
  revalidateTag("events");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/edit/${updatedEvent.id}`);
  revalidatePath("/events");
}

export async function deleteEvent(eventId: string) {
  await dbConnect();
  await EventModel.findOneAndDelete({ id: eventId });
  apiCache.delete(EVENTS_CACHE_KEY);
  revalidateTag("events");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
