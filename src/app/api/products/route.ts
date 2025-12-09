import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

interface Product {
  _id?: ObjectId | string;
  name: string;
  price: number;
  category?: string;
  description?: string; // backend field
  desc?: string;        // frontend alias
  image?: string;       // single image for old frontend
  images?: string[];    // new frontend array
  size?: string[];
  material?: string;
  createdAt?: Date;
}

// GET all products
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    const products = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize ObjectId and Date
    const serialized = products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
    }));

    return NextResponse.json(serialized, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST a new product
export async function POST(req: NextRequest) {
  try {
    const body: Product = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    // Normalize frontend fields
    const newProduct: Product = {
      name: body.name,
      price: body.price,
      category: body.category || "",
      description: body.description || body.desc || "",
      images: body.images || (body.image ? [body.image] : []),
      size: body.size || [],
      material: body.material || "",
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json({ message: "Product added", id: result.insertedId.toString() });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// PUT to update product
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const body: Product = await req.json();
    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    // Normalize fields
    const updateData: Partial<Product> = {
      name: body.name,
      price: body.price,
      category: body.category,
      description: body.description || body.desc,
      images: body.images,
      size: body.size,
      material: body.material,
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ message: "Product updated" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("meetbakery");
    const collection = db.collection<Product>("products");

    await collection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
