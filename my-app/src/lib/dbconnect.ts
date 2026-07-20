// src/lib/dbconnect.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_ATLAS_URI;
const dbName = process.env.MONGODB_DB || "ecommerce2";

if (!uri && process.env.NODE_ENV === "production") {
  console.warn("MONGODB_ATLAS_URI is missing. Skipping connection for build.");
}

interface MongoClientCache {
  conn: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

declare global {
  var mongoCache: MongoClientCache | undefined;
}

// FIX: Changed 'let' to 'const' to satisfy ESLint's prefer-const rule
const cached: MongoClientCache = global.mongoCache || { conn: null, promise: null };

if (!global.mongoCache) {
  global.mongoCache = cached;
}

export async function connectToDatabase() {
  if (!uri) return { client: null, db: null };

  if (cached.conn) {
    return { client: cached.conn, db: cached.conn.db(dbName) };
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 60000, 
    };

    const client = new MongoClient(uri, opts);
    cached.promise = client.connect();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; 
    throw e;
  }

  return { client: cached.conn, db: cached.conn.db(dbName) };
}

export default connectToDatabase;
