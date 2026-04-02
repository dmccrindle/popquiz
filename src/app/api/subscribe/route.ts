import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    await Promise.all([
      resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
        unsubscribed: false,
      }),
      resend.emails.send({
        from: "Pop Quiz <noreply@davidmccrindle.com>",
        to: "davidmccrindle@mac.com",
        subject: "New Pop Quiz signup",
        text: `New signup: ${email}`,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
