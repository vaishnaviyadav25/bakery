import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('products');

    const products = await collection.find({}).toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('products');

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Product added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  } finally {
    await client.close();
  }
}
