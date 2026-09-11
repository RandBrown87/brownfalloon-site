import { del, get, list, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { defaultPortalPasscode } from "@/lib/site-data";

export const dynamic = "force-dynamic";

const MESSAGES_PATH = "brownfaloon/messages.json";
const MESSAGE_PREFIX = "brownfaloon/messages/";
const SITE_DATA_PATH = "brownfaloon/site-data.json";
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const MAX_NAME_LENGTH = 40;
const MAX_MESSAGE_LENGTH = 500;

export type BoardMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const readLegacyMessages = async (): Promise<BoardMessage[]> => {
  const legacyBlob = await get(MESSAGES_PATH, {
    access: "private",
    token: blobToken,
    useCache: false,
  });
  const legacyMessages = legacyBlob
    ? JSON.parse(await new Response(legacyBlob.stream).text())
    : [];
  return Array.isArray(legacyMessages) ? legacyMessages : [];
};

const readMessages = async (): Promise<BoardMessage[]> => {
  const messages: BoardMessage[] = await readLegacyMessages();
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix: MESSAGE_PREFIX,
      limit: 100,
      cursor,
      token: blobToken,
    });

    for (const blob of result.blobs) {
      const messageBlob = await get(blob.pathname, {
        access: "private",
        token: blobToken,
        useCache: false,
      });
      if (!messageBlob) continue;

      const parsed = JSON.parse(await new Response(messageBlob.stream).text());
      if (parsed && typeof parsed === "object" && typeof parsed.id === "string") {
        messages.push(parsed as BoardMessage);
      }
    }

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return messages
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, 100);
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
    await put(`${MESSAGE_PREFIX}${nextMessage.id}.json`, JSON.stringify(nextMessage), {
      access: "private",
      contentType: "application/json",
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

    const storedMessages = await list({
      prefix: MESSAGE_PREFIX,
      limit: 100,
      token: blobToken,
    });
    const storedPath = storedMessages.blobs.find((blob) => blob.pathname === `${MESSAGE_PREFIX}${id}.json`)
      ?.pathname;

    if (storedPath) {
      await del(storedPath, { token: blobToken });
    } else {
      const messages = await readLegacyMessages();
      await put(MESSAGES_PATH, JSON.stringify(messages.filter((item) => item.id !== id)), {
        access: "private",
        contentType: "application/json",
        allowOverwrite: true,
        token: blobToken,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The message could not be deleted." }, { status: 500 });
  }
}