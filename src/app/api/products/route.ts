import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("products");

    const products = await collection.find({}).sort({ _id: -1 }).toArray();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ products: [], error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("products");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: "Product added successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("products");

    const result = await collection.updateOne({ id: id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection("products");

    const result = await collection.deleteOne({ id: parseInt(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
