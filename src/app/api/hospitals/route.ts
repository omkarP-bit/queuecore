import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  const specialty = searchParams.get('specialty');

  let query = supabase
    .from('hospitals')
    .select('*, doctors(*)');

  if (city) query = query.eq('city', city);
  if (specialty) query = query.contains('specialty_tags', [specialty]);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
