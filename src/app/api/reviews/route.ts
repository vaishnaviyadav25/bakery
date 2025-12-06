import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('reviews');

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
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('reviews');

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Review added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  } finally {
    await client.close();
  }
}
