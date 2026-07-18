// src/lib/mongoose.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Safely define types for global cached mongoose instance
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Global declaration for TypeScript
declare global {
  // FIXED: Removed the unnecessary eslint-disable comment
  var mongooseCache: MongooseCache | undefined;
}

// Use globalThis for better compatibility in serverless environments
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      // Helps stop the 30000ms timeout by failing faster if blocked
      serverSelectionTimeoutMS: 5000, 
    };

    cached!.promise = mongoose.connect(MONGODB_URI as string, opts).then((instance: Mongoose) => {
      return instance;
    });
  }
  
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; // Reset promise on failure
    throw e;
  }
  
  return cached!.conn;
}

export default connectDB;