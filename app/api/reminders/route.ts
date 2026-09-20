import { NextRequest, NextResponse } from "next/server";
import {
  isReminderAdmin,
  readReminderSettings,
  writeReminderSettings,
} from "@/lib/reminders";

export const dynamic = "force-dynamic";

const normalizeEmails = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return [...new Set(value
    .map((email) => String(email).trim().toLowerCase())
    .filter((email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)))]
    .slice(0, 100);
};

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();
    if (!(await isReminderAdmin(String(passcode ?? "")))) {
      return NextResponse.json({ error: "The admin passcode is not correct." }, { status: 403 });
    }

    const settings = await readReminderSettings();
    return NextResponse.json({ recipients: settings.recipients });
  } catch {
    return NextResponse.json({ error: "Reminder settings could not be loaded." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { passcode, recipients } = await request.json();
    if (!(await isReminderAdmin(String(passcode ?? "")))) {
      return NextResponse.json({ error: "The admin passcode is not correct." }, { status: 403 });
    }

    const current = await readReminderSettings();
    const next = { ...current, recipients: normalizeEmails(recipients) };
    await writeReminderSettings(next);
    return NextResponse.json({ ok: true, recipients: next.recipients });
  } catch {
    return NextResponse.json({ error: "Reminder settings could not be saved." }, { status: 500 });
  }
}