const apiKey = "AIzaSyDcsQIzOC8XEhKjGRcL1VTxt5CBosd9pxI";

async function testDirectFetch() {
    console.log("--- בדיקה ישירה ללא SDK ---");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const data = {
        contents: [{
            parts: [{text: "Write one short sentence about investment."}]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log(`❌ שגיאת HTTP: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.log("פירוט השגיאה מגוגל:", errorBody);
            return;
        }

        const json = await response.json();
        console.log("✅ עובד!!! הנה התשובה:");
        console.log(json.candidates[0].content.parts[0].text);

    } catch (error) {
        console.error("❌ שגיאת רשת:", error);
    }
}

testDirectFetch();