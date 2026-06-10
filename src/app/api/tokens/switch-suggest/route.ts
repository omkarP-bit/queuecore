import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { currentHospitalId, specialty } = await req.json();

    // 1. Find hospitals with same specialty excluding current one
    const { data: alternates, error } = await supabaseAdmin
      .from('hospitals')
      .select('*, doctors(*)')
      .neq('id', currentHospitalId)
      .contains('specialty_tags', [specialty])
      .limit(5);

    if (error) throw error;

    // 2. For each alternate, get wait time (mock logic)
    const suggestions = alternates.map(h => ({
      id: h.id,
      name: h.name,
      doctor: h.doctors?.[0]?.name || 'Dr. On Duty',
      queueLength: Math.floor(Math.random() * 5), // Mock
      newEts: new Date(Date.now() + 15 * 60000).toISOString()
    }));

    return NextResponse.json(suggestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
