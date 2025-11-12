// @ts-nocheck
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Divider,
    Box,
} from "@mui/material";
import {useHeaders} from "../hooks/useHeaders";

const isOlderThan6Hours = (dateString) => {
    const receivedDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now - receivedDate) / (1000 * 60 * 60);
    return diffHours > 6;
};

const SensorDetailsDialog = ({ open, record, onClose }) => {
    const { headers } = useHeaders();
    if (!record) return null;
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: "#512da8", fontWeight: "bold" }}>
                Sensor Details — {record.deviceId}
            </DialogTitle>

            <DialogContent dividers>
                {/* === Basic Info === */}
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                    General Info
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Typography variant="body1">
                    Device ID: <strong>{record.deviceId}</strong>
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        color: isOlderThan6Hours(record.receivedAt) ? "red" : "black",
                        fontWeight: isOlderThan6Hours(record.receivedAt) ? "bold" : "normal",
                    }}
                >
                    Received At: <strong>{new Date(record.receivedAt).toLocaleString()}</strong>
                </Typography>

                <Typography variant="body1">
                    Gateway ID: <strong>{record.gatewayId ?? "-"}</strong>
                </Typography>

                <Typography variant="body1">
                    Frequency: <strong>{record.frequency ?? "-"}</strong>
                </Typography>

                <Typography variant="body1">
                    Latitude: <strong>{record.latitude ?? "-"}</strong>
                </Typography>

                <Typography variant="body1">
                    Longitude: <strong>{record.longitude ?? "-"}</strong>
                </Typography>

                {/* === Sensor Values === */}
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                    Sensor Values
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Box display="flex">
                    <Box display="flex" flexDirection="column" mr={10}>
                        <Typography variant="body1">
                            {headers?.valueOne ?? "Value One"}: <strong>{record.valueOne ?? "-"}</strong>
                        </Typography>
                        <Typography variant="body1">
                            {headers?.valueTwo ?? "Value Two"}: <strong>{record.valueTwo ?? "-"}</strong>
                        </Typography>
                        <Typography variant="body1">
                            {headers?.valueThree ?? "Value Three"}: <strong>{record.valueThree ?? "-"}</strong>
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" >
                        <Typography variant="body1">
                            {headers?.valueFour ?? "Value Four"}: <strong>{record.valueFour ?? "-"}</strong>
                        </Typography>
                        <Typography variant="body1">
                            {headers?.valueFive ?? "Value Five"}: <strong>{record.valueFive ?? "-"}</strong>
                        </Typography>
                        <Typography variant="body1">
                            {headers?.valueSix ?? "Value Six"}: <strong>{record.valueSix ?? "-"}</strong>
                        </Typography>
                    </Box>
                </Box>



                {/* === Network Info === */}
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                    Network & Signal
                </Typography>
                <Divider sx={{ mb: 1 }} />

                <Typography variant="body1">
                    RSSI: <strong>{record.rssi ?? "-"}</strong>
                </Typography>
                <Typography variant="body1">
                    Channel RSSI: <strong>{record.channelRssi ?? "-"}</strong>
                </Typography>
                <Typography variant="body1">
                    SNR: <strong>{record.snr ?? "-"}</strong>
                </Typography>
                <Typography variant="body1">
                    Bandwidth: <strong>{record.bandwidth ?? "-"}</strong>
                </Typography>
                <Typography variant="body1">
                    Spreading Factor: <strong>{record.spreadingFactor ?? "-"}</strong>
                </Typography>

                {/* === Extra Fields === */}
                {record.extraFields && Object.keys(record.extraFields).length > 0 && (
                    <>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2 }}>
                            Extra Fields
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        {Object.entries(record.extraFields).map(([key, value]) => (
                            <Typography key={key} variant="body1">
                                {key}:{" "}
                                {key.toLowerCase() === "status" ? (
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: Number(value) === 1 ? "green" : "red",
                                        }}
                                    />
                                ) : (
                                    <strong>{value}</strong>
                                )}
                            </Typography>
                        ))}
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        backgroundColor: "#512da8",
                        color: "#fff",
                        fontWeight: "bold",
                        ":hover": { backgroundColor: "#c089f2" },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SensorDetailsDialog;
