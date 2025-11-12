import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useTtnConnectionStore } from "../stores/useTtnConnectionStore";

interface ConnectParams {
    appId: string;
    accessKey: string;
    region: string;
    setErrorMessage: (msg: string) => void;
}

export const useTtnConnect = ({
                                  appId,
                                  accessKey,
                                  region,
                                  setErrorMessage,
                              }: ConnectParams) => {
    const queryClient = useQueryClient();
    const { setConnected, setDisconnected, toggleForm } = useTtnConnectionStore();

    return useMutation(
        () =>
            axios.post("http://localhost:8080/api/mqtt/connect-ttn", null, {
                params: { appId, accessKey, region },
            }),
        {
            onSuccess: () => {
                setConnected();
                toggleForm(false);
                queryClient.invalidateQueries("ttnSensors");
            },
            onError: () => {
                setErrorMessage(
                    "❌ Connection failed. Please check App ID, Access Key, and Region."
                );
                setDisconnected();
                toggleForm(true);
            },
        }
    );
};
