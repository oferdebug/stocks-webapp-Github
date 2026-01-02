import { connectToDatabase } from "../database/mongoose";

/**
 * Tests the application's database connection and terminates the process based on the result.
 *
 * Attempts to connect to the database, logs success or failure, and exits the process with
 * status code 0 on success or 1 on failure.
 */
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