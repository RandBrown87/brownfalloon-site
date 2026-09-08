import { del, get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const MANIFEST_PATH = "brownfaloon/gallery/index.json";

type GalleryPhoto = {
  pathname: string;
  caption: string;
};

const readManifest = async (): Promise<GalleryPhoto[]> => {
  const blob = await get(MANIFEST_PATH, { access: "private" });
  if (!blob) return [];

  const parsed = JSON.parse(await new Response(blob.stream).text());
  return Array.isArray(parsed) ? parsed : [];
};

const writeManifest = async (photos: GalleryPhoto[]) => {
  await put(MANIFEST_PATH, JSON.stringify(photos), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });
};

export async function GET() {
  try {
    const photos = await readManifest();
    return NextResponse.json(
      photos.map((photo) => ({
        ...photo,
        url: `/api/gallery/image?pathname=${encodeURIComponent(photo.pathname)}`,
      })),
    );
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = String(formData.get("caption") ?? "").trim();

    if (!(file instanceof File) || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload an image." }, { status: 400 });
    }

    const pathname = `brownfaloon/gallery/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    await put(pathname, file, {
      access: "private",
      contentType: file.type,
    });

    const photos = await readManifest();
    const photo = { pathname, caption: caption || file.name.replace(/\.[^/.]+$/, "") };
    await writeManifest([photo, ...photos]);

    return NextResponse.json({
      ...photo,
      url: `/api/gallery/image?pathname=${encodeURIComponent(pathname)}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload photo" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const pathname = new URL(request.url).searchParams.get("pathname");
    if (!pathname) {
      return NextResponse.json({ error: "Missing photo pathname." }, { status: 400 });
    }

    const photos = await readManifest();
    await del(pathname);
    await writeManifest(photos.filter((photo) => photo.pathname !== pathname));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete photo" },
      { status: 500 },
    );
  }
}
