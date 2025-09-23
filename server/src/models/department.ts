import { Schema, model, Document } from "mongoose";   

export interface IDepartment extends Document {
  collegeName: string;
  departmentName: string;
  supervisor?: string;
  admin?: string;
}

const DepartmentSchema = new Schema<IDepartment>({
  collegeName: { type: String, required: true },
  departmentName: { type: String, required: true },
  supervisor: String,
  admin: String,
});

export const Department = model<IDepartment>("Department", DepartmentSchema);