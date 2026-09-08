export type { HostMonth } from "@/lib/site-data";
import { readSiteData } from "@/lib/site-data";

const siteData = readSiteData();

export const year = siteData.year;
export const roster = siteData.roster;
export const currentMonthIndex = siteData.currentMonthIndex;
export const currentHost = roster[currentMonthIndex] ?? roster[0];
