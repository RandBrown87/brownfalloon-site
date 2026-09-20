import { NextRequest, NextResponse } from "next/server";
import { isEmailConfigured, sendReminderEmail } from "@/lib/email";
import {
  isReminderAdmin,
  readReminderSettings,
} from "@/lib/reminders";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();
    if (!(await isReminderAdmin(String(passcode ?? "")))) {
      return NextResponse.json({ error: "The admin passcode is not correct." }, { status: 403 });
    }

    const settings = await readReminderSettings();

    if (!isEmailConfigured()) {
      return NextResponse.json({ error: "SMTP email delivery is not configured." }, { status: 503 });
    }
    if (settings.recipients.length === 0) {
      return NextResponse.json({ error: "Add at least one recipient first." }, { status: 400 });
    }

    await sendReminderEmail({
      to: settings.recipients,
      subject: "Brownfalloon reminder test",
      text: "This is a test email from The Brownfalloon. Your reminder list and email delivery are working.",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test email could not be sent." },
      { status: 500 },
    );
  }
}