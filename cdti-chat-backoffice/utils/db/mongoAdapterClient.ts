// utils/db/mongoAdapterClient.ts
import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable for HMR.
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, avoid global variables.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

/**
 * Function to ensure the database is connected before use.
 * You can call this in your application wherever a connection is required.
 */
export async function connectToDatabase() {
  if (!clientPromise) {
    throw new Error("MongoDB client promise is not initialized");
  }
  return clientPromise;
}

export default clientPromise;
