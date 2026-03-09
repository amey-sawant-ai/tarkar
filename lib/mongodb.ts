import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (!global._mongooseConn) {
    global._mongooseConn = { conn: null, promise: null };
  }
  if (global._mongooseConn.conn) return global._mongooseConn.conn;
  if (!global._mongooseConn.promise) {
    global._mongooseConn.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "tarkari",
      // bufferCommands false to avoid memory bloat in serverless
      bufferCommands: false,
      autoCreate: true,
      autoIndex: true,
      // Connection pool settings for better performance
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  }
  global._mongooseConn.conn = await global._mongooseConn.promise;
  return global._mongooseConn.conn;
}

export default connectToDatabase;
