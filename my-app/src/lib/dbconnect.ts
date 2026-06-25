import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "ecommerce2";

export type MongoConnection = {
  client: MongoClient;
  db: ReturnType<MongoClient["db"]>;
};

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

declare global {
  var _mongoCache: MongoCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  _mongoCache?: MongoCache;
};

if (!globalCache._mongoCache) {
  globalCache._mongoCache = { client: null, promise: null };
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

async function connectToDatabase(): Promise<MongoConnection> {
  if (!globalCache._mongoCache) {
    globalCache._mongoCache = { client: null, promise: null };
  }

  if (!globalCache._mongoCache.promise) {
    const client = new MongoClient(uri, options);
    globalCache._mongoCache.client = client;
    globalCache._mongoCache.promise = client.connect();
  }

  const client = await globalCache._mongoCache.promise;
  const db = client.db(dbName);

  return { client, db };
}

export default connectToDatabase;
