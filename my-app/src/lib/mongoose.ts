// src/lib/mongoose.ts
import mongoose, { Mongoose } from "mongoose";

// Standardized name matching your Auth and GitHub Secrets
const MONGODB_URI = process.env.MONGODB_ATLAS_URI;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // FIXED: Removed the eslint-disable comment that was causing the warning
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose | null> {
  // Logic: Don't throw error during 'next build' if URI is missing
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "production") {
      console.warn("MONGODB_ATLAS_URI is missing. Skipping connection for build.");
    }
    return null;
  }

  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 60000, 
    };

    cached!.promise = mongoose.connect(MONGODB_URI as string, opts).then((instance: Mongoose) => {
      return instance;
    });
  }
  
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null; 
    throw e;
  }
  
  return cached!.conn;
}

export default connectDB;