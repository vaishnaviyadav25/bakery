import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === "development",
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then(client => {
      console.log("✅ MongoDB connected (dev)");
      return client;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then(client => {
    console.log("✅ MongoDB connected (prod)");
    return client;
  });
}

export default clientPromise;
