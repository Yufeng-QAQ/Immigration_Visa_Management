import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  username: string;
  operation: string;
  recordName?: string;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>({
  username: { type: String, required: true },
  operation: { type: String, required: true },
  recordName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILog>("Log", LogSchema);
