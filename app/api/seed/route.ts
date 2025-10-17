import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import users from "@/data/users.json";
import comments from "@/data/comments.json";

const MONGODB_URI = process.env.MONGODB_URI;

export async function POST() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI not set");
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 500 });
  }

  const client = new MongoClient(MONGODB_URI, {});

  try {
    await client.connect();
    const db = client.db();
    const results: Record<string, number> = {};

    const delUsers = await db.collection("users").deleteMany({});
    const delComments = await db.collection("comments").deleteMany({});
    results.deletedUsers = delUsers.deletedCount ?? 0;
    results.deletedComments = delComments.deletedCount ?? 0;

    if (Array.isArray(users) && users.length) {
      const resUsers = await db
        .collection("users")
        .insertMany(users, { ordered: false });
      results.insertedUsers = resUsers.insertedCount ?? 0;
    }

    if (Array.isArray(comments) && comments.length) {
      const resComments = await db
        .collection("comments")
        .insertMany(comments, { ordered: false });
      results.insertedComments = resComments.insertedCount ?? 0;
    }

    return NextResponse.json({ message: "Data reset and inserted", results });
  } catch (err) {
    console.error("seed error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await client.close();
  }
}
