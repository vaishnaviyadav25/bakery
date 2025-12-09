import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Promotional item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promotional item deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotional item:', error);
    return NextResponse.json({ error: 'Failed to delete promotional item' }, { status: 500 });
  }
}
