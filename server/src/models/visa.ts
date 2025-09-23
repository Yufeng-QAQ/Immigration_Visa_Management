import mongoose, { Schema, Document } from "mongoose";

export interface IVisa extends Document {
  visaType: string;
  validPeriod: {
    startDate: Date;
    expireDate: Date;
  };
}

const VisaSchema = new Schema<IVisa>({
  visaType: { type: String, required: true },
  validPeriod: {
    startDate: Date,
    expireDate: Date,
  }
});

export const Visa =
  mongoose.models.Visa || mongoose.model<IVisa>("Visa", VisaSchema);