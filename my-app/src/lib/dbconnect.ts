import { MongoClient } from "mongodb";

const localUri = process.env.MONGODB_LOCAL_URI ?? process.env.MONGODB_URI;
const atlasUri = process.env.MONGODB_ATLAS_URI ?? process.env.MONGODB_URI;
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
  var _mongoLocalCache: MongoCache | undefined;
  var _mongoAtlasCache: MongoCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  _mongoLocalCache?: MongoCache;
  _mongoAtlasCache?: MongoCache;
};

if (!globalCache._mongoLocalCache) {
  globalCache._mongoLocalCache = { client: null, promise: null };
}

if (!globalCache._mongoAtlasCache) {
  globalCache._mongoAtlasCache = { client: null, promise: null };
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

async function getClient(uri: string, cache: MongoCache): Promise<MongoClient> {
  if (!cache.promise) {
    const client = new MongoClient(uri, options);
    cache.client = client;
    cache.promise = client.connect();
  }

  return cache.promise;
}

export async function connectToLocalDatabase(): Promise<MongoConnection> {
  if (!localUri) {
    throw new Error(
      "Please define MONGODB_LOCAL_URI or MONGODB_URI in your local environment."
    );
  }

  const client = await getClient(localUri, globalCache._mongoLocalCache!);
  return { client, db: client.db(dbName) };
}

export async function connectToAtlasDatabase(): Promise<MongoConnection> {
  if (!atlasUri) {
    throw new Error(
      "Please define MONGODB_ATLAS_URI in your production environment."
    );
  }

  const client = await getClient(atlasUri, globalCache._mongoAtlasCache!);
  return { client, db: client.db(dbName) };
}

export default connectToLocalDatabase;
