import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).toArray();

    const transformedReviews = reviews.map(review => ({
      text: review.comment,
      name: 'Anonymous', // Since name is not stored
      rating: review.rating,
      date: review._id.getTimestamp().toISOString().split('T')[0] // Use creation date from _id
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
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
    const collection = db.collection("reviews");

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Review added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
