import mongoose, { Schema, Document, Model } from 'mongoose';
import { Project } from '@/types/project';

export interface IProject extends Omit<Project, 'id'>, Document {
  id: string;
}

const BilingualTextSchema = new Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true },
}, { _id: false });

const NearbyPlaceSchema = new Schema({
  category: {
    type: String,
    enum: ["hospital", "school", "college", "university", "mall", "park", "mosque", "transport"],
    required: true,
  },
  name: { type: BilingualTextSchema, required: true },
  distance: { type: String, required: true },
}, { _id: false });

const ProjectSchema = new Schema<IProject>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: BilingualTextSchema,
  location: BilingualTextSchema,
  address: BilingualTextSchema,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['handover', 'ongoing', 'upcoming'], required: true },
  description: BilingualTextSchema,
  longDescription: BilingualTextSchema,
  image: { type: String, required: true },
  gallery: [{ type: String }],
  completionDate: { type: String, required: true },
  progressPercent: { type: Number, required: true, default: 0 },
  flats: { type: Number, required: true },
  floors: { type: Number, required: true },
  specifications: {
    totalAreaSqft: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    parkingSpaces: { type: Number, required: true },
    yearBuilt: { type: Number, required: true }
  },
  amenities: {
    interior: [{ type: BilingualTextSchema }],
    exterior: [{ type: BilingualTextSchema }],
    building: [{ type: BilingualTextSchema }]
  },
  financials: {
    sharePrice: { type: Number, required: true },
    pricePerSqft: { type: Number, required: true },
    currency: { type: String, required: true, default: 'BDT' },
    expectedROI: { type: Number, required: true }
  },
  nearbyPlaces: [{ type: NearbyPlaceSchema }]
}, {
  timestamps: true
});

const ProjectModel: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
