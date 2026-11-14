import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = (global._mongoose ??= { conn: null, promise: null });

export async function connectDB() {
  if (!MONGODB_URI) throw new Error("缺少環境變數 MONGODB_URI");
  if (cached.conn) return cached.conn;
  cached.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false });
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}
