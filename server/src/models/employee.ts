import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  email: string;
  addresses: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }[];
  salary: number;
  positionTitle: string;
  highestDegree: string;
  department?: mongoose.Types.ObjectId;
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
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    }
  ],
  salary: Number,
  positionTitle: String,
  highestDegree: String,
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  visaHistory: [{ type: Schema.Types.ObjectId, ref: "VisaRecord" }],
  activateSatatus: {type: Boolean, default: true},
});

export const Employee =
  mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);