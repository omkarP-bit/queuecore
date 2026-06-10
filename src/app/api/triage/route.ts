import { NextResponse } from "next/server";

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();

    const prompt = `
      You are a medical triage assistant. Analyze the following symptoms and classify the priority as "routine", "urgent", or "emergency".
      
      Symptoms: "${symptoms}"
      
      Return ONLY a JSON object in this format:
      {
        "priority": "routine" | "urgent" | "emergency",
        "reason": "Max 12 words explanation",
        "estimated_consult_minutes": number
      }
    `;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const content = data.content[0].text;
    const result = JSON.parse(content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Triage Error:", error);
    // Fallback for demo if API key is missing or fails
    return NextResponse.json({
      priority: "routine",
      reason: "Automated triage fallback due to processing error.",
      estimated_consult_minutes: 15
    });
  }
}
