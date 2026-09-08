import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = new URL(request.url).searchParams.get("pathname");
  if (!pathname || !pathname.startsWith("brownfaloon/gallery/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const blob = await get(pathname, { access: "private" });
    if (!blob) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType || "image/*",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
