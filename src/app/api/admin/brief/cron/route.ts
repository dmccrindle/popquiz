import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { generateBrief, saveBrief } from "@/lib/brief";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured." }, { status: 500 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const brief = await generateBrief();
    await saveBrief(brief);
    return NextResponse.json({
      ok: true,
      dateKey: brief.dateKey,
      itemCount: brief.items.length,
    });
  } catch (e) {
    console.error("Brief cron failed:", e);
    if (e instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Anthropic ${e.status}: ${e.message}` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Cron failed" },
      { status: 500 }
    );
  }
}
