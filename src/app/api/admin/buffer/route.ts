import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  text: string;
  profileIds: string[];
  // unix seconds
  scheduledAt: number;
};

export async function GET(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ configured: false, profiles: [] });
  }

  try {
    const res = await fetch(
      `https://api.bufferapp.com/1/profiles.json?access_token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      return NextResponse.json(
        {
          configured: true,
          profiles: [],
          error: data.message || `Buffer ${res.status}`,
        },
        { status: 200 }
      );
    }
    const list = (await res.json()) as Array<{
      id: string;
      service: string;
      service_username?: string;
      formatted_username?: string;
    }>;

    const profiles = list.map((p) => ({
      id: p.id,
      service: p.service,
      username: p.formatted_username || p.service_username || "",
    }));

    return NextResponse.json({ configured: true, profiles });
  } catch (e) {
    return NextResponse.json(
      {
        configured: true,
        profiles: [],
        error: e instanceof Error ? e.message : "Buffer profiles fetch failed",
      },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "BUFFER_ACCESS_TOKEN not configured." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { text, profileIds, scheduledAt } = body;
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Missing text." }, { status: 400 });
  }
  if (!Array.isArray(profileIds) || profileIds.length === 0) {
    return NextResponse.json(
      { error: "Pick at least one profile." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(scheduledAt)) {
    return NextResponse.json({ error: "Missing scheduledAt." }, { status: 400 });
  }

  // Buffer Classic API: POST /1/updates/create.json
  // Body must be form-encoded.
  const params = new URLSearchParams();
  params.append("text", text);
  params.append("scheduled_at", String(scheduledAt));
  for (const id of profileIds) params.append("profile_ids[]", id);

  let res: Response;
  try {
    res = await fetch(
      `https://api.bufferapp.com/1/updates/create.json?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Buffer request failed" },
      { status: 502 }
    );
  }

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    code?: number;
    updates?: Array<{ id: string; profile_id: string; profile_service: string }>;
  };

  if (!res.ok || data.success === false) {
    return NextResponse.json(
      { error: data.message || `Buffer ${res.status}` },
      { status: res.status === 200 ? 502 : res.status }
    );
  }

  return NextResponse.json({ ok: true, updates: data.updates ?? [] });
}
