import React, { useState } from "react";
import {
    Typography,
    Button,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import MapBoxMany from "../map/MapBoxMany";
import { useDashboardData } from "../hooks/useDashboardData";
import { useMqttConnectionStore } from "../stores/useMqttConnectionStore";
import MqttConnectionForm from "../components/MqttConnectionForm";
import { useMqttConnect } from "../hooks/useMqttConnect";

const getStatusColor = (status: boolean) => (status ? "green" : "red");
const formatTime = (time: string | null) => (time ? new Date(time).toLocaleString() : "-");
const truncateText = (text: unknown, maxLength = 25) =>
    text == null
        ? "-"
        : String(text).length > maxLength
            ? String(text).substring(0, maxLength) + "..."
            : String(text);

const Dashboard: React.FC = () => {
    const [brokerUrl, setBrokerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [connectionFailed, setConnectionFailed] = useState(false);

    const { connected, setConnected, setDisconnected } = useMqttConnectionStore();

    const showFeedback = (msg: string, error = false) => {
        setDialogMessage(msg);
        setIsError(error);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogMessage("");
        setIsError(false);
    };

    // ===== MQTT Connect Hook =====
    const { connect, disconnect, isConnecting, isDisconnecting } = useMqttConnect({
        brokerUrl,
        username,
        password,
        setErrorMessage: (msg: string) => {
            showFeedback(msg, true);
            setConnectionFailed(true);
            setDisconnected();
        },
    });

    const handleConnect = async () => {
        try {
            const success = await connect(); // returns boolean
            if (success) {
                setConnected();
                setConnectionFailed(false);
                showFeedback("✅ Connected successfully");
            } else {
                setDisconnected();
                setConnectionFailed(true);
                showFeedback("❌ Failed to connect", true);
            }
        } catch (err: any) {
            setDisconnected();
            setConnectionFailed(true);
            showFeedback(err?.message || "❌ Failed to connect", true);
        }
    };

    const handleDisconnect = async () => {
        try {
            const success = await disconnect();
            if (success) {
                setDisconnected();
                showFeedback("✅ Disconnected");
            } else {
                setDisconnected();
                showFeedback("⚠️ Could not disconnect cleanly", true);
            }
        } catch (err: any) {
            setDisconnected();
            showFeedback(err?.message || "⚠️ Error during disconnect", true);
        }
    };

    // ===== Dashboard Data =====
    const { data: pagedData, isLoading, isError: isDataError, publishMutation } =
        useDashboardData(page, rowsPerPage);
    const values = pagedData?.content ?? [];


    // ===== Publish Handling =====
    const handlePublish = () => {
        if (!topic || !message) {
            showFeedback("Please fill in both Topic and Value", true);
            return;
        }

        publishMutation.mutate(
            { topic, value: parseFloat(message) },
            {
                onSuccess: () => {
                    showFeedback("✅ Message published successfully");
                    setTopic("");
                    setMessage("");
                    setPublishDialogOpen(false);
                },
                onError: (err: any) => {
                    showFeedback(
                        err?.message || "❌ Failed to publish message. Check connection.",
                        true
                    );
                },
            }
        );
    };

    const handleCancelPublish = () => {
        setTopic("");
        setMessage("");
        setPublishDialogOpen(false);
    };

    // ===== Show form if not connected or connection failed =====
    if (!connected || connectionFailed) {
        return (
            <MqttConnectionForm
                brokerUrl={brokerUrl}
                username={username}
                password={password}
                isLoading={isConnecting}
                errorMessage={isError ? dialogMessage : ""}
                onChangeBrokerUrl={setBrokerUrl}
                onChangeUsername={setUsername}
                onChangePassword={setPassword}
                onConnect={handleConnect}
                onCloseError={handleDialogClose}
            />
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (isDataError) return <Typography>Error loading data</Typography>;

    return (
        <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", p: 2 }}>
            {/* Top Controls */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                <Button
                    variant="outlined"
                    sx={{
                        color: "#6a1b9a",
                        borderColor: "#6a1b9a",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#f3e5f5" },
                    }}
                    onClick={() => setPublishDialogOpen(true)}
                >
                    Test Publish
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        color: "#c62828",
                        borderColor: "#c62828",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#ffebee" },
                    }}
                    onClick={handleDisconnect}
                    disabled={isDisconnecting}
                >
                    {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </Button>
            </Box>

            {/* Publish Dialog */}
            <Dialog
                open={publishDialogOpen}
                onClose={handleCancelPublish}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        minHeight: 300,
                        maxHeight: 500,
                    }
                }}            >
                <DialogTitle sx={{ color: "#6a1b9a", fontWeight: "bold" }}>
                    Publish Message
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        fullWidth
                        sx={{
                            mb: 2,
                            mt: 2,
                            "& label.Mui-focused": { color: "#6a1b9a" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#6a1b9a" },
                                "&:hover fieldset": { borderColor: "#4a148c" },
                                "&.Mui-focused fieldset": { borderColor: "#6a1b9a" },
                            },
                        }}
                    />
                    <TextField
                        label="Value"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        sx={{
                            "& label.Mui-focused": { color: "#6a1b9a" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#6a1b9a" },
                                "&:hover fieldset": { borderColor: "#4a148c" },
                                "&.Mui-focused fieldset": { borderColor: "#6a1b9a" },
                            },
                        }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "#6a1b9a",
                                borderColor: "#6a1b9a",
                                "&:hover": { backgroundColor: "#f3e5f5" },
                            }}
                            onClick={handleCancelPublish}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#6a1b9a",
                                "&:hover": { backgroundColor: "#4a148c" },
                            }}
                            onClick={handlePublish}
                        >
                            {publishMutation.isLoading ? "Publishing..." : "Publish"}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Map */}
            <MapBoxMany />

            {/* Dashboard Table */}
            <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#ede7f6" }}>
                            <TableCell><strong>Device Name</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Current Value</strong></TableCell>
                            <TableCell><strong>Last Received At</strong></TableCell>
                            <TableCell><strong>Latitude</strong></TableCell>
                            <TableCell><strong>Longitude</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map((record, idx) => (
                            <TableRow key={idx} hover>
                                <TableCell>{truncateText(record.name)}</TableCell>
                                <TableCell>{truncateText(record.type)}</TableCell>
                                <TableCell>
                                    {record.type === "temperature"
                                        ? `${record.currentValue}°C`
                                        : record.type === "humidity"
                                            ? `${parseFloat(String(record.currentValue)).toFixed(1)}%`
                                            : truncateText(record.currentValue)}
                                </TableCell>
                                <TableCell>{formatTime(record.currentTime)}</TableCell>
                                <TableCell>{truncateText(record.latitude)}</TableCell>
                                <TableCell>{truncateText(record.longitude)}</TableCell>
                                <TableCell>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            backgroundColor: getStatusColor(record.status),
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={pagedData?.totalElements ?? 0}
                    page={page}
                    onPageChange={(_e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            {/* Feedback Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ color: isError ? "red" : "#6a1b9a", fontWeight: "bold" }}>
                    {isError ? "Error" : "Success"}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: isError ? "red" : "#6a1b9a" }}>
                        {dialogMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        sx={{
                            color: "#6a1b9a",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#f3e5f5" },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
