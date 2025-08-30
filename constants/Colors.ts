// /constants/Colors.ts
export type ModeKey = "light" | "dark";
export type ClubKey = "hapoel" | "maccabi";

/* ----------------------------- Global (Neutral) ---------------------------- */

const globalBase = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    icon: "#687076",
    tabIconDefault: "#687076",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
  },
} as const;

export const GlobalColors = {
  light: {
    ...globalBase.light,
    primary: "#0F62FE",
    onPrimary: "#FFFFFF",
    globalButton: "#0F62FE",
    tint: "#0F62FE",
    tabIconSelected: "#0F62FE",
  },
  dark: {
    ...globalBase.dark,
    primary: "#4C8DFF",
    onPrimary: "#0A0A0A",
    globalButton: "#4C8DFF",
    tint: "#FFFFFF",
    tabIconSelected: "#FFFFFF",
  },
} as const;

export type GlobalTheme = {
  text: string;
  background: string;
  icon: string;
  tabIconDefault: string;
  primary: string;
  onPrimary: string;
  globalButton: string;
  tint: string;
  tabIconSelected: string;
};

export function getGlobalColors(mode: ModeKey = "light"): GlobalTheme {
  return GlobalColors[mode] as unknown as GlobalTheme;
}

/* ----------------------------- Club (Branded) ------------------------------ */

const clubBase = globalBase;

export const ClubColors = {
  hapoel: {
    light: {
      ...clubBase.light,
      primary: "#D52F26",
      primaryDark: "#B01C17",
      secondary: "#FFFFFF",
      onPrimary: "#FFFFFF",
      globalButton: "#FFFFFF",
      tint: "#D52F26",
      tabIconSelected: "#D52F26",
      headerGradient: ["#D52F26", "#B01C17"] as const,
    },
    dark: {
      ...clubBase.dark,
      primary: "#D52F26",
      primaryDark: "#8C1512",
      secondary: "#FFFFFF",
      onPrimary: "#FFFFFF",
      globalButton: "#FFFFFF",
      tint: "#FFFFFF",
      tabIconSelected: "#FFFFFF",
      headerGradient: ["#D52F26", "#8C1512"] as const,
    },
  },
  maccabi: {
    light: {
      ...clubBase.light,
      primary: "#00843D",
      primaryDark: "#016A31",
      secondary: "#FFFFFF",
      onPrimary: "#FFFFFF",
      globalButton: "#FFFFFF",
      tint: "#00843D",
      tabIconSelected: "#00843D",
      headerGradient: ["#00843D", "#016A31"] as const,
    },
    dark: {
      ...clubBase.dark,
      primary: "#00843D",
      primaryDark: "#015528",
      secondary: "#FFFFFF",
      onPrimary: "#FFFFFF",
      globalButton: "#FFFFFF",
      tint: "#FFFFFF",
      tabIconSelected: "#FFFFFF",
      headerGradient: ["#00843D", "#015528"] as const,
    },
  },
} as const;

export type ClubTheme = {
  text: string;
  background: string;
  icon: string;
  tabIconDefault: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  onPrimary: string;
  globalButton: string;
  tint: string;
  tabIconSelected: string;
  headerGradient: readonly [string, string];
};

export function getClubColors(club: ClubKey, mode: ModeKey = "light"): ClubTheme {
  return ClubColors[club][mode] as unknown as ClubTheme;
}

/* ---------------------------- Utility (optional) --------------------------- */
type AnyTheme = GlobalTheme | ClubTheme;
export type StringColorKeys = {
  [K in keyof AnyTheme]: AnyTheme[K] extends string ? K : never
}[keyof AnyTheme];
