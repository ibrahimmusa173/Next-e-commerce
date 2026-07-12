// src/lib/mongoose.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_ATLAS_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_ATLAS_URI environment variable");
}

// Safely define types for global cached mongoose instance
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
 
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Typed the callback argument instance to resolve TS7006
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance: Mongoose) => {
      return mongooseInstance;
    });
  }
  
  cached!.conn = await cached!.promise;
  return cached!.conn;
}

export default connectDB;
