import mongoose from 'mongoose';
import app from '../src/app.js';
import { config } from '../src/config/env.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      autoIndex: false
    };

    const uri = process.env.MONGODB_URI || config.mongoUri;
    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Serverless MongoDB Connection Error:', err.message);
    // Don't crash immediately; let app handle or return error
  }
  return app(req, res);
}
