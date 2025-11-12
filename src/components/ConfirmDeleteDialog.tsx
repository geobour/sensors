// @ts-nocheck
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from "@mui/material";

const ConfirmDeleteDialog = ({
                                 open,
                                 record,
                                 onCancel,
                                 onConfirm,
                                 isDeleting,
                             }) => (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#512da8", fontWeight: "bold" }}>
            Confirm Delete
        </DialogTitle>
        <DialogContent>
            <Typography sx={{ color: "#512da8" }}>
                Are you sure you want to delete sensor{" "}
                <strong>{record?.deviceId}</strong>?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onCancel}
                sx={{ backgroundColor: "#512da8", color: "#fff" }}
                variant="contained"
            >
                Cancel
            </Button>
            <Button
                onClick={onConfirm}
                disabled={isDeleting}
                sx={{ backgroundColor: "#512da8", color: "#fff" }}
                variant="contained"
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDeleteDialog;
