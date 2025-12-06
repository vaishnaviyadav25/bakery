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
    console.error('Error fetching promotional:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Promotional added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding promotional:', error);
    return NextResponse.json({ error: 'Failed to add promotional' }, { status: 500 });
  }
}
