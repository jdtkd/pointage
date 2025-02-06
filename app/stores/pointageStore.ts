import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PointageType = 'ARRIVEE' | 'DEPART' | 'ABSENCE';

export interface Pointage {
  id: string;
  type: PointageType;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  commentaire?: string;
  status: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
}

interface PointageStore {
  pointages: Pointage[];
  dernierPointage: Pointage | null;
  isPointing: boolean;
  // Actions
  addPointage: (pointage: Omit<Pointage, 'id' | 'status'>) => void;
  updatePointage: (id: string, updates: Partial<Pointage>) => void;
  deletePointage: (id: string) => void;
  setIsPointing: (status: boolean) => void;
}

export const usePointageStore = create<PointageStore>()(
  persist(
    (set) => ({
      pointages: [],
      dernierPointage: null,
      isPointing: false,

      addPointage: (newPointage) => set((state) => {
        const pointage: Pointage = {
          ...newPointage,
          id: crypto.randomUUID(),
          status: 'EN_ATTENTE',
        };
        return {
          pointages: [pointage, ...state.pointages],
          dernierPointage: pointage,
        };
      }),

      updatePointage: (id, updates) => set((state) => ({
        pointages: state.pointages.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      })),

      deletePointage: (id) => set((state) => ({
        pointages: state.pointages.filter((p) => p.id !== id),
      })),

      setIsPointing: (status) => set({ isPointing: status }),
    }),
    {
      name: 'pointage-store',
    }
  )
); 