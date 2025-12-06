import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).sort({ createdAt: -1 }).toArray();

    const transformedReviews = reviews.map(review => ({
      text: review.comment || review.text,
      name: review.name || 'Anonymous',
      rating: review.rating,
      date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("reviews");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date()
    });

    return NextResponse.json({ message: 'Review added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
