import { Schema, model, Document } from "mongoose";   

export interface IDepartment extends Document {
  collegeName: string;
  departmentName: string;
  supervisor: string;
  admin: boolean;
}

const DepartmentSchema = new Schema<IDepartment>({
  collegeName: { type: String, required: true },
  departmentName: { type: String, required: true },
  supervisor: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

export const Department = model<IDepartment>("Department", DepartmentSchema);