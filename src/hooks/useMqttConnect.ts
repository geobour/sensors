import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface UseMqttConnectParams {
    brokerUrl: string;
    username?: string;
    password?: string;
    setErrorMessage: (msg: string) => void;
}

interface UseMqttConnectReturn {
    connect: () => Promise<boolean>; // <-- now returns boolean
    disconnect: () => Promise<boolean>; // <-- now returns boolean
    isConnecting: boolean;
    isDisconnecting: boolean;
}

export const useMqttConnect = ({
                                   brokerUrl,
                                   username,
                                   password,
                                   setErrorMessage,
                               }: UseMqttConnectParams): UseMqttConnectReturn => {
    const queryClient = useQueryClient();

    const connectMutation = useMutation(
        () =>
            axios.post("http://localhost:8080/api/mqtt/connect", null, {
                params: { brokerUri: brokerUrl, username, password },
            }),
        {
            onSuccess: () => queryClient.invalidateQueries("mqttSensors"),
            onError: () =>
                setErrorMessage(
                    "❌ Connection failed. Please check Broker URL, Username, or Password."
                ),
        }
    );

    const disconnectMutation = useMutation(
        () => axios.post("http://localhost:8080/api/mqtt/disconnect"),
        {
            onSuccess: () => queryClient.invalidateQueries("mqttSensors"),
            onError: () => setErrorMessage("❌ Disconnection failed."),
        }
    );

    const connect = async (): Promise<boolean> => {
        try {
            await connectMutation.mutateAsync(); // returns a promise
            return true;
        } catch (err) {
            return false;
        }
    };

    const disconnect = async (): Promise<boolean> => {
        try {
            await disconnectMutation.mutateAsync();
            return true;
        } catch (err) {
            return false;
        }
    };

    return {
        connect,
        disconnect,
        isConnecting: connectMutation.isLoading,
        isDisconnecting: disconnectMutation.isLoading,
    };
};
