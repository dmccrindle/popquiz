import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPHQL_ENDPOINT = "https://api.buffer.com/graphql";

type GqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function bufferGraphQL<T>(
  token: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data?: T; error?: string; status: number }> {
  let res: Response;
  try {
    res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Network error",
      status: 502,
    };
  }

  const body = (await res.json().catch(() => ({}))) as GqlResponse<T>;
  if (!res.ok) {
    return {
      error:
        body.errors?.[0]?.message ||
        `Buffer ${res.status}${res.statusText ? ` ${res.statusText}` : ""}`,
      status: res.status,
    };
  }
  if (body.errors?.length) {
    return { error: body.errors.map((e) => e.message).join("; "), status: 400 };
  }
  return { data: body.data, status: 200 };
}

type ChannelsData = {
  channels?: Array<{
    id: string;
    service?: string;
    name?: string;
  }>;
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

  const { data, error } = await bufferGraphQL<ChannelsData>(
    token,
    `query Channels {
      channels {
        id
        service
        name
      }
    }`
  );

  if (error || !data?.channels) {
    return NextResponse.json({
      configured: true,
      profiles: [],
      error: error || "Buffer returned no channels",
    });
  }

  const profiles = data.channels.map((c) => ({
    id: c.id,
    service: (c.service ?? "").toLowerCase(),
    username: c.name || "",
  }));

  return NextResponse.json({ configured: true, profiles });
}

type Body = {
  text: string;
  profileIds: string[];
  // unix seconds
  scheduledAt: number;
};

type CreatePostsData = {
  createPosts?: { success?: boolean; message?: string };
};

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
      { error: "Pick at least one channel." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(scheduledAt)) {
    return NextResponse.json({ error: "Missing scheduledAt." }, { status: 400 });
  }

  // Buffer GraphQL expects ISO 8601 strings for DateTime fields.
  const scheduledIso = new Date(scheduledAt * 1000).toISOString();

  const { data, error, status } = await bufferGraphQL<CreatePostsData>(
    token,
    `mutation CreatePosts($input: CreatePostsInput!) {
      createPosts(input: $input) {
        success
        message
      }
    }`,
    {
      input: {
        channels: profileIds.map((id) => ({ id })),
        text,
        scheduledAt: scheduledIso,
      },
    }
  );

  if (error) {
    return NextResponse.json({ error }, { status });
  }
  if (data?.createPosts?.success === false) {
    return NextResponse.json(
      { error: data.createPosts.message || "Buffer rejected the post." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
