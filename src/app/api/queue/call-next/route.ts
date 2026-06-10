import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "receptionist") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { doctorId } = await req.json();

    // 1. Find currently active token
    const { data: activeToken } = await supabaseAdmin
      .from('tokens')
      .select('id, ets')
      .eq('doctor_id', doctorId)
      .eq('status', 'called')
      .single();

    if (activeToken) {
      // Mark as done
      await supabaseAdmin
        .from('tokens')
        .update({ status: 'done' })
        .eq('id', activeToken.id);
      
      // Update lag (mock logic for hackathon)
      // actual_duration = now - ets? No, actual duration comes from sessions.
      // For now, we'll just pull the next one.
    }

    // 2. Pull next waiting token
    const { data: nextToken, error: nextError } = await supabaseAdmin
      .from('tokens')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('status', 'waiting')
      .order('priority', { ascending: false }) // Emergency first
      .order('token_number', { ascending: true })
      .limit(1)
      .single();

    if (nextError && nextError.code !== 'PGRST116') throw nextError;

    if (nextToken) {
      await supabaseAdmin
        .from('tokens')
        .update({ status: 'called' })
        .eq('id', nextToken.id);

      // 3. Publish to Redis
      await redis.publish(`queue:${doctorId}`, JSON.stringify({
        type: 'CALL_NEXT',
        tokenId: nextToken.id,
        tokenNumber: nextToken.token_number
      }));
    }

    return NextResponse.json({ success: true, nextToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
