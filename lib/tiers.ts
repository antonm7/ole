// lib/tiers.ts
export type TierKey = "silver" | "gold" | "diamond";

export type Tier = {
  key: TierKey;
  name: string;
  min: number;
  colorFrom: string;
  colorTo: string;
  icon: string;
  perks: string[];
};

export const TIERS: Tier[] = [
  { key: "silver", name: "כסף", min: 0, colorFrom: "#B0BEC5", colorTo: "#90A4AE", icon: "military-tech", perks: [] },
  { key: "gold", name: "זהב", min: 5000, colorFrom: "#FFC107", colorTo: "#FFB300", icon: "workspace-premium", perks: [] },
  { key: "diamond", name: "יהלום", min: 15000, colorFrom: "#80DEEA", colorTo: "#26C6DA", icon: "diamond", perks: [] },
];

export function getCurrentTier(points: number): Tier {
  return TIERS.slice().reverse().find(t => points >= t.min) || TIERS[0];
}

export function getNextTier(points: number): Tier | null {
  const higher = TIERS.filter(t => t.min > points).sort((a, b) => a.min - b.min);
  return higher[0] ?? null;
}

export function getProgress(points: number) {
    const current = getCurrentTier(points);
    const next = getNextTier(points);
  
    if (!next) {
      return { current, next, progress: 1, toNext: 0 };
    }
  
    // progress should reset each level
    const span = next.min - current.min; // size of this tier
    const progress = (points - current.min) / span; // ✅ relative to current tier
    const toNext = Math.max(0, next.min - points);
  
    return {
      current,
      next,
      progress: Math.min(1, Math.max(0, progress)),
      toNext,
    };
  }
  