import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { signTokenData } from "@/lib/tokens";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "patient") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { doctorId, priority, symptoms } = await req.json();

    // 1. Get current queue for the doctor
    const { data: currentTokens, error: tokenError } = await supabaseAdmin
      .from('tokens')
      .select('token_number')
      .eq('doctor_id', doctorId)
      .eq('status', 'waiting')
      .order('token_number', { ascending: false })
      .limit(1);

    if (tokenError) throw tokenError;

    const nextTokenNumber = currentTokens.length > 0 ? currentTokens[0].token_number + 1 : 1;

    // 2. Get doctor info for ETS calculation
    const { data: doctor, error: doctorError } = await supabaseAdmin
      .from('doctors')
      .select('avg_consult_minutes, lag_rolling')
      .eq('id', doctorId)
      .single();

    if (doctorError) throw doctorError;

    // 3. Count tokens ahead
    const { count: tokensAhead, error: countError } = await supabaseAdmin
      .from('tokens')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', doctorId)
      .eq('status', 'waiting');

    if (countError) throw countError;

    const aheadCount = tokensAhead || 0;
    const etsMinutes = aheadCount * (doctor.avg_consult_minutes || 15) + (aheadCount * 2) + (doctor.lag_rolling || 0);
    const ets = new Date();
    ets.setMinutes(ets.getMinutes() + etsMinutes);

    // 4. Create Token
    const { data: patient } = await supabaseAdmin
      .from('patients')
      .select('id')
      .eq('email', session.user?.email)
      .single();

    const { data: newToken, error: insertError } = await supabaseAdmin
      .from('tokens')
      .insert({
        token_number: nextTokenNumber,
        patient_id: patient?.id,
        doctor_id: doctorId,
        priority: priority || 'routine',
        status: 'waiting',
        source: 'online',
        ets: ets.toISOString(),
        metadata: { symptoms }
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 5. Generate QR data (HMAC signed)
    const qrData = await signTokenData({
      tokenId: newToken.id,
      tokenNumber: newToken.token_number,
      doctorId: newToken.doctor_id,
      patientId: newToken.patient_id,
      ets: newToken.ets
    });

    return NextResponse.json({
      ...newToken,
      qrData
    });
  } catch (error: any) {
    console.error("Token Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
