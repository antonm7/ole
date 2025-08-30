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
import { create } from "zustand";


type ClubStore = {
    club: ClubKey;
    setClub: (club: ClubKey) => void;
};

export const useClubStore = create<ClubStore>((set) => ({
    club: "hapoel-tel-aviv", // default club
    setClub: (club) => set({ club }),
}));

export function useSetClub(): (club: ClubKey) => void {
    return useClubStore((s) => s.setClub);
}

export function useClub(): ClubKey {
  return useClubStore(s => s.club);
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
