// @ts-nocheck
import React, {useState, useEffect} from "react";
import {useQueryClient} from "react-query";
import axios from "axios";
import {
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import {MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import CsvExportForm from "../components/CsvForm";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import TtnConnectionForm from "../components/TtnConnectionForm";
import TtnSensorTable from "../components/TtnSensorTable";
import SensorDetailsDialog from "../components/SensorDetailsDialog";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import DeleteSuccessDialog from "../components/DeleteSuccessDialog";
import DeleteErrorDialog from "../components/DeleteErrorDialog";

import {useTtnConnectionStore} from "../stores/useTtnConnectionStore";
import {useTtnConnect} from "../hooks/useTtnConnect";
import {useDeleteTtnRecord} from "../hooks/useDeleteTtnRecord";
import {useTtnSensors} from "../hooks/useTtnSensors";

delete L.Icon.Default.prototype["_getIconUrl"];
L.Icon.Default.mergeOptions({iconRetinaUrl, iconUrl, shadowUrl});

const RecenterOnPositions = ({positions}) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, {padding: [50, 50], maxZoom: 15});
        } else {
            map.setView([37.9838, 23.7275], 8);
        }
    }, [positions, map]);
    return null;
};

const isOlderThan6Hours = (dateString) => {
    const receivedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - receivedDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 1;
};

const TtnSensorPage = () => {
    const queryClient = useQueryClient();
    const {connected, showForm, setDisconnected, toggleForm} = useTtnConnectionStore();

    const [appId, setAppId] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [region, setRegion] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
    const [deleteErrorDialogOpen, setDeleteErrorDialogOpen] = useState(false);
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

    const connectMutation = useTtnConnect({appId, accessKey, region, setErrorMessage});
    const deleteMutation = useDeleteTtnRecord({
        setDeleteDialogOpen,
        setRecordToDelete,
        setDeleteSuccessDialogOpen,
        setDeleteErrorDialogOpen,
    });

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

    const {data, isLoading} = useTtnSensors(connected);

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
            <div style={{display: "flex", justifyContent: "center", marginTop: 40}}>
                <CircularProgress color="secondary"/>
            </div>
        );
    }

    if (showForm) {
        return (
            <TtnConnectionForm
                appId={appId}
                accessKey={accessKey}
                region={region}
                errorMessage={errorMessage}
                isLoading={connectMutation.isLoading}
                onChangeAppId={setAppId}
                onChangeAccessKey={setAccessKey}
                onChangeRegion={setRegion}
                onConnect={() => connectMutation.mutate()}
                onCloseError={() => setErrorMessage("")}
            />
        );
    }

    return (
        <div
            style={{
                padding: "20px",
                minHeight: "100vh",
                backgroundColor: "#f4f3f8",
            }}
        >
            <div style={{textAlign: "center", marginBottom: "15px"}}>
                {/*<Button*/}
                {/*    variant="outlined"*/}
                {/*    onClick={() => toggleForm(true)}*/}
                {/*    sx={{*/}
                {/*        mr: 2,*/}
                {/*        borderColor: "#512da8",*/}
                {/*        color: "#512da8",*/}
                {/*        fontWeight: "bold",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Connect TTN App*/}
                {/*</Button>*/}
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDisconnect}
                    sx={{
                        borderColor: "#c62828",
                        color: "#c62828",
                        fontWeight: "bold",
                        "&:hover": {
                            borderColor: "#8e0000",
                            backgroundColor: "rgba(198, 40, 40, 0.04)",
                        },
                    }}
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
                <RecenterOnPositions positions={positions}/>
                {validCoords.map((record) => (
                    <Marker
                        key={record.id}
                        position={[record.latitude, record.longitude]}
                        icon={purpleIcon}
                    >
                        <Popup>
                            <Typography variant="subtitle1" sx={{fontWeight: "bold"}}>
                                {record.deviceId}
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{
                                    color: isOlderThan6Hours(record.receivedAt) ? "red" : "inherit",
                                    fontWeight: isOlderThan6Hours(record.receivedAt)
                                        ? "bold"
                                        : "normal",
                                }}
                            >
                                Received At: {new Date(record.receivedAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                Value One: {record.valueOne ?? "-"}
                            </Typography>
                            <Typography variant="body2">
                                Value Two: {record.valueTwo ?? "-"}
                            </Typography>
                            <Typography variant="body2">
                                Value Three: {record.valueThree ?? "-"}
                            </Typography>
                            <Typography variant="body2">
                                Latitude: {record.latitude ?? "-"}
                            </Typography>
                            <Typography variant="body2">
                                Longitude: {record.longitude ?? "-"}
                            </Typography>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
                <CsvExportForm />

                <TtnSensorTable
                data={latestPerDevice}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        setPage={setPage}
                        setRowsPerPage={setRowsPerPage}
                        setSelectedRecord={setSelectedRecord}
                        setRecordToDelete={setRecordToDelete}
                        setDeleteDialogOpen={setDeleteDialogOpen}
                        isOlderThan6Hours={isOlderThan6Hours}
            />

            {/* Dialogs */}
            <SensorDetailsDialog
                open={!!selectedRecord}
                record={selectedRecord}
                onClose={() => setSelectedRecord(null)}
            />

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                record={recordToDelete}
                onCancel={() => setDeleteDialogOpen(false)}
                onConfirm={() => {
                    console.log("Deleting deviceId:", recordToDelete?.deviceId);
                    deleteMutation.mutate(recordToDelete?.deviceId);
                }}
                isDeleting={deleteMutation.isLoading}
            />

            <DeleteSuccessDialog
                open={deleteSuccessDialogOpen}
                onClose={() => setDeleteSuccessDialogOpen(false)}
            />

            <DeleteErrorDialog
                open={deleteErrorDialogOpen}
                onClose={() => setDeleteErrorDialogOpen(false)}
            />
        </div>
    );
};

export default TtnSensorPage;
