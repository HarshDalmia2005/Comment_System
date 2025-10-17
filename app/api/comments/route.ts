import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/models/Comment";

export async function GET(req: NextRequest) {
  await connectDB();
  const comments = await Comment.find().lean();
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { text, parent_id, user_id } = body;
  if (!text || !user_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const comment = await Comment.create({
    id: body.id ?? Date.now(),
    text,
    parent_id: parent_id ?? null,
    upvotes: body.upvotes ?? 0,
    created_at: body.created_at ?? new Date().toISOString(),
    user_id,
  });

  return NextResponse.json(comment, { status: 201 });
}
