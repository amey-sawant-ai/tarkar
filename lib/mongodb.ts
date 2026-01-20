import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables");
}

export async function connectToDatabase() {
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
    });
  }
  global._mongooseConn.conn = await global._mongooseConn.promise;
  return global._mongooseConn.conn;
}

export default connectToDatabase;
