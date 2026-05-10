import mongoose, { Schema, Document } from "mongoose";
import { AdminEntity } from "domain/entities/AdminEntity";
export interface IAdminDocument extends Document,AdminEntity {}

const AdminSchema = new Schema<IAdminDocument>({
  adminId:{type:String,required:true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

AdminSchema.loadClass(AdminEntity)

const Admin = mongoose.models.admin || mongoose.model<IAdminDocument>('admin', AdminSchema);
export default Admin;