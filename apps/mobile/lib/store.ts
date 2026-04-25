import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
let storage: any = null;
try {
  const { MMKV } = require('react-native-mmkv');
  if (MMKV) {
    storage = new MMKV();
  }
} catch (e) {
  console.warn('MMKV fallback', e);
}

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage?.set(name, value);
  },
  getItem: (name) => {
    const value = storage?.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage?.delete(name);
  },
};

interface MizanStore {
  aiEnabled: boolean;
  profile: {
    fullName: string;
    username: string;
    primaryBanks: { bankId: string; accountNumber?: string; balance?: string }[];
    currency: string;
    goals: { name: string; target?: string; emoji?: string; specifics?: Record<string, string> }[];
    isComplete: boolean;
    gender?: string;
    monthlyIncomeRange?: string;
    educationLevel?: string;
    employmentStatus?: string;
    housingStatus?: string;
    riskAppetite?: string;
  };
  isGuest: boolean;
  setAiEnabled: (enabled: boolean) => void;
  setProfile: (profile: Partial<MizanStore['profile']>) => void;
  setGuest: (isGuest: boolean) => void;
}

export const useStore = create<MizanStore>()(
  persist(
    (set) => ({
      aiEnabled: true,
      isGuest: false,
      profile: {
        fullName: '',
        username: '',
        primaryBanks: [],
        currency: 'ETB',
        goals: [],
        isComplete: false,
      },
      setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
      setGuest: (isGuest) => set({ isGuest }),
      setProfile: (newProfile) => set((state) => ({ 
        profile: { ...state.profile, ...newProfile } 
      })),
    }),
    {
      name: 'mizan-mobile-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
