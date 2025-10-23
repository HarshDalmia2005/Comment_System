import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const created_at = new Date().toISOString();
    const avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    const id = crypto.randomUUID();

    const user = await User.create({
      id,
      name,
      email,
      password: hashed,
      created_at,
      avatar,
    });
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    return NextResponse.json(userObj, { status: 201 });
  } catch (err: any) {
    console.error("register error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
