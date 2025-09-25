import mongoose, { Schema, Document } from "mongoose";

export interface IVisaRecord extends Document {
  recordId: string;
  employee: mongoose.Types.ObjectId;
  visa: mongoose.Types.ObjectId;
  status: "Active" | "Expired" | "Pending";
}

const VisaRecordSchema = new Schema<IVisaRecord>({
  recordId: { type: String, required: true, unique: true },
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  visa: { type: Schema.Types.ObjectId, ref: "VisaType", required: true },
  status: { type: String, enum: ["Active", "Expired", "Pending"], default: "Pending" }
});

export const VisaRecord =
  mongoose.models.VisaRecord || mongoose.model<IVisaRecord>("VisaRecord", VisaRecordSchema);