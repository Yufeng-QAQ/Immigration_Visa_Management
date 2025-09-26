import mongoose, { Schema, Document } from "mongoose";

export interface IDepartmentInfoItem extends Document {
  college: string;
  department: string;
  supervisor: string;
  admin?: string;
}

export interface IEmployee extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  email: string;
  addresses: string[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  departmentInfo: IDepartmentInfoItem;
  visaHistory: mongoose.Types.ObjectId[];
  activateStatus: boolean;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: {type: String, require: true, unique: true},
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  addresses: [{type: String}],
  salary: Number,
  positionTitle: String,
  highestDegree: String,
  departmentInfo: {
    college: { type: String, required: true },
    department: { type: String, required: true },
    supervisor: { type: String, required: true },
    admin: { type: String },
  },
  visaHistory: [{ type: Schema.Types.ObjectId, ref: "VisaRecord" }],
  activateStatus: {type: Boolean, default: true},
});

export const Employee =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);