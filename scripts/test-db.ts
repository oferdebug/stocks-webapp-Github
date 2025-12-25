import { connectToDatabase } from "../database/mongoose";

async function testConnection() {
    try {
        console.log("Testing database connection...");
        await connectToDatabase();
        console.log("Successfully connected to the database!");
        process.exit(0);
    } catch (error) {
        console.error("Failed to connect to the database:");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
