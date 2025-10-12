import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMqttConnectionStore = create(
    persist(
        (set, get) => ({
            connected: false,
            formDisappear: false,

            // 🔌 Connect
            setConnected: () => set({ connected: true, formDisappear: true }),

            // 🔌 Disconnect — resets Zustand state and clears localStorage
            setDisconnected: () => {
                set({ connected: false, formDisappear: false });
                try {
                    // remove persisted data from localStorage
                    localStorage.removeItem("mqtt-connection-store");
                } catch (err) {
                    console.warn("Error clearing persisted store:", err);
                }
            },

            // Toggle the connection form visibility
            toggleForm: () => set((state) => ({ formDisappear: !state.formDisappear })),

            // Optional global reset (useful for debugging or logout)
            resetStore: () => {
                set({ connected: false, formDisappear: false });
                localStorage.removeItem("mqtt-connection-store");
            },
        }),
        {
            name: "mqtt-connection-store", // visible in Application → Local Storage
        }
    )
);
