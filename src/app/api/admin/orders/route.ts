import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('meetbakery');
    const collection = database.collection('orders');

    const orders = await collection.find({}).sort({ orderDate: -1 }).toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
