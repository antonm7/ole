export type TierKey = "silver" | "gold" | "diamond";

export type Tier = {
    key: string;
    name: string;
    min: number;
    icon: string;
    colorFrom: string;
    colorTo: string;
    perks: string[];
    description: string;
  };
  
  export const TIERS: Tier[] = [
    {
      key: "bronze",
      name: "ברונזה",
      min: 0,
      icon: "star-border",
      colorFrom: "#d7ccc8",
      colorTo: "#a1887f",
      description: "הדרגה הראשונה לכל משתמש חדש.",
      perks: ["הטבות בסיסיות", "צבירת נקודות על רכישות"],
    },
    {
      key: "silver",
      name: "כסף",
      min: 2000,
      icon: "star-half",
      colorFrom: "#cfd8dc",
      colorTo: "#90a4ae",
      description: "דרגה מתקדמת עם יותר יתרונות.",
      perks: ["הנחות מיוחדות", "מבצעים בלעדיים"],
    },
    {
      key: "gold",
      name: "זהב",
      min: 5000,
      icon: "star",
      colorFrom: "#ffd54f",
      colorTo: "#ffb300",
      description: "דרגה יוקרתית עם יתרונות רבים.",
      perks: ["כרטיסים חינם", "שירות VIP", "מתנות מיוחדות"],
    },
    {
      key: "diamond",
      name: "יהלום",
      min: 10000,
      icon: "diamond",
      colorFrom: "#80deea",
      colorTo: "#26c6da",
      description: "הדרגה הגבוהה ביותר — כל הכבוד!",
      perks: ["הטבות מקסימליות", "גישה ראשונה לכל האירועים"],
    },
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
  