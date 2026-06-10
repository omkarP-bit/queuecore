import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY || ""}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
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
