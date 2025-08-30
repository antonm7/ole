// /hooks/useClubTheme.ts
import {
    getClubColors,
    getGlobalColors,
    type ClubKey,
    type ClubTheme,
    type GlobalTheme,
    type ModeKey,
} from "@/constants/Colors";
import { useColorScheme } from "react-native";

/** TODO: replace with your real club source (context/profile/async storage) */
export function useClub(): ClubKey {
  return "maccabi-haifa"; // or "maccabi"
}

type OptionsClub = { scope?: "club"; club?: ClubKey; mode?: ModeKey };
type OptionsGlobal = { scope: "global"; mode?: ModeKey };

// overloads
export function useClubTheme(opts: OptionsGlobal): GlobalTheme;
export function useClubTheme(opts?: OptionsClub): ClubTheme;

export function useClubTheme(opts: OptionsClub | OptionsGlobal = {} as OptionsClub) {
  // ✅ hooks called unconditionally
  const system = useColorScheme();
  const clubFromContext = useClub();

  const mode = ((opts as any).mode ?? system ?? "light") as ModeKey;

  if ((opts as OptionsGlobal).scope === "global") {
    return getGlobalColors(mode);
  }

  const club = (opts as OptionsClub).club ?? clubFromContext;
  return getClubColors(club, mode);
}
