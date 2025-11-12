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

const DeleteErrorDialog = ({ open, onClose }) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#f44336", fontWeight: "bold" }}>
            Error
        </DialogTitle>
        <DialogContent>
            <Typography sx={{ color: "#f44336" }}>
                Something went wrong while deleting.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}
                sx={{ backgroundColor: "#512da8", color: "#fff" }}
                variant="contained"
            >
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default DeleteErrorDialog;
