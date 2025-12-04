import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('best-sellers');

    const bestSellers = await collection.find({}).toArray();

    return NextResponse.json(bestSellers);
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json([], { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('best-sellers');

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Best seller added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding best seller:', error);
    return NextResponse.json({ error: 'Failed to add best seller' }, { status: 500 });
  } finally {
    await client.close();
  }
}
