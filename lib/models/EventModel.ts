import mongoose, { Schema, Document, Model } from 'mongoose';
import { Event } from '@/types/event';

export interface IEvent extends Omit<Event, 'id'>, Document {
  id: string;
}

const BilingualTextSchema = new Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true },
}, { _id: false });

const EventSchema = new Schema<IEvent>({
  id: { type: String, required: true, unique: true },
  title: BilingualTextSchema,
  date: { type: String, required: true },
  location: BilingualTextSchema,
  description: BilingualTextSchema,
  type: { type: String, enum: ["announcement", "event", "milestone"], required: true },
  displayImage: { type: String, required: true },
  registrationLink: { type: String },
  isUpcoming: { type: Boolean, required: true, default: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, {
  timestamps: true // This will manage `createdAt` and `updatedAt` on the MongoDB side as well, but we'll also map it to the string fields.
});

const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
