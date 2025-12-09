import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("best-sellers");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Best seller not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Best seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting best seller:', error);
    return NextResponse.json({ error: 'Failed to delete best seller' }, { status: 500 });
  }
}
