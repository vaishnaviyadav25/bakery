import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const client = await clientPromise;
    const database = client.db('meetbakery');
    const collection = database.collection('orders');

    // Add default fields
    orderData.orderDate = orderData.orderDate || new Date().toISOString();
    orderData.orderStatus = orderData.orderStatus || 'pending';
    orderData.payment.status = orderData.payment.status || 'pending';

    // Ensure deliveryDate is set if not provided (optional field)
    if (!orderData.deliveryDate && orderData.orderStatus === 'delivered') {
      // Set delivery date to current date if order is marked as delivered
      orderData.deliveryDate = new Date().toISOString();
    }

    const result = await collection.insertOne(orderData);

    return NextResponse.json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ orders: [] }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db('meetbakery');
    const collection = database.collection('orders');

    const orders = await collection.find({ 'customer.email': email }).sort({ orderDate: -1 }).toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
