import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName } = await request.json();

    const client = await clientPromise;
    const db = client.db("meetbakery");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ uid });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" });
    }

    // Insert user
    const result = await db.collection("users").insertOne({
      uid,
      email,
      displayName,
      createdAt: new Date()
    });

    return NextResponse.json({ message: "User stored", result });
  } catch (error) {
    console.error('Error storing user:', error);
    return NextResponse.json({ message: "Error storing user", error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
