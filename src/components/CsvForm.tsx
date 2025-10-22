// @ts-nocheck
import React from "react";
import {
    TextField,
    Button,
    Box,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import axios from "axios";

const CsvExportForm = () => {
    const [fromDate, setFromDate] = React.useState("");
    const [toDate, setToDate] = React.useState("");
    const [sensorId, setSensorId] = React.useState("");
    const [exporting, setExporting] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMessage, setDialogMessage] = React.useState("");

    const showDialog = (message) => {
        setDialogMessage(message);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        // Reset form on dialog close
        setFromDate("");
        setToDate("");
        setSensorId("");
    };

    const handleExport = async () => {
        setExporting(true);

        try {
            const params = { deviceId: sensorId, fromDate, toDate };
            const response = await axios.get(
                "http://localhost:8080/api/ttn/records/filter",
                { params, validateStatus: () => true }
            );

            if (response.status === 400) {
                showDialog(response.data?.error || "Bad request: missing or invalid parameters.");
                return;
            }

            if (response.status === 204) {
                showDialog("No records found for the given date or device Id.");
                return;
            }

            if (response.status >= 500) {
                showDialog("Server error while fetching data. Please try again later.");
                return;
            }

            if (response.status !== 200) {
                showDialog("Unexpected response from server: " + response.status);
                return;
            }

            const data = response.data;

            const flattenedData = data.map((item) => {
                const flat = { ...item };
                if (item.extraFields) {
                    try {
                        const parsed =
                            typeof item.extraFields === "string"
                                ? JSON.parse(item.extraFields.replace(/;/g, ","))
                                : item.extraFields;
                        Object.entries(parsed).forEach(([key, val]) => (flat[key] = val));
                    } catch (e) {
                        console.warn("Could not parse extraFields:", e);
                    }
                }
                delete flat.extraFields;
                return flat;
            });

            const headers = Array.from(
                new Set(flattenedData.flatMap((obj) => Object.keys(obj)))
            );
            const csvRows = [
                headers.join(","),
                ...flattenedData.map((row) =>
                    headers.map((field) => `"${row[field] ?? ""}"`).join(",")
                ),
            ];

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
            saveAs(blob, "ttn_sensors.csv");
        } catch (error) {
            console.error("Request failed:", error);
            showDialog("Network error: Could not reach the server.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <>
            <Box
                component="form"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 3,
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    type="date"
                    label="From"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: 150 }}
                />

                <TextField
                    required
                    type="date"
                    label="To"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    sx={{ width: 150 }}
                />

                <TextField
                    required
                    label="Sensor ID"
                    value={sensorId}
                    onChange={(e) => setSensorId(e.target.value)}
                    size="small"
                    sx={{ width: 150 }}
                />

                <Tooltip title="Export filtered sensor data to CSV" arrow>
                    <span>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "#512da8",
                                color: "#512da8",
                                fontWeight: "bold",
                                height: "36px",
                                "&:hover": {
                                    borderColor: "#512da8",
                                    backgroundColor: "rgba(81,45,168,0.1)",
                                },
                                "&:active": {
                                    backgroundColor: "rgba(81,45,168,0.2)",
                                },
                                "&:focus": {
                                    outline: "none",
                                    boxShadow: "0 0 0 2px rgba(81,45,168,0.3)",
                                },
                            }}
                            onClick={handleExport}
                            disabled={exporting || !fromDate || !toDate || !sensorId}
                        >
                            {exporting ? "Exporting..." : "CSV Export"}
                        </Button>
                    </span>
                </Tooltip>
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: "#512da8" }}>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ color: "#512da8", fontWeight: "bold" }}
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CsvExportForm;
