// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
    Typography,
    TextField,
    Button,
    Card,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TablePagination,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTtnConnectionStore } from "../stores/useTtnConnectionStore";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import CsvExportForm from "../components/CsvForm";

const API_BASE = "http://localhost:8080/api/ttn";

delete L.Icon.Default.prototype["_getIconUrl"];
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const RecenterOnPositions = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else {
            map.setView([37.9838, 23.7275], 8);
        }
    }, [positions, map]);
    return null;
};

const getStatusColor = (status) => (Number(status) === 1 ? "green" : "red");

const TtnSensorPage = () => {
    const queryClient = useQueryClient();
    const { connected, showForm, setConnected, setDisconnected, toggleForm } =
        useTtnConnectionStore();
    const [appId, setAppId] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [region, setRegion] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const purpleIcon = new L.Icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const connectMutation = useMutation(
        () =>
            axios.post("http://localhost:8080/api/mqtt/connect-ttn", null, {
                params: { appId, accessKey, region },
            }),
        {
            onSuccess: () => {
                setConnected();
                toggleForm(false);
                queryClient.invalidateQueries("ttnSensors");
            },
            onError: (error) => {
                const msg =
                    error.response?.data || "Failed to connect due to network/server error.";
                setErrorMessage(msg);
                setDisconnected();
                toggleForm(true);
            },
        }
    );

    const handleDisconnect = async () => {
        try {
            await axios.post("http://localhost:8080/api/mqtt/disconnect-ttn");
            setDisconnected();
            toggleForm(true);
            setAppId("");
            setAccessKey("");
            setRegion("");
            queryClient.invalidateQueries("ttnSensors");
        } catch (err) {
            console.error("Failed to disconnect:", err);
            alert("Failed to disconnect from TTN broker.");
        }
    };

    const { data, isLoading } = useQuery(
        "ttnSensors",
        async () => (await axios.get(`${API_BASE}/records`)).data,
        { enabled: connected, refetchInterval: 60000 }
    );

    const latestPerDevice = data
        ? Object.values(
            data.reduce((acc, record) => {
                const existing = acc[record.deviceId];
                if (!existing || new Date(record.receivedAt) > new Date(existing.receivedAt)) {
                    acc[record.deviceId] = record;
                }
                return acc;
            }, {})
        )
        : [];

    const validCoords = latestPerDevice.filter((d) => d.latitude && d.longitude);
    const positions = validCoords.map((d) => [d.latitude, d.longitude]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    // Show connection form if disconnected
    if (showForm) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    backgroundColor: "#f4f3f8",
                    padding: "20px",
                }}
            >
                <Card sx={{ mt: 8, p: 4, maxWidth: 420, width: "100%", borderRadius: 3 }}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ mb: 3, fontWeight: "bold", color: "#512da8" }}
                    >
                        Connect to TTN
                    </Typography>

                    <TextField
                        label="App ID"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Access Key"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Region"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: "#7b1fa2",
                            ":hover": { backgroundColor: "#6a1b9a" },
                            fontWeight: "bold",
                            py: 1,
                        }}
                        onClick={() => connectMutation.mutate()}
                        disabled={connectMutation.isLoading || !appId || !accessKey || !region}
                    >
                        {connectMutation.isLoading ? "Connecting..." : "Connect"}
                    </Button>

                    <Dialog open={!!errorMessage} onClose={() => setErrorMessage("")}>
                        <DialogTitle>Connection Error</DialogTitle>
                        <DialogContent>
                            <Typography>{errorMessage}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setErrorMessage("")}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f4f3f8" }}>
            <Typography
                variant="h5"
                sx={{
                    color: "#333",
                    mb: 2,
                    textAlign: "center",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                }}
            >
                TTN Sensors — Latest Device Data
            </Typography>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <Button
                    variant="outlined"
                    onClick={() => toggleForm(true)}
                    sx={{ mr: 2, borderColor: "#512da8", color: "#512da8", fontWeight: "bold" }}
                >
                    Connect TTN App
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDisconnect}
                    sx={{ borderColor: "#c62828", color: "#c62828", fontWeight: "bold" }}
                >
                    Disconnect
                </Button>
            </div>

            {/* Map */}
            <MapContainer
                center={[37.9838, 23.7275]}
                zoom={8}
                style={{
                    height: "450px",
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "25px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri — Source: USGS, Esri, DeLorme, NGA, NPS'
                />
                <RecenterOnPositions positions={positions} />
                {validCoords.map((record) => (
                    <Marker key={record.id} position={[record.latitude, record.longitude]} icon={purpleIcon}>
                        <Popup>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                {record.deviceId}
                            </Typography>
                            <Typography variant="body2">
                                Received At: {new Date(record.receivedAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">Temperature: {record.temperature ?? "-"} °C</Typography>
                            <Typography variant="body2">Humidity: {record.humidity ?? "-"} %</Typography>
                            <Typography variant="body2">Latitude: {record.latitude ?? "-"}</Typography>
                            <Typography variant="body2">Longitude: {record.longitude ?? "-"}</Typography>
                            {record.extraFields?.status !== undefined && (
                                <Typography variant="body2">
                                    Status:{" "}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: Number(record.extraFields.status) === 1 ? "green" : "red",
                                            marginLeft: 4,
                                        }}
                                    />
                                </Typography>
                            )}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            <CsvExportForm></CsvExportForm>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Device ID</strong></TableCell>
                            <TableCell><strong>Received At</strong></TableCell>
                            <TableCell><strong>Temperature (°C)</strong></TableCell>
                            <TableCell><strong>Humidity (%)</strong></TableCell>
                            <TableCell><strong>Latitude</strong></TableCell>
                            <TableCell><strong>Longitude</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>More Info</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {latestPerDevice
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                                <TableRow key={record.id} hover>
                                    <TableCell>{record.deviceId}</TableCell>
                                    <TableCell>{new Date(record.receivedAt).toLocaleString()}</TableCell>
                                    <TableCell>{record.temperature ?? "-"}</TableCell>
                                    <TableCell>{record.humidity ?? "-"}</TableCell>
                                    <TableCell>{record.latitude ?? "-"}</TableCell>
                                    <TableCell>{record.longitude ?? "-"}</TableCell>
                                    <TableCell>
                    <span
                        style={{
                            display: "inline-block",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: getStatusColor(record.extraFields?.status),
                        }}
                    />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => setSelectedRecord(record)}
                                            sx={{
                                                textTransform: "none",
                                                borderColor: "#512da8",
                                                color: "#512da8",
                                                fontWeight: "bold",
                                                "&:hover": { backgroundColor: "#ede7f6" },
                                            }}
                                        >
                                            More
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={latestPerDevice.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Sensor Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRecord && (
                        <>
                            <Typography variant="body1">
                                Device ID: <strong>{selectedRecord.deviceId}</strong>
                            </Typography>
                            <Typography variant="body1">
                                Received At: <strong>{new Date(selectedRecord.receivedAt).toLocaleString()}</strong>
                            </Typography>
                            <Typography variant="body1">
                                Temperature: <strong>{selectedRecord.temperature ?? "-"}</strong> °C
                            </Typography>
                            <Typography variant="body1">
                                Humidity: <strong>{selectedRecord.humidity ?? "-"}</strong> %
                            </Typography>
                            <Typography variant="body1">
                                Latitude: <strong>{selectedRecord.latitude ?? "-"}</strong>
                            </Typography>
                            <Typography variant="body1">
                                Longitude: <strong>{selectedRecord.longitude ?? "-"}</strong>
                            </Typography>

                            {selectedRecord.extraFields &&
                                Object.entries(selectedRecord.extraFields).map(([key, value]) => (
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
                    <Button onClick={() => setSelectedRecord(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TtnSensorPage;
