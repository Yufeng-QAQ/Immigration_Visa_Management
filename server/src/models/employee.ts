import mongoose, { Schema, Document } from "mongoose";

export interface VisaRecord {
  type: string;
  addedAt: Date;
}

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  layer1: string;
  layer2: string;
  visa: VisaRecord[];
}

const EmployeeSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  layer1: { type: String, required: true },
  layer2: { type: String, required: true },
  visa: [
    {
      type: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});


export default mongoose.model<IEmployee>("Employee", EmployeeSchema);