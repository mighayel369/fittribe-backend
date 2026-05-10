import mongoose, { Schema, Document } from "mongoose";
import { ProgramEntity } from "domain/entities/ProgramEntity";


export interface IProgram extends Document, ProgramEntity { }

const programSchema = new Schema<IProgram>(
  {
    programId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    programPic: { type: String },
    status: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true
  }
);

programSchema.loadClass(ProgramEntity)

export default mongoose.model<IProgram>("Program", programSchema);