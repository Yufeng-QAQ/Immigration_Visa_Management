import mongoose, { Schema, Document } from "mongoose";

export interface IVisaRecord extends Document {
  recordId: string;
  employee: mongoose.Types.ObjectId;
  visaType: string;
  issueDate: Date,
  expireDate: Date,
  status: "Active" | "Expired" | "Pending";
}

const VisaRecordSchema = new Schema<IVisaRecord>({
  recordId: { type: String, required: true, unique: true },
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  visaType: {type: String, required: true},
  issueDate: { type: Date, required: true },
  expireDate: { type: Date, required: true },
  status: { type: String, enum: ["Active", "Expired", "Pending"], default: "Pending" }
});

export const VisaRecord =
  mongoose.models.VisaRecord || mongoose.model<IVisaRecord>("VisaRecord", VisaRecordSchema);