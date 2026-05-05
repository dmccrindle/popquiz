import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";
import { fetchPromos, generatePromos, savePromos } from "@/lib/promos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  try {
    const promos = await fetchPromos();
    return NextResponse.json({ promos });
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
    const promos = await generatePromos();
    await savePromos(promos);
    return NextResponse.json({ promos });
  } catch (e) {
    console.error("Promos generation failed:", e);
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
