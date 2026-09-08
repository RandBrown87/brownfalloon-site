import { del, get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const BLOB_PATH = "brownfaloon/site-data.json";

export async function GET() {
  try {
    const blob = await get(BLOB_PATH, {
      access: "private",
    });

    if (!blob) {
      return NextResponse.json(
        {
          ...defaultSiteData,
        },
        { status: 200 },
      );
    }

    const text = await new Response(blob.stream).text();
    return NextResponse.json(JSON.parse(text), { status: 200 });
  } catch {
    return NextResponse.json(defaultSiteData, { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = JSON.stringify(body);

    const blob = await put(BLOB_PATH, data, {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });

    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save site data" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await del(BLOB_PATH);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reset site data" },
      { status: 500 },
    );
  }
}

const defaultSiteData = {
  year: 2026,
  currentMonthIndex: 9,
  roster: [
    { month: "January", monthIndex: 0, day: 10, host: "Rand", note: "xxxx" },
    { month: "February", monthIndex: 1, day: 14, host: "Weston" },
    { month: "March", monthIndex: 2, day: 14, host: "Mom" },
    { month: "April", monthIndex: 3, day: 11, host: "Dad" },
    { month: "May", monthIndex: 4, day: 9, host: "Paige" },
    { month: "June", monthIndex: 5, day: 13, host: "Rand", note: "xxxx" },
    { month: "July", monthIndex: 6, day: 11, host: "Weston ", note: "xxxx" },
    { month: "August", monthIndex: 7, day: 8, host: "Mom" },
    { month: "September", monthIndex: 8, day: 12, host: "Dad" },
    { month: "October", monthIndex: 9, day: 4, host: "Paige", note: "xxxxx" },
    { month: "November", monthIndex: 10, day: 14, host: "Rand" },
    { month: "December", monthIndex: 11, day: 12, host: "Weston", note: "xxxx" },
  ],
  currentDrink: {
    name: "xxxxxx",
    host: "Dad",
    month: "September",
    blurb:
      "Dad's fall twist on the family favorite — pear instead of orange, a cinnamon-clove syrup, and a smoked garnish if your setup allows it.",
    ingredients: ["XXXXXXXX"],
    steps: ["XXXXXXXX"],
    shopBy: "Wednesday, October 1",
  },
  archive: [
    {
      month: "September",
      host: "Rand",
      drink: "Classic Manhattan",
      note: "Two rye brands, blind taste test — rye #2 won.",
    },
    {
      month: "August",
      host: "Weston",
      drink: "Peach Bellini",
      note: "Made a virgin batch for the kids' table too.",
    },
    {
      month: "July",
      host: "Mom",
      drink: "Shirley Temple Float",
      note: "Root beer version was the sleeper hit.",
    },
    {
      month: "June",
      host: "Dad",
      drink: "Smoked Whiskey Sour",
      note: "The smoking gun made a mess. Worth it.",
    },
    { month: "May", host: "Paige", drink: "Cucumber Gimlet" },
    {
      month: "April",
      host: "Rand",
      drink: "Paper Plane",
      note: "First call anyone finished the toast without laughing.",
    },
    { month: "March", host: "Weston", drink: "Irish Coffee" },
    { month: "February", host: "Dad", drink: "Negroni", note: "Half the family still won't try it." },
    { month: "January", host: "Mom", drink: "Hot Toddy", note: "The one that started it all." },
  ],
  zoomInfo: {
    link: "https://zoom.us/j/0000000000",
    meetingId: "000 0000 0000",
    passcode: "flannel",
  },
  portalPasscode: "Randisthebest",
};
