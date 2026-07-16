import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export const runtime = "nodejs";

const SMS_CONSENT_TEXT =
  "I agree to receive recurring automated promotional texts from 803 TAKEOVER. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe and HELP for help. Consent is not a condition of purchase.";

type SubscribeBody = {
  mode?: "email" | "phone";
  value?: string;
  emailConsent?: boolean;
  smsConsent?: boolean;
};

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  throw new Error("Enter a valid 10-digit U.S. mobile number.");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeBody;
    const mode = body.mode;
    const rawValue = body.value?.trim() ?? "";

    if (!mode || !rawValue) {
      return NextResponse.json({ error: "Enter your email address or mobile number." }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent");

    if (mode === "email") {
      const email = rawValue.toLowerCase();
      if (!email.includes("@")) {
        return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
      }

      await prisma.audienceSubscriber.upsert({
        where: { email },
        update: { emailConsent: Boolean(body.emailConsent), userAgent },
        create: {
          email,
          emailConsent: Boolean(body.emailConsent),
          smsConsent: false,
          consentSource: "entry-gate",
          userAgent,
        },
      });
    } else {
      if (!body.smsConsent) {
        return NextResponse.json({ error: "SMS consent is required to join by phone." }, { status: 400 });
      }

      const phone = normalizePhone(rawValue);
      await prisma.audienceSubscriber.upsert({
        where: { phone },
        update: { smsConsent: true, consentText: SMS_CONSENT_TEXT, userAgent },
        create: {
          phone,
          smsConsent: true,
          emailConsent: false,
          consentText: SMS_CONSENT_TEXT,
          consentSource: "entry-gate",
          userAgent,
        },
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("takeover_access", "granted", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Audience signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to join right now." },
      { status: 500 }
    );
  }
}
