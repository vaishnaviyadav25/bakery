import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("meetbakery");

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ orderDate: -1 })
      .toArray();

    // Serialize dates
    const serializedOrders = orders.map(order => ({
      ...order,
      orderDate: order.orderDate.toISOString(),
    }));

    return new Response(JSON.stringify(serializedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error fetching orders", error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
