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

const DeleteSuccessDialog = ({ open, onClose }) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "#4caf50", fontWeight: "bold" }}>
            Success
        </DialogTitle>
        <DialogContent>
            <Typography sx={{ color: "#4caf50" }}>
                Device deleted successfully.
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

export default DeleteSuccessDialog;
