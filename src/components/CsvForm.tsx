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
    IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
        setFromDate("");
        setToDate("");
        setSensorId("");
    };

    const downloadCsv = (data, filename = "ttn_sensors.csv") => {
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

            // Keep all other fields, don't delete anything
            return flat;
        });

        // Collect all unique keys from all rows
        const headers = Array.from(
            new Set(flattenedData.flatMap((obj) => Object.keys(obj)))
        );

        const csvRows = [
            headers.join(","), // Header row
            ...flattenedData.map((row) =>
                headers.map((field) => `"${row[field] ?? ""}"`).join(",")
            ),
        ];

        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
        saveAs(blob, filename);
    };

    const handleExportFiltered = async () => {
        setExporting(true);
        try {
            const params = { deviceId: sensorId, fromDate, toDate };
            const response = await axios.get(
                "http://localhost:8080/api/ttn/records/filter",
                { params, validateStatus: () => true }
            );

            if (response.status !== 200) {
                showDialog(
                    response.data?.error ||
                    "Error fetching filtered data. Status: " + response.status
                );
                return;
            }

            downloadCsv(response.data);
        } catch (error) {
            console.error(error);
            showDialog("Network error: Could not reach the server.");
        } finally {
            setExporting(false);
        }
    };

    const handleExportAll = async () => {
        setExporting(true);
        try {
            const response = await axios.get(
                "http://localhost:8080/api/ttn/records/all",
                { validateStatus: () => true }
            );

            if (response.status !== 200) {
                showDialog(
                    response.data?.error ||
                    "Error fetching all records. Status: " + response.status
                );
                return;
            }

            downloadCsv(response.data, "ttn_sensors_all.csv");
        } catch (error) {
            console.error(error);
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
                            variant="contained"
                            sx={{
                                backgroundColor: '#512da8',
                                color: 'white',
                                '&:hover': { backgroundColor: "#9c27b0" },
                                fontWeight: 'bold'
                            }}
                            onClick={handleExportFiltered}
                            disabled={exporting || !fromDate || !toDate || !sensorId}
                        >
                            {exporting ? "Exporting..." : "Export"}
                        </Button>
                    </span>
                </Tooltip>

                <Tooltip title="Export all sensor data to CSV" arrow>
                    <span>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#512da8',
                                color: 'white',
                                '&:hover': { backgroundColor: "#9c27b0" },
                                fontWeight: 'bold'
                            }}
                            onClick={handleExportAll}
                            disabled={exporting}
                        >
                            {exporting ? "Exporting..." : "Export All"}
                        </Button>
                    </span>
                </Tooltip>

                <Tooltip
                    title={
                        <Box sx={{ p: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                CSV Export Info
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                • <strong>Export</strong>: Downloads csv records filtered by
                                <br /> device ID and date range.
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                • <strong>Export All</strong>: Downloads <u>all</u> records
                                from every device.
                            </Typography>
                        </Box>
                    }
                    arrow
                    placement="right"
                >
                    <IconButton sx={{ color: "#512da8", height: "36px" }}>
                        <InfoOutlinedIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle sx={{ color: "#512da8", fontWeight: "bold" }}>Notice</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: "#512da8" }}>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            backgroundColor: "#512da8",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#6a1b9a" },
                        }}
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
