import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Product {
  _id?: ObjectId | string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  desc?: string;
  image?: string;
  images?: string[];
  createdAt?: Date;
}

// GET all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    const products = await collection.find({}).sort({ createdAt: -1 }).toArray();

    const serialized = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
    }));

    return NextResponse.json(serialized, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST add product
export async function POST(req: NextRequest) {
  try {
    const body: Product = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    const newProduct: Product = {
      name: body.name,
      price: body.price,
      category: body.category || "",
      description: body.description || body.desc || "",
      images: body.images || (body.image ? [body.image] : []),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json({
      message: "Product added",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
