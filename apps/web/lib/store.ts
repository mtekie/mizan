import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

type MizanStore = {
    aiEnabled: boolean;
    themeMode: ThemeMode;
    setAiEnabled: (e: boolean) => void;
    setThemeMode: (theme: ThemeMode) => void;
};

export const useStore = create<MizanStore>()(
    persist(
        (set) => ({
            aiEnabled: true,
            themeMode: 'light' as ThemeMode,
            setAiEnabled: (aiEnabled) => set({ aiEnabled }),
            setThemeMode: (themeMode) => set({ themeMode }),
        }),
        {
            name: 'mizan-demo-storage',
        }
    )
);
