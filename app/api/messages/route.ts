import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { defaultPortalPasscode } from "@/lib/site-data";

const MESSAGES_PATH = "brownfaloon/messages.json";
const SITE_DATA_PATH = "brownfaloon/site-data.json";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const MAX_MESSAGES = 100;
const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;

export type BoardMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const readMessages = async (): Promise<BoardMessage[]> => {
  const blob = await get(MESSAGES_PATH, { access: "private", token: blobToken });
  if (!blob) return [];

  const parsed = JSON.parse(await new Response(blob.stream).text());
  return Array.isArray(parsed) ? parsed : [];
};

const isAdminPasscode = async (passcode: string) => {
  const blob = await get(SITE_DATA_PATH, { access: "private", token: blobToken });
  if (!blob) return passcode === defaultPortalPasscode;

  const siteData = JSON.parse(await new Response(blob.stream).text()) as { portalPasscode?: string };
  return Boolean(siteData.portalPasscode) && siteData.portalPasscode === passcode;
};

export async function GET() {
  try {
    return NextResponse.json(await readMessages());
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: "Please enter a name under 40 characters." }, { status: 400 });
    }

    if (!message || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Please enter a message under 500 characters." }, { status: 400 });
    }

    const nextMessage: BoardMessage = {
      id: crypto.randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
    };
    const messages = await readMessages();

    await put(MESSAGES_PATH, JSON.stringify([nextMessage, ...messages].slice(0, MAX_MESSAGES)), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      token: blobToken,
    });

    return NextResponse.json(nextMessage, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Your message could not be posted." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    const passcode = String(body.passcode ?? "");

    if (!id || !(await isAdminPasscode(passcode))) {
      return NextResponse.json({ error: "The admin passcode is not correct." }, { status: 403 });
    }

    const messages = await readMessages();
    await put(MESSAGES_PATH, JSON.stringify(messages.filter((item) => item.id !== id)), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
      token: blobToken,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The message could not be deleted." }, { status: 500 });
  }
}