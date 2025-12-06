import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST a new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    if (!orderData || !orderData.customer || !orderData.items) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("orders");

    // Set default values
    const now = new Date().toISOString();
    const newOrder = {
      ...orderData,
      orderDate: orderData.orderDate || now,
      orderStatus: orderData.orderStatus || "pending",
      payment: {
        status: orderData.payment?.status || "pending",
        ...orderData.payment,
      },
      deliveryDate:
        orderData.deliveryDate ||
        (orderData.orderStatus === "delivered" ? now : null),
    };

    const result = await collection.insertOne(newOrder);

    return NextResponse.json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET orders by customer email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ orders: [] }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("orders");

    const orders = await collection
      .find({ "customer.email": email })
      .sort({ orderDate: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
