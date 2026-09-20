import { get, put } from "@vercel/blob";
import { defaultPortalPasscode, defaultSiteData, type SiteData } from "@/lib/site-data";

export const REMINDER_SETTINGS_PATH = "brownfaloon/reminder-settings.json";
export const REMINDER_OFFSETS = [
  { key: "7-days", label: "7 days", milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { key: "1-day", label: "1 day", milliseconds: 24 * 60 * 60 * 1000 },
  { key: "1-hour", label: "1 hour", milliseconds: 60 * 60 * 1000 },
] as const;

export type ReminderSettings = {
  recipients: string[];
  sent: Record<string, string>;
};

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

export const defaultReminderSettings: ReminderSettings = {
  recipients: [],
  sent: {},
};

export const readReminderSettings = async (): Promise<ReminderSettings> => {
  const blob = await get(REMINDER_SETTINGS_PATH, {
    access: "private",
    token: blobToken,
    useCache: false,
  });
  if (!blob) return defaultReminderSettings;

  const parsed = JSON.parse(await new Response(blob.stream).text()) as Partial<ReminderSettings>;
  return {
    recipients: Array.isArray(parsed.recipients) ? parsed.recipients : [],
    sent: parsed.sent && typeof parsed.sent === "object" ? parsed.sent : {},
  };
};

export const writeReminderSettings = async (settings: ReminderSettings) => {
  await put(REMINDER_SETTINGS_PATH, JSON.stringify(settings), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    token: blobToken,
  });
};

export const readStoredSiteData = async (): Promise<SiteData> => {
  const blob = await get("brownfaloon/site-data.json", {
    access: "private",
    token: blobToken,
    useCache: false,
  });
  if (!blob) return defaultSiteData;

  const parsed = JSON.parse(await new Response(blob.stream).text()) as Partial<SiteData>;
  return {
    ...defaultSiteData,
    ...parsed,
    portalPasscode:
      typeof parsed.portalPasscode === "string" ? parsed.portalPasscode : defaultPortalPasscode,
  };
};

export const isReminderAdmin = async (passcode: string) => {
  const siteData = await readStoredSiteData();
  return passcode.length > 0 && passcode === siteData.portalPasscode;
};