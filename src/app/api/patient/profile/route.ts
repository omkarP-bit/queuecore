import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "patient") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, govId } = body;

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const updates: any = { name, phone };

    if (govId) {
      const salt = await bcrypt.genSalt(10);
      updates.gov_id_hash = await bcrypt.hash(govId, salt);
    }

    const { error } = await supabaseAdmin
      .from("patients")
      .update(updates)
      .eq("email", session.user?.email);

    if (error) throw error;

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "patient") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: patient, error } = await supabaseAdmin
    .from("patients")
    .select("name, phone, email, gov_id_hash")
    .eq("email", session.user?.email)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ...patient,
    isComplete: !!(patient.name && patient.phone),
  });
}
