import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all best-sellers
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("best-sellers");

    const bestSellers = await collection.find({}).sort({ _id: -1 }).toArray();

    return NextResponse.json({ bestSellers });
  } catch (error) {
    console.error("Error fetching best-sellers:", error);
    return NextResponse.json({ bestSellers: [], error: "Failed to fetch best-sellers" }, { status: 500 });
  }
}

// POST a new best-seller
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("best-sellers");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date().toISOString(), // add timestamp
    });

    return NextResponse.json({
      message: "Best seller added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding best-seller:", error);
    return NextResponse.json({ error: "Failed to add best-seller" }, { status: 500 });
  }
}
