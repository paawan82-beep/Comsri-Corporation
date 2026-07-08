import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Gemini is called via the REST API directly (instead of the @google/genai SDK)
// to keep the Cloudflare Worker bundle small enough for the free-plan size limit.
const apiKey = process.env.GEMINI_API_KEY;
const isAiConfigured = !!(apiKey && apiKey !== "MY_GEMINI_API_KEY");

// Simple in-memory IP rate limiter to stop abuse / quota-draining of the
// (paid) Gemini API. Note: in-memory state is per-instance; for multi-instance
// serverless deployments back this with Redis/Upstash for hard guarantees.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const CHAT_LIMIT = 15; // max messages
const CHAT_WINDOW_MS = 60 * 1000; // per minute per IP

export async function POST(req: NextRequest) {
  try {
    // Enforce rate limiting before doing any expensive work.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const now = Date.now();
    const clientLimit = rateLimitStore.get(ip);
    if (clientLimit) {
      if (now > clientLimit.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + CHAT_WINDOW_MS });
      } else if (clientLimit.count >= CHAT_LIMIT) {
        return NextResponse.json(
          { error: "Too many messages. Please wait a minute and try again." },
          { status: 429 }
        );
      } else {
        clientLimit.count++;
      }
    } else {
      rateLimitStore.set(ip, { count: 1, resetTime: now + CHAT_WINDOW_MS });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array." }, { status: 400 });
    }

    // Load inventory
    let inventoryString = "[]";
    try {
      const productsFilePath = path.join(process.cwd(), "products_dump.json");
      if (fs.existsSync(productsFilePath)) {
        inventoryString = fs.readFileSync(productsFilePath, "utf8");
      }
    } catch (fsErr) {
      console.error("Failed to read products_dump.json:", fsErr);
    }

    // System instruction
    const systemInstruction = `You are "Comsri AI Assistant", a premium customer support chatbot and highly persuasive sales consultant for Comsri Corporation.
Comsri Corporation is a top e-commerce platform in India specializing in premium refurbished laptops, desktops, workstations, and mini PCs.

Key Brand & Support Information:
- Laptops & Desktops: 1-Year Warranty.
- Apple Products: 6-Month Warranty.
- 14-Day Return Policy: Valid if items are defective, damaged, or parts missing. Subject to QC inspection.
- Contact: Support email is support@comsri.com. Support phone is +91-8601-899-899. Website: https://comsri.com/contact-us.
- Location: India (governed by Indian laws, courts in Mumbai).
- Quality check: All devices go through a rigorous 40+ point quality inspection.

Store Inventory (JSON format):
${inventoryString}

Your behavior:
1. Tone: Warm, highly enthusiastic, persuasive, and sales-focused. Act like a top-tier retail sales representative.
2. Sales Strategy:
   - Actively pitch and convince the user to buy the products in our inventory.
   - Emphasize the incredible value proposition: "Why pay full price when you get enterprise-grade reliability and 1-year warranty security at a fraction of the cost?"
   - Create a sense of urgency: Point out that our premium inventory (like ThinkPads, MacBooks, Dell Precisions) is highly sought-after and stocks sell out fast!
   - Highlight the robust durability of corporate/enterprise series vs cheap consumer laptops.
3. Recommend suitable models from the inventory that fit the user's needs, and pitch them aggressively but professionally (describing how their specs match their work/study/gaming needs perfectly).
4. Formatting: Use clear markdown with bold text, bullet points, and exciting product highlights.
5. Product Recommendations: When recommending products, ALWAYS append a structured JSON block at the very end of your message. Use the exact tag \`\`\`json-recommendations to start it, and contain an array of recommended products from the inventory. Example format:
\`\`\`json-recommendations
[
  {
    "id": 1003733,
    "name": "Apple MacBook Air | Apple M3 Chip...",
    "slug": "apple-macbook-air-m3-13-inch"
  }
]
\`\`\`
Do not write anything else inside that code block. Only use products present in the inventory list.`;

    if (!isAiConfigured) {
      // Fallback response for missing API key
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      let mockReply = "Hello! I am your Comsri AI Assistant. I notice that the Gemini API Key is not fully configured yet. ";
      
      if (lastUserMessage.toLowerCase().includes("warranty")) {
        mockReply += "Regarding warranty: All laptops and desktops come with a 1-Year Warranty. Apple devices have a 6-Month Warranty.";
      } else if (lastUserMessage.toLowerCase().includes("return") || lastUserMessage.toLowerCase().includes("refund")) {
        mockReply += "Regarding returns: We offer a 14-day return policy if items are defective or damaged.";
      } else {
        mockReply += "How can I help you choose a refurbished laptop, desktop, or answer any policy questions today?";
      }

      return NextResponse.json({
        content: mockReply
      });
    }

    // Format chat history for Gemini API
    // Gemini multi-turn chat MUST start with a 'user' turn.
    // We slice off the initial assistant welcome message if it is the first turn.
    let apiMessages = messages;
    if (apiMessages.length > 0 && apiMessages[0].role === "assistant") {
      apiMessages = apiMessages.slice(1);
    }

    const contents = apiMessages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return NextResponse.json({ error: "AI service is temporarily unavailable." }, { status: 502 });
    }

    const data: any = await geminiRes.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ||
      "I apologize, I could not process that request.";

    return NextResponse.json({
      content: replyText
    });

  } catch (error: any) {
    console.error("Error in AI Chatbot route:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
