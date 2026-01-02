const apiKey = "AIzaSyBJji8U23lGqZOyW8pFE9I40VhVE1OT6R0";

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