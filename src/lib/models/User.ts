// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  image_url: string;
  email: string;
  username: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    first_name: { type: String, required: true, unique: true },
    last_name: { type: String, required: true, unique: true },
    image_url: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Fix model overwrite issue in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
