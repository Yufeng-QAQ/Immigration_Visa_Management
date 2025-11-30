import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  userId: string;
  password: string;
  role: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, require: true, unique: true },
  userId: { type: String, required: false },
  password: { type: String, required: true, select: false },
  role: { type: String, require: true },
},
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);


