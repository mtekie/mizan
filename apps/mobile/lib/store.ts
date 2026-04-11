import { create } from 'zustand';
import { persist, StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

export type UIMode = 'simple' | 'pro';

interface MizanStore {
  uiMode: UIMode;
  aiEnabled: boolean;
  setUiMode: (mode: UIMode) => void;
  setAiEnabled: (enabled: boolean) => void;
}

export const useStore = create<MizanStore>()(
  persist(
    (set) => ({
      uiMode: 'simple',
      aiEnabled: true,
      setUiMode: (mode) => set({ uiMode: mode }),
      setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
    }),
    {
      name: 'mizan-mobile-storage',
      storage: zustandStorage,
    }
  )
);
