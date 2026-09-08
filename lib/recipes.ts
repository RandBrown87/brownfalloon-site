export type { CurrentDrink, ArchiveEntry } from "@/lib/site-data";
import { readSiteData } from "@/lib/site-data";

export const currentDrink = readSiteData().currentDrink;
export const archive = readSiteData().archive;
