import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";
import { fetchBrief, generateBrief, saveBrief, todayKey } from "@/lib/brief";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const brief = await fetchBrief(todayKey());
    return NextResponse.json({ brief });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Fetch failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const brief = await generateBrief();
    await saveBrief(brief);
    return NextResponse.json({ brief });
  } catch (e) {
    console.error("Brief generation failed:", e);
    if (e instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic ${e.status}: ${e.message}` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
