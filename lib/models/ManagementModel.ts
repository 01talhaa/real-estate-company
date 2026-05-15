import mongoose, { Schema, Document, Model } from 'mongoose';
import { ManagementMember } from '@/types/management';

export interface IManagementMember extends Omit<ManagementMember, 'id'>, Document {
  id: string;
}

const BilingualTextSchema = new Schema({
  en: { type: String, required: true },
  bn: { type: String, required: true },
}, { _id: false });

const ManagementMemberSchema = new Schema<IManagementMember>({
  id: { type: String, required: true, unique: true },
  name: BilingualTextSchema,
  role: BilingualTextSchema,
  department: BilingualTextSchema,
  bio: BilingualTextSchema,
  image: { type: String, required: true },
  linkedin: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: String },
  updatedAt: { type: String }
}, {
  timestamps: true
});

const ManagementModel: Model<IManagementMember> = mongoose.models.Management || mongoose.model<IManagementMember>('Management', ManagementMemberSchema);

export default ManagementModel;
