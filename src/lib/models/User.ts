// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // hash later with bcrypt
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Fix model overwrite issue in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
