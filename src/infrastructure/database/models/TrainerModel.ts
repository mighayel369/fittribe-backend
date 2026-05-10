
import mongoose, { Schema, Document } from "mongoose";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { UserRole } from "domain/constants/user-role";
export interface ITrainer extends Document, TrainerEntity { }

const TrainerSchema = new Schema<ITrainer>(
  {
    trainerId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: Boolean, default: true },
    role: { type: String, default: UserRole.TRAINER },
    verified: {
      type: String,
      enum: Object.values(TRAINER_STATUS),
      default: TRAINER_STATUS.PENDING,
      index: true
    },
    pricePerSession: { type: Number, required: true },
    experience: { type: Number, default: 0 },
    programs: [{ type: String, ref: 'Program' }],
    certificate: { type: String },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    languages: [{ type: String }],
    gender: { type: String },
    phone: { type: String },
    address: { type: String },
    rejectReason: { type: String },
    profilePic: { type: String }
  },
  { timestamps: true }
);

TrainerSchema.loadClass(TrainerEntity)

export default mongoose.model<ITrainer>("Trainer", TrainerSchema);