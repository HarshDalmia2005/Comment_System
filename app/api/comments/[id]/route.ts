import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const comment = await Comment.findOne({ id: Number(id) }).lean();
  if (!comment)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(comment);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const updated = await Comment.findOneAndUpdate(
    { id: Number(id) },
    { $inc: { upvotes: 1 } },
    { new: true },
  ).lean();
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
