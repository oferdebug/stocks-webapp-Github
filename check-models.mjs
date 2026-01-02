import {GoogleGenerativeAI} from "@google/generative-ai";

const apiKey = "AIzaSyBJji8U23lGqZOyW8pFE9I40VhVE1OT6R0";

async function listModels() {
    console.log("--- בודק רשימת מודלים זמינים ---");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // אנחנו פונים למנהל המודלים כדי לראות מה פתוח לך
        const modelResponse = await genAI.getGenerativeModel({model: "gemini-pro"}).apiKey;

        // תיקון: הדרך הנכונה למשוך רשימת מודלים ב-SDK הזה היא קצת אחרת,
        // אבל מכיוון שה-SDK מקשה, ננסה קודם כל לעדכן אותו.

        console.log("השלב הזה דורש לוודא גרסה קודם...");
    } catch (error) {
        console.error(error);
    }
}

// הערה: ה-SDK של JS לא תמיד חושף את ListModels בקלות.
// לכן הפתרון היותר מהיר הוא עדכון החבילה.