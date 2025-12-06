import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all reviews
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("reviews");

    const reviews = await collection.find({}).sort({ _id: -1 }).toArray();

    const transformedReviews = reviews.map((review) => ({
      text: review.comment || "",
      name: review.name || "Anonymous",
      rating: review.rating || 0,
      date: review._id.getTimestamp().toISOString().split("T")[0],
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { reviews: [], error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body || !body.comment || typeof body.rating !== "number") {
      return NextResponse.json(
        { error: "Invalid review data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("reviews");

    const result = await collection.insertOne({
      ...body,
      name: body.name || "Anonymous",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Review added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}
