// @ts-nocheck
import React from "react";
import { TextField, Button, Box, Tooltip } from "@mui/material";
import { saveAs } from "file-saver";
import axios from "axios";

const CsvExportForm = () => {
    const [fromDate, setFromDate] = React.useState("");
    const [toDate, setToDate] = React.useState("");
    const [sensorId, setSensorId] = React.useState("");

    const handleExport = async () => {
        try {
            // Build query params
            const params = {};
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            if (sensorId) params.deviceId = sensorId;

            const response = await axios.get("http://localhost:8080/api/ttn/records/filter", { params });
            const data = response.data;


            const flattenedData = data.map(item => {
                const flat = { ...item };
                if (item.extraFields) {
                    try {
                        const parsed = typeof item.extraFields === "string"
                            ? JSON.parse(item.extraFields.replace(/;/g, ","))
                            : item.extraFields;
                        Object.entries(parsed).forEach(([key, val]) => {
                            flat[key] = val;
                        });
                    } catch (e) {
                        console.warn("Could not parse extraFields:", e);
                    }
                }
                delete flat.extraFields;
                return flat;
            });

            const headers = Array.from(new Set(flattenedData.flatMap(obj => Object.keys(obj))));

            const csvRows = [
                headers.join(","),
                ...flattenedData.map(row =>
                    headers
                        .map(field => {
                            let value = row[field];
                            if (typeof value === "object" && value !== null) {
                                value = JSON.stringify(value).replace(/,/g, ";");
                            }
                            return `"${value ?? ""}"`;
                        })
                        .join(",")
                ),
            ];

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
            saveAs(blob, "ttn_sensors.csv");

            setFromDate("");
            setToDate("");
            setSensorId("");

        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("Error fetching data from server.");
        }
    };

    return (
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
                type="date"
                label="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: 120 }}
            />
            <TextField
                type="date"
                label="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ width: 120 }}
            />
            <TextField
                label="Sensor ID"
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
                size="small"
                sx={{ width: 120 }}
            />

            <Tooltip title="Export filtered sensor data to CSV" arrow>
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
                >
                    CSV
                </Button>
            </Tooltip>
        </Box>
    );
};

export default CsvExportForm;
