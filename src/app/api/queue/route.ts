import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) return NextResponse.json({ error: "Doctor ID required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('tokens')
    .select('*, patients(name, phone)')
    .eq('doctor_id', doctorId)
    .in('status', ['waiting', 'called'])
    .order('priority', { ascending: false })
    .order('token_number', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
