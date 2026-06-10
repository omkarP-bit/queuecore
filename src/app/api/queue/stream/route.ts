import { NextResponse } from "next/server";
import Redis from "ioredis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) return new Response("Doctor ID required", { status: 400 });

  const encoder = new TextEncoder();
  const subRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`));

      subRedis.subscribe(`queue:${doctorId}`, (err) => {
        if (err) console.error("Redis Subscribe Error:", err);
      });

      subRedis.on("message", (channel, message) => {
        controller.enqueue(encoder.encode(`data: ${message}\n\n`));
      });

      req.signal.addEventListener("abort", () => {
        subRedis.unsubscribe();
        subRedis.quit();
      });
    },
    cancel() {
      subRedis.unsubscribe();
      subRedis.quit();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
