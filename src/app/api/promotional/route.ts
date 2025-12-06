import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all promotional items
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const promotionalItems = await collection.find({}).sort({ _id: -1 }).toArray();

    return NextResponse.json({ promotionalItems });
  } catch (error) {
    console.error("Error fetching promotional items:", error);
    return NextResponse.json({ promotionalItems: [], error: "Failed to fetch promotional items" }, { status: 500 });
  }
}

// POST a new promotional item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate POST body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("promotional");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date().toISOString(), // add timestamp
    });

    return NextResponse.json({
      message: "Promotional added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding promotional item:", error);
    return NextResponse.json({ error: "Failed to add promotional" }, { status: 500 });
  }
}
