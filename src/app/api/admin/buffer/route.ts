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
  account?: {
    currentOrganization?: {
      id: string;
      channels?: Array<{
        id: string;
        service?: string;
        name?: string;
      }>;
    };
  };
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

  // Schema-probe mode: /api/admin/buffer?probe=PostInputMetaData,SomeOtherType
  const probe = new URL(request.url).searchParams.get("probe");
  if (probe) {
    const names = probe
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const entries = await Promise.all(
      names.map(async (n) => [n, await describeType(token, n)] as const)
    );
    return NextResponse.json(Object.fromEntries(entries));
  }

  const { data, error } = await bufferGraphQL<ChannelsData>(
    token,
    `query Channels {
      account {
        currentOrganization {
          id
          channels {
            id
            service
            name
          }
        }
      }
    }`
  );

  const channels = data?.account?.currentOrganization?.channels;
  if (error || !channels) {
    return NextResponse.json({
      configured: true,
      profiles: [],
      error: error || "Buffer returned no channels",
    });
  }

  const profiles = channels.map((c) => ({
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

type CreatePostData = {
  createPost?: { __typename?: string };
};

type TypeIntrospectionData = {
  __type?: {
    name?: string | null;
    inputFields?: Array<{
      name: string;
      type?: { name?: string | null; ofType?: { name?: string | null } | null };
    }>;
    fields?: Array<{
      name: string;
      type?: { name?: string | null; ofType?: { name?: string | null } | null };
    }>;
    enumValues?: Array<{ name: string }>;
  };
};

type TypeRef = {
  kind?: string;
  name?: string | null;
  ofType?: TypeRef | null;
};

function unwrapType(t?: TypeRef | null): string {
  if (!t) return "?";
  if (t.kind === "NON_NULL") return `${unwrapType(t.ofType)}!`;
  if (t.kind === "LIST") return `[${unwrapType(t.ofType)}]`;
  return t.name ?? "?";
}

async function describeType(token: string, typeName: string): Promise<string> {
  const { data } = await bufferGraphQL<{
    __type?: {
      name?: string | null;
      inputFields?: Array<{ name: string; type?: TypeRef }>;
      fields?: Array<{ name: string; type?: TypeRef }>;
      enumValues?: Array<{ name: string }>;
    };
  }>(
    token,
    `query Desc($n: String!) {
      __type(name: $n) {
        name
        inputFields {
          name
          type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } }
        }
        fields {
          name
          type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } }
        }
        enumValues { name }
      }
    }`,
    { n: typeName }
  );
  if (!data?.__type) return `${typeName} (not found)`;
  const t = data.__type;
  if (t.enumValues?.length) {
    return `${t.name} = ${t.enumValues.map((v) => v.name).join(" | ")}`;
  }
  const fields = t.inputFields ?? t.fields ?? [];
  return `${t.name} { ${fields
    .map((f) => `${f.name}: ${unwrapType(f.type)}`)
    .join(", ")} }`;
}

type IntrospectionData = {
  __schema?: {
    mutationType?: {
      fields?: Array<{
        name: string;
        args?: Array<{
          name: string;
          type?: { name?: string | null; ofType?: { name?: string | null } | null };
        }>;
      }>;
    };
  };
};

async function describeMutations(token: string): Promise<string> {
  const { data } = await bufferGraphQL<IntrospectionData>(
    token,
    `query {
      __schema {
        mutationType {
          fields {
            name
            args {
              name
              type { name ofType { name } }
            }
          }
        }
      }
    }`
  );
  const fields = data?.__schema?.mutationType?.fields ?? [];
  return fields
    .slice(0, 20)
    .map((f) => {
      const args = (f.args ?? [])
        .map(
          (a) =>
            `${a.name}:${a.type?.name ?? a.type?.ofType?.name ?? "?"}`
        )
        .join(", ");
      return `${f.name}(${args})`;
    })
    .join(" | ");
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
      { error: "Pick at least one channel." },
      { status: 400 }
    );
  }
  if (!Number.isFinite(scheduledAt)) {
    return NextResponse.json({ error: "Missing scheduledAt." }, { status: 400 });
  }

  // Buffer GraphQL expects ISO 8601 strings for DateTime fields.
  const dueAtIso = new Date(scheduledAt * 1000).toISOString();

  // CreatePostInput takes a single channelId per call. Fan out for each.
  const results = await Promise.all(
    profileIds.map((channelId) =>
      bufferGraphQL<CreatePostData>(
        token,
        `mutation CreatePost($input: CreatePostInput!) {
          createPost(input: $input) {
            __typename
          }
        }`,
        {
          input: {
            channelId,
            text,
            dueAt: dueAtIso,
            schedulingType: "automatic",
            mode: "customScheduled",
          },
        }
      )
    )
  );

  const failures = results
    .map((r, i) => ({ channelId: profileIds[i], error: r.error }))
    .filter((r) => r.error);

  if (failures.length > 0) {
    const first = failures[0].error ?? "";
    if (
      /Unknown type|Cannot query field|Unknown argument|expected type|required type|does not exist|was not provided/i.test(
        first
      )
    ) {
      const [input, sched, share] = await Promise.all([
        describeType(token, "CreatePostInput"),
        describeType(token, "SchedulingType"),
        describeType(token, "ShareMode"),
      ]);
      return NextResponse.json(
        {
          error: `${first}\n\nInput shape: ${input}\n\nSchedulingType: ${sched}\n\nShareMode: ${share}`,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: `Failed on ${failures.length}/${profileIds.length} channel(s): ${failures
          .map((f) => f.error)
          .join("; ")}`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, scheduled: profileIds.length });
}
