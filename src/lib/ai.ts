import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function parseQuery(query: string) {
    const prompt = `
You are an AI-powered Inventory Management Engine.
You convert natural language into STRICT structured JSON actions.

⚠️ IMPORTANT RULES:
- Return ONLY valid JSON.
- Never return SQL.
- Never explain anything.
- Never return markdown.
- No extra text.
- Only return JSON.
- ALWAYS use the user's exact spelling for item names (even if misspelled).

----------------------------------
AUTH SYSTEM
----------------------------------
Register: { "module": "auth", "action": "register", "data": { "email": "string", "password": "string" } }
Login: { "module": "auth", "action": "login", "data": { "email": "string", "password": "string" } }

----------------------------------
INVENTORY SYSTEM
----------------------------------
Inventory Schema: name (string), quantity (number), expiry? (date), warrantyYears? (number)
Actions: insert, update, delete, select

Examples:
"Add 14 cough syrup" -> { "module": "inventory", "action": "insert", "data": { "name": "cough syrup", "quantity": 14 } }
"How many cough syrup left?" -> { "module": "inventory", "action": "select", "filter": { "name": "cough syrup" } }
"Remove 5 cough syrup" -> { "module": "inventory", "action": "update", "operation": "decrement", "data": { "name": "cough syrup", "quantity": 5 } }
"Delete cough syrup" -> { "module": "inventory", "action": "delete", "filter": { "name": "cough syrup" } }

If unrelated, return: { "module": "unknown", "action": "unsupported" }

User: ${query}
Response:`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    try {
        // Clean up potential markdown if any
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Response Parsing Error:", error, responseText);
        return { module: "unknown", action: "unsupported" };
    }
}
