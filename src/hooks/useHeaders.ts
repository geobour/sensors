import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export interface TtnHeaders {
    valueOne: string;
    valueTwo: string;
    valueThree: string;
    valueFour?: string;
    valueFive?: string;
    valueSix?: string;
}

export const useHeaders = () => {
    const queryClient = useQueryClient();

    const defaultHeaders: TtnHeaders = {
        valueOne: "Value One",
        valueTwo: "Value Two",
        valueThree: "Value Three",
        valueFour: "Value Four",
        valueFive: "Value Five",
        valueSix: "Value Six",
    };

    const { data, isLoading, isError } = useQuery<TtnHeaders>(
        "ttnHeaders",
        async () => {
            const res = await axios.get("http://localhost:8080/api/ttn/labels");
            return res.data;
        },
        {
            // Return default values until the query succeeds
            initialData: defaultHeaders,
        }
    );

    const mutation = useMutation(
        (newHeaders: TtnHeaders) =>
            axios.post("http://localhost:8080/api/ttn/labels", newHeaders),
        {
            onSuccess: (res) => {
                // Update the cached value
                queryClient.setQueryData("ttnHeaders", res.data);
            },
        }
    );

    return { headers: data ?? defaultHeaders, isLoading, isError, updateHeaders: mutation.mutate };
};
