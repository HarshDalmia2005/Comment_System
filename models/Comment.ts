import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    id: { type: Number, required: true },
    parent_id: { type: Number, default: null },
    text: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    created_at: { type: String, required: true }, // keep string to preserve JSON formatting
    user_id: { type: String, required: true },
  },
  { versionKey: false },
);

// ensure model exists across hot reloads
export const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
