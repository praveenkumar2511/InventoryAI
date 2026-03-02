import { NextRequest, NextResponse } from "next/server";
import { parseQuery } from "@/lib/ai";
import { handleAuth, handleInventory } from "@/lib/actions";

export async function POST(req: NextRequest) {
    try {
        const { query, manualAction } = await req.json();

        let parsed;
        if (manualAction) {
            parsed = manualAction;
        } else {
            if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });
            console.log("Processing AI request:", query);
            parsed = await parseQuery(query);
        }

        console.log("Parsed Output:", JSON.stringify(parsed, null, 2));

        let result;
        if (parsed.module === "auth") {
            result = await handleAuth(parsed);
        } else if (parsed.module === "inventory") {
            result = await handleInventory(parsed);
        } else {
            return NextResponse.json({
                module: "unknown",
                action: "unsupported",
                message: "I didn't understand that. Please try an inventory or auth related request."
            });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({
            error: error.message || "Internal server error",
            details: error.stack
        }, { status: 500 });
    }
}
