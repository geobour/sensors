import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMqttConnectionStore = create(
    persist(
        (set) => ({
            connected: false,
            formDisappear: false,

            setConnected: () => set({ connected: true, formDisappear: true }),
            setDisconnected: () => set({ connected: false, formDisappear: false }),
            toggleForm: (show) => set({ formDisappear: show }),
        }),
        {
            name: "mqtt-connection-store",
            version: 1
        }
    )
);
