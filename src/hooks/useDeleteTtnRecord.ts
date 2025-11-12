import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const API_BASE = "http://localhost:8080/api/ttn";

interface DeleteOptions {
    setDeleteDialogOpen: (open: boolean) => void;
    setRecordToDelete: (record: any) => void;
    setDeleteSuccessDialogOpen: (open: boolean) => void;
    setDeleteErrorDialogOpen: (open: boolean) => void;
}

export const useDeleteTtnRecord = ({
                                       setDeleteDialogOpen,
                                       setRecordToDelete,
                                       setDeleteSuccessDialogOpen,
                                       setDeleteErrorDialogOpen,
                                   }: DeleteOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (deviceId: string) => {
            return axios.delete(`${API_BASE}/records/device/${deviceId}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries("ttnSensors");
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
                setDeleteSuccessDialogOpen(true);
            },
            onError: (err) => {
                setDeleteDialogOpen(false);
                setRecordToDelete(null);
                setDeleteErrorDialogOpen(true);
            },
        }
    );

};
