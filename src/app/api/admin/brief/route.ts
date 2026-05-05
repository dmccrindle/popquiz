import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";
import { fetchBrief, generateBrief, saveBrief, todayKey } from "@/lib/brief";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");
    const dateKey = dateParam && DATE_KEY_RE.test(dateParam) ? dateParam : todayKey();
    const brief = await fetchBrief(dateKey);
    return NextResponse.json({ brief, dateKey });
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
    let dateKey: string | undefined;
    try {
      const body = (await request.json().catch(() => null)) as
        | { date?: string }
        | null;
      if (body?.date && DATE_KEY_RE.test(body.date)) dateKey = body.date;
    } catch {
      // empty body is fine
    }

    const brief = await generateBrief(dateKey);
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
