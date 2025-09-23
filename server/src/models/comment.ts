import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  record: mongoose.Types.ObjectId;
  content: string;
  date: Date;
}

const CommentSchema = new Schema<IComment>({
  record: { type: Schema.Types.ObjectId, ref: "VisaRecord", required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const Comment =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
