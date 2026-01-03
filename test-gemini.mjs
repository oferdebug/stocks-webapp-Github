import {GoogleGenerativeAI} from "@google/generative-ai";

// מחקתי את dotenv - אנחנו שמים את המפתח ישר פה לבדיקה
const apiKey = "AIzaSyBJji8U23lGqZOyW8pFE9I40VhVE1OT6R0";

/**
 * Performs a direct connectivity and content-generation test against the Google Gemini model and logs the result.
 *
 * Initializes the GoogleGenerativeAI client with the local apiKey, requests the "gemini-1.5-flash" model with the prompt "Just say: System Operational", and logs the model's text response or any connection error.
 */
async function testGemini() {
    console.log("--- מתחיל בדיקה ישירה (בלי קובץ env) ---");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // משתמשים במודל היציב
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
        console.log("⏳ שולח בקשה לגוגל...");
        const result = await model.generateContent("Just say: System Operational");
        const response = await result.response;
        const text = response.text();

        console.log("✅ הצלחה! תשובה מה-AI:");
        console.log(text);

    } catch (error) {
        console.error("❌ שגיאה בחיבור ל-AI:");
        console.error(error.message);
    }
}

testGemini();