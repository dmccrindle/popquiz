import { Resend } from "resend";
import { NextResponse } from "next/server";

const FEEDBACK_TYPES = ["Bug Report", "Feature Request", "General Feedback", "Question"] as const;

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  let body: { type?: string; message?: string; name?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { type, message, name, email } = body;

  if (!type || !FEEDBACK_TYPES.includes(type as (typeof FEEDBACK_TYPES)[number])) {
    return NextResponse.json({ error: "Please select a feedback type." }, { status: 400 });
  }

  if (!message || message.trim().length < 5) {
    return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
  }

  if (message.trim().length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const from = name && email ? `${name} <${email}>` : name || email || "Anonymous";
  const replyTo = email || undefined;

  try {
    await resend.emails.send({
      from: "Pop Quiz Feedback <noreply@davidmccrindle.com>",
      to: "davidmccrindle@mac.com",
      ...(replyTo ? { replyTo } : {}),
      subject: `[${type}] Pop Quiz Feedback`,
      text: [
        `Type: ${type}`,
        `From: ${from}`,
        ``,
        message.trim(),
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
