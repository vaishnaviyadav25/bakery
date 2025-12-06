import clientPromise from "@/lib/mongodb";

interface Order {
  _id?: string;
  products: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  orderDate: Date;
  customer?: {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
  };
  [key: string]: any;
}

// GET all orders
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");

    const orders = await db.collection<Order>("orders").find({}).sort({ orderDate: -1 }).toArray();

    // Serialize ObjectId and Date
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id?.toString(),
      orderDate: order.orderDate.toISOString(),
    }));

    return new Response(JSON.stringify(serializedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(JSON.stringify({ message: "Error fetching orders", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST a new order
export async function POST(req: Request) {
  try {
    const body: Order = await req.json();

    if (!body.products || !body.totalAmount) {
      return new Response(JSON.stringify({ message: "Products and totalAmount are required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("meetbakery");

    const result = await db.collection<Order>("orders").insertOne({
      ...body,
      orderDate: new Date(),
      status: body.status || "pending",
    });

    return new Response(JSON.stringify({ message: "Order added successfully", id: result.insertedId.toString() }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding order:", error);
    return new Response(JSON.stringify({ message: "Error adding order", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
