import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PointageType = 'ARRIVEE' | 'DEPART';

export interface Pointage {
  id?: string;
  type: PointageType;
  timestamp: string;
  location: {
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
  addPointage: (pointage: Omit<Pointage, 'id' | 'status'>) => boolean;
  updatePointage: (id: string, updates: Partial<Pointage>) => void;
  deletePointage: (id: string) => void;
  setIsPointing: (status: boolean) => void;
}

export const usePointageStore = create<PointageStore>()(
  persist(
    (set, get) => ({
      pointages: [],
      dernierPointage: null,
      isPointing: false,

      addPointage: (newPointage) => {
        const state = get();
        const aujourdhui = new Date().toLocaleDateString();
        
        // Vérifier si un pointage du même type existe déjà aujourd'hui
        const pointageExistant = state.pointages.find(p => 
          new Date(p.timestamp).toLocaleDateString() === aujourdhui && 
          p.type === newPointage.type
        );

        if (pointageExistant) {
          return false; // Pointage déjà existant pour aujourd'hui
        }

        // Vérifier la cohérence arrivée/départ
        if (newPointage.type === 'DEPART') {
          const dernierPointageArrivee = state.pointages.find(p => 
            new Date(p.timestamp).toLocaleDateString() === aujourdhui && 
            p.type === 'ARRIVEE'
          );
          
          if (!dernierPointageArrivee) {
            return false; // Pas de pointage d'arrivée pour aujourd'hui
          }
        }

        const pointage: Pointage = {
          ...newPointage,
          id: crypto.randomUUID(),
          status: 'EN_ATTENTE',
        };

        set((state) => ({
          pointages: [pointage, ...state.pointages],
          dernierPointage: pointage,
        }));

        return true;
      },

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