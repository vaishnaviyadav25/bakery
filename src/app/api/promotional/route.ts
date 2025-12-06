import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const data = await collection.find({}).toArray();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Promotional item added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding promotional item:', error);
    return NextResponse.json({ error: 'Failed to add promotional item' }, { status: 500 });
  }
}
