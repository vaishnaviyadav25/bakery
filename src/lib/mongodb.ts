import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsAllowInvalidCertificates: true, // dev only
};

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, options);
    (global as any)._mongoClientPromise = client.connect()
      .then((client) => {
        console.log("✅ MongoDB connected (dev)");
        return client;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed (dev):", err);
        throw err;
      });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(process.env.MONGODB_URI, options);
  clientPromise = client.connect()
    .then((client) => {
      console.log("✅ MongoDB connected (prod)");
      return client;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed (prod):", err);
      throw err;
    });
}

export default clientPromise;
