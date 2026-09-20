import { NextRequest, NextResponse } from "next/server";
import { isEmailConfigured, sendReminderEmail } from "@/lib/email";
import { getNextCall } from "@/lib/site-data";
import {
  REMINDER_OFFSETS,
  readReminderSettings,
  readStoredSiteData,
  writeReminderSettings,
} from "@/lib/reminders";

export const dynamic = "force-dynamic";

const isAuthorized = (request: NextRequest) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
};

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: "SMTP email delivery is not configured." }, { status: 503 });
  }

  try {
    const [siteData, settings] = await Promise.all([readStoredSiteData(), readReminderSettings()]);
    const recipients = settings.recipients;
    if (recipients.length === 0) return NextResponse.json({ sent: [] });

    const call = getNextCall(siteData);
    const now = Date.now();
    const sent: string[] = [];

    for (const reminder of REMINDER_OFFSETS) {
      const reminderTime = call.date.getTime() - reminder.milliseconds;
      const reminderKey = `${call.date.toISOString()}:${reminder.key}`;
      const isDue = now >= reminderTime && now - reminderTime <= 15 * 60 * 1000;

      if (!isDue || settings.sent[reminderKey]) continue;

      await sendReminderEmail({
        to: recipients,
        subject: `${reminder.label} until the Brownfalloon call`,
        text: `The Brownfalloon call with ${call.entry.host} is in ${reminder.label} on ${call.date.toLocaleString()}.

Join the call: ${siteData.zoomInfo.link}
Meeting ID: ${siteData.zoomInfo.meetingId}
Passcode: ${siteData.zoomInfo.passcode}`,
      });

      settings.sent[reminderKey] = new Date().toISOString();
      sent.push(reminder.key);
    }

    await writeReminderSettings(settings);
    return NextResponse.json({ sent });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reminder could not be sent." },
      { status: 500 },
    );
  }
}