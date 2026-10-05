// db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
}

// Use a global variable to cache the connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        // Return cached connection if it exists
        return cached.conn;
    }

    if (!cached.promise) {
        // Create a new connection promise
        cached.promise = mongoose.connect(`${MONGODB_URI}`).then((mongoose) => {
            console.log("MongoDB connected successfully");
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
