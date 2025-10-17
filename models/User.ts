import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String},
    created_at: { type: String, }, // keep string to preserve JSON formatting
    email:{type: String},
    password:{type: String}
  },
  { versionKey: false },
);

export const User = models.User || model("User", UserSchema);
export default User;
