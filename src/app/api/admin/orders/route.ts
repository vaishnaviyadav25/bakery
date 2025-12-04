import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('orders');

    const orders = await collection.find({}).sort({ orderDate: -1 }).toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  } finally {
    await client.close();
  }
}
