import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { tokenId, reportUrl } = await req.json();

    // 1. Create or Update session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .upsert({
        token_id: tokenId,
        report_url: reportUrl,
        status: 'completed'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Mark token as done
    await supabaseAdmin
      .from('tokens')
      .update({ status: 'done' })
      .eq('id', tokenId);

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
