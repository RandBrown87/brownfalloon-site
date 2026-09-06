export type CurrentDrink = {
  name: string;
  host: string;
  month: string;
  blurb: string;
  ingredients: string[];
  steps: string[];
  shopBy: string;
};

export const currentDrink: CurrentDrink = {
  name: "xxxxxx",
  host: "Dad",
  month: "September",
  blurb:
    "Dad's fall twist on the family favorite — pear instead of orange, a cinnamon-clove syrup, and a smoked garnish if your setup allows it.",
  ingredients: [
    "XXXXXXXX",
  ],
  steps: [
    "XXXXXXXX"
  ],
  shopBy: "Wednesday, October 1",
};

export type ArchiveEntry = {
  month: string;
  host: string;
  drink: string;
  note?: string;
};

export const archive: ArchiveEntry[] = [
  { month: "September", host: "Rand", drink: "Classic Manhattan", note: "Two rye brands, blind taste test — rye #2 won." },
  { month: "August", host: "Weston", drink: "Peach Bellini", note: "Made a virgin batch for the kids' table too." },
  { month: "July", host: "Mom", drink: "Shirley Temple Float", note: "Root beer version was the sleeper hit." },
  { month: "June", host: "Dad", drink: "Smoked Whiskey Sour", note: "The smoking gun made a mess. Worth it." },
  { month: "May", host: "Paige", drink: "Cucumber Gimlet" },
  { month: "April", host: "Rand", drink: "Paper Plane", note: "First call anyone finished the toast without laughing." },
  { month: "March", host: "Weston", drink: "Irish Coffee" },
  { month: "February", host: "Dad", drink: "Negroni", note: "Half the family still won't try it." },
  { month: "January", host: "Mom", drink: "Hot Toddy", note: "The one that started it all." },
];
