import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTtnConnectionStore = create(
    persist(
        (set) => ({
            connected: false,
            showForm: true,

            setConnected: () => set({ connected: true, showForm: false }),
            setDisconnected: () => set({ connected: false, showForm: true }),
            toggleForm: (show) => set({ showForm: show }),
        }),
        {
            name: "ttn-connection-store",
            version: 1,
            // This ensures the state resets to disconnected on reload
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.connected = false;
                    state.showForm = true;
                }
            },
        }
    )
);
