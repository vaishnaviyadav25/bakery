import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string/meetbakery?retryWrites=true&w=majority';
const client = new MongoClient(uri);

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('isAdmin');
    const email = searchParams.get('email');

    // Check if user is admin (you might want to implement proper admin verification)
    if (!isAdmin || !email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, newStatus, newPaymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('meetbakery');
    const collection = database.collection('orders');

    const updateData: any = {};

    if (newStatus) {
      updateData.orderStatus = newStatus;
      // Set delivery date when order is marked as delivered
      if (newStatus === 'delivered') {
        updateData.deliveryDate = new Date().toISOString();
      }
    }

    if (newPaymentStatus) {
      updateData['payment.status'] = newPaymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  } finally {
    await client.close();
  }
}
