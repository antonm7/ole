import { create } from "zustand";


type PointsStore = {
    points: number;
    setPoints: (points:number) => void;
};

export const usePointsStore = create<PointsStore>((set) => ({
    points:3000,
    setPoints: (points) => set({ points }),
}));

export function useSetPoints(): (points:number) => void {
    return usePointsStore((s) => s.setPoints);
}

export function usePoints():number {
  return usePointsStore(s => s.points);
}