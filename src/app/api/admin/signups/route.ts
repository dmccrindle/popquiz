import { Resend } from "resend";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "RESEND_API_KEY or RESEND_AUDIENCE_ID not configured." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.contacts.list({ audienceId });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 502 });
    }

    const contacts = (result.data?.data ?? []).map((c) => ({
      id: c.id,
      email: c.email,
      firstName: c.first_name ?? "",
      lastName: c.last_name ?? "",
      unsubscribed: c.unsubscribed ?? false,
      createdAt: c.created_at ?? null,
    }));

    contacts.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });

    return NextResponse.json({ contacts });
  } catch (e) {
    console.error("Signups fetch failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 500 }
    );
  }
}
