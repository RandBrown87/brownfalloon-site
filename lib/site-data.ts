export type HostMonth = {
  month: string;
  monthIndex: number;
  day: number;
  host: string;
  note?: string;
};

export type CurrentDrink = {
  name: string;
  host: string;
  month: string;
  blurb: string;
  ingredients: string[];
  steps: string[];
  shopBy: string;
};

export type ArchiveEntry = {
  month: string;
  host: string;
  drink: string;
  note?: string;
};

export type ZoomInfo = {
  link: string;
  meetingId: string;
  passcode: string;
};

export type SiteData = {
  year: number;
  callTime: string;
  currentMonthIndex: number;
  roster: HostMonth[];
  currentDrink: CurrentDrink;
  archive: ArchiveEntry[];
  zoomInfo: ZoomInfo;
  portalPasscode: string;
};

export const CONTENT_STORAGE_KEY = "brownfaloon-site-data";
export const CONTENT_UPDATED_EVENT = "brownfaloon-content-updated";
export const SITE_DATA_API_PATH = "/api/site-data";

export const defaultRoster: HostMonth[] = [
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
];

export const defaultCurrentDrink: CurrentDrink = {
  name: "xxxxxx",
  host: "Dad",
  month: "September",
  blurb:
    "Dad's fall twist on the family favorite — pear instead of orange, a cinnamon-clove syrup, and a smoked garnish if your setup allows it.",
  ingredients: ["XXXXXXXX"],
  steps: ["XXXXXXXX"],
  shopBy: "Wednesday, October 1",
};

export const defaultArchive: ArchiveEntry[] = [
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
];

export const defaultZoomInfo: ZoomInfo = {
  link: "https://zoom.us/j/0000000000",
  meetingId: "000 0000 0000",
  passcode: "flannel",
};

export const defaultPortalPasscode = "Randisthebest";

export const defaultSiteData: SiteData = {
  year: 2026,
  callTime: "19:00",
  currentMonthIndex: 9,
  roster: defaultRoster,
  currentDrink: defaultCurrentDrink,
  archive: defaultArchive,
  zoomInfo: defaultZoomInfo,
  portalPasscode: defaultPortalPasscode,
};

export const getNextCallDate = (data: SiteData): Date => {
  return getNextCall(data).date;
};

export const getNextCall = (data: SiteData): { entry: HostMonth; date: Date } => {
  const entry = data.roster[data.currentMonthIndex] ?? data.roster[0] ?? defaultRoster[0];
  const [hours, minutes] = (data.callTime || defaultSiteData.callTime).split(":").map(Number);

  return {
    entry,
    date: new Date(
      data.year,
      entry.monthIndex,
      entry.day,
      hours || 0,
      minutes || 0,
      0,
    ),
  };
};

export const getCurrentCallDate = (data: SiteData): Date => {
  const entry = data.roster[data.currentMonthIndex] ?? data.roster[0];
  const [hours, minutes] = (data.callTime || defaultSiteData.callTime).split(":").map(Number);

  return new Date(
    data.year,
    entry?.monthIndex ?? 0,
    entry?.day ?? 1,
    hours || 0,
    minutes || 0,
    0,
  );
};

export const getShopByDate = (data: SiteData): string => {
  const shopByDate = getCurrentCallDate(data);
  shopByDate.setDate(shopByDate.getDate() - 7);

  return shopByDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const safeParse = (raw: string | null): SiteData | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SiteData>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      year: typeof parsed.year === "number" ? parsed.year : defaultSiteData.year,
      callTime: typeof parsed.callTime === "string" ? parsed.callTime : defaultSiteData.callTime,
      currentMonthIndex:
        typeof parsed.currentMonthIndex === "number"
          ? parsed.currentMonthIndex
          : defaultSiteData.currentMonthIndex,
      roster: Array.isArray(parsed.roster) && parsed.roster.length > 0 ? parsed.roster : defaultSiteData.roster,
      currentDrink:
        parsed.currentDrink && typeof parsed.currentDrink === "object"
          ? { ...defaultSiteData.currentDrink, ...parsed.currentDrink }
          : defaultSiteData.currentDrink,
      archive: Array.isArray(parsed.archive) ? parsed.archive : defaultSiteData.archive,
      zoomInfo:
        parsed.zoomInfo && typeof parsed.zoomInfo === "object"
          ? { ...defaultSiteData.zoomInfo, ...parsed.zoomInfo }
          : defaultSiteData.zoomInfo,
      portalPasscode:
        typeof parsed.portalPasscode === "string"
          ? parsed.portalPasscode
          : defaultSiteData.portalPasscode,
    };
  } catch {
    return null;
  }
};

export const readSiteData = (): SiteData => {
  if (typeof window === "undefined") {
    return defaultSiteData;
  }

  const localValue = safeParse(window.localStorage.getItem(CONTENT_STORAGE_KEY));
  return localValue ?? defaultSiteData;
};

export const fetchSiteData = async (): Promise<SiteData> => {
  if (typeof window === "undefined") {
    return defaultSiteData;
  }

  try {
    const response = await fetch(SITE_DATA_API_PATH, { cache: "no-store" });
    if (!response.ok) {
      return readSiteData();
    }

    const json = (await response.json()) as Partial<SiteData>;
    const merged = {
      year: typeof json.year === "number" ? json.year : defaultSiteData.year,
      callTime: typeof json.callTime === "string" ? json.callTime : defaultSiteData.callTime,
      currentMonthIndex:
        typeof json.currentMonthIndex === "number"
          ? json.currentMonthIndex
          : defaultSiteData.currentMonthIndex,
      roster: Array.isArray(json.roster) && json.roster.length > 0 ? json.roster : defaultSiteData.roster,
      currentDrink:
        json.currentDrink && typeof json.currentDrink === "object"
          ? { ...defaultSiteData.currentDrink, ...json.currentDrink }
          : defaultSiteData.currentDrink,
      archive: Array.isArray(json.archive) ? json.archive : defaultSiteData.archive,
      zoomInfo:
        json.zoomInfo && typeof json.zoomInfo === "object"
          ? { ...defaultSiteData.zoomInfo, ...json.zoomInfo }
          : defaultSiteData.zoomInfo,
      portalPasscode:
        typeof json.portalPasscode === "string"
          ? json.portalPasscode
          : defaultSiteData.portalPasscode,
    };

    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return readSiteData();
  }
};

export const writeSiteData = async (data: SiteData) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const response = await fetch(SITE_DATA_API_PATH, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(result?.error ?? "Failed to save site data");
    }

    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to save site data");
  }
};

export const resetSiteData = async (): Promise<SiteData> => {
  if (typeof window !== "undefined") {
    try {
      await fetch(SITE_DATA_API_PATH, { method: "DELETE" });
    } catch {
      // ignore and fall back to local storage cleanup
    }

    window.localStorage.removeItem(CONTENT_STORAGE_KEY);
    window.dispatchEvent(new Event(CONTENT_UPDATED_EVENT));
  }

  return defaultSiteData;
};
