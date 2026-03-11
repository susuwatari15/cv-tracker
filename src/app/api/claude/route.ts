import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    req.headers.get("x-client-api-key") ||
    "";

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 401 }
    );
  }

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Anthropic API error" },
      { status: res.status }
    );
  }

  return NextResponse.json(data);
}
