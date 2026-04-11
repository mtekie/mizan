import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UIMode = 'simple' | 'pro';

type MizanStore = {
    aiEnabled: boolean;
    uiMode: UIMode;
    modeExplicitlySet: boolean;
    setAiEnabled: (e: boolean) => void;
    setUiMode: (mode: UIMode) => void;
};

export const useStore = create<MizanStore>()(
    persist(
        (set) => ({
            aiEnabled: true,
            uiMode: 'simple' as UIMode,
            modeExplicitlySet: false,
            setAiEnabled: (aiEnabled) => set({ aiEnabled }),
            setUiMode: (uiMode) => set({ uiMode, modeExplicitlySet: true }),
        }),
        {
            name: 'mizan-demo-storage',
        }
    )
);
