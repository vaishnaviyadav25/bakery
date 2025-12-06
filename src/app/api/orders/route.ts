import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");

    if (req.method === "GET") {
      // Get all orders (admin only)
      const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(orders);
    } else if (req.method === "POST") {
      // Create new order
      const order = req.body;
      const result = await db.collection("orders").insertOne({
        ...order,
        createdAt: new Date(),
        status: "pending"
      });
      res.status(201).json({ message: "Order created", orderId: result.insertedId });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing request", error });
  }
}
