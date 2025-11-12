import { useQuery } from "react-query";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/ttn";

export const useTtnSensors = (enabled: boolean) => {
    return useQuery(
        "ttnSensors",
        async () => {
            const response = await axios.get(`${API_BASE}/records`);
            return response.data;
        },
        {
            enabled,
            refetchInterval: 300_000, // refetch every 5 minutes
        }
    );
};
