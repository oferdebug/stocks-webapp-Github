import * as mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;


declare global {
    var mongooseCache:{
        conn:typeof mongoose|null;
        promise:Promise<typeof mongoose>|null;
    }
}


let cached=global.mongooseCache;

if (!cached) {
    cached=global.mongooseCache={conn:null,promise:null};
}


export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    if (cached.conn) return cached.conn;


    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('MongoDB successfully connected');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        console.error('MongoDB connection error details:', err);
        throw err;
    }

    console.log(`Connected To Database: ${process.env.NODE_ENV}-${MONGODB_URI}`);
    return cached.conn;
};

