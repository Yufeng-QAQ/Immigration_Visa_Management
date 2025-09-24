import mongoose, { Schema, Document } from "mongoose";

export interface IVisa extends Document {
  visaType: string;
  validFrom: Date,
  validTo: Date,
  status: string,
  employee: mongoose.Types.ObjectId[],
}

const VisaSchema = new Schema<IVisa>({
  visaType: { type: String, required: true },
  validTo: { type: Date, required: true },
  status: { type: String, default: "active" },
  employee: [{ type: Schema.Types.ObjectId, ref: "Employee", required: true }]
});

export const Visa =
  mongoose.models.Visa || mongoose.model<IVisa>("Visa", VisaSchema);