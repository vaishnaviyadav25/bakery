import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("best-sellers");

    const data = await collection.find({}).toArray();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Prevent execution during build time
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("best-sellers");

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Best seller added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding best seller:', error);
    return NextResponse.json({ error: 'Failed to add best seller' }, { status: 500 });
  }
}
