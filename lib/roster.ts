export type HostMonth = {
  month: string;
  monthIndex: number; // 0 = January
  day: number; // day of month the call falls on
  host: string;
  note?: string;
};

// All calls fall in this year — update when the year rolls over.
export const year = 2026;

export const roster: HostMonth[] = [
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

// Update this each month when hosting duties change hands.
export const currentMonthIndex = 9;
export const currentHost = roster[currentMonthIndex];
