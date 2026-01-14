const apiKey = "AIzaSyBJji8U23lGqZOyW8pFE9I40VhVE1OT6R0";

/**
 * Fetches available generative models for the configured API key and logs the results.
 *
 * If the response contains models, logs a Hebrew header and each model name with the "models/" prefix removed.
 * If no models are returned, logs a Hebrew message indicating an empty list and prints the full response JSON.
 * Network or fetch errors are logged with a Hebrew error message.
 */
async function listModels() {
    console.log("--- מבקש רשימת מודלים זמינים ---");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ המודלים הזמינים למפתח שלך:");
            data.models.forEach(m => console.log(` - ${m.name.replace('models/', '')}`));
        } else {
            console.log("❌ לא נמצאו מודלים זמינים (הרשימה ריקה).");
            console.log("התגובה המלאה:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ שגיאת רשת:", error);
    }
}

listModels();