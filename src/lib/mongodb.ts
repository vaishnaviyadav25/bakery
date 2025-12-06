import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable in .env.local");
}

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("MONGO_URI starts with:", process.env.MONGO_URI?.substring(0, 20) + "...");

// Use a global variable to preserve the client across hot reloads in dev
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(process.env.MONGO_URI!, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    (global as any)._mongoClientPromise = client.connect().then((client) => {
      console.log("✅ MongoDB connected successfully!");
      return client;
    }).catch((error) => {
      console.error("❌ MongoDB connection failed:", error);
      throw error;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(process.env.MONGO_URI!, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  clientPromise = client.connect().then((client) => {
    console.log("✅ MongoDB connected successfully!");
    return client;
  }).catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  });
}

export default clientPromise;
