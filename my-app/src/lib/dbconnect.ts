import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_ATLAS_URI;
const dbName = process.env.MONGODB_DB || "ecommerce2";

if (!uri) {
  throw new Error("Please define the MONGODB_ATLAS_URI environment variable inside .env.production");
}

/**
 * globalWithMongo is marked 'const' to satisfy ESLint.
 * It caches the connection promise in development to prevent connection leaks.
 */
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const connection = await clientPromise;
  const db = connection.db(dbName);
  return { client: connection, db };
}

export default connectToDatabase;