import { connectToDatabase } from "../database/mongoose";

/**
 * Test the application's database connection and exit the process with a status code indicating the outcome.
 *
 * Attempts to connect to the database; exits the process with status code 0 on success or 1 on failure.
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