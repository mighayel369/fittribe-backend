

import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "domain/constants/user-role";
import { UserEntity } from "domain/entities/UserEntity";
export interface IUser extends Document, UserEntity { }

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: Boolean, default: false },
    role: { type: String, default: UserRole.USER },
    gender: { type: String },
    age: { type: Number },
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Number },
  },
  { timestamps: true }
);

UserSchema.loadClass(UserEntity);

export default mongoose.model<IUser>("User", UserSchema);