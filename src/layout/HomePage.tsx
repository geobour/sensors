// @ts-nocheck
import React, { useState } from "react";
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Tabs,
    Tab,
} from "@mui/material";
import Footer from "./Footer";
import { useMqttConnectionStore } from "../stores/useMqttConnectionStore";

const API_BASE = "http://localhost:8080/api/mqtt";

export default function HomePage() {
    const [tab, setTab] = useState(0);
    const [brokerUrl, setBrokerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const { formDisappear, setConnected, setDisconnected } = useMqttConnectionStore();

    const doPost = async (url, data) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(data),
            });

            if (!res.ok) {
                // Always show generic user-friendly connection error
                throw new Error("❌ Connection failed. Please check Broker URL, Username, or Password.");
            }

            const txt = await res.text();
            setIsError(false);
            setDialogMessage(txt);
            setDialogOpen(true);
            setConnected();
        } catch (err) {
            // Regardless of server error, show same friendly message
            setIsError(true);
            setDialogMessage("❌ Connection failed. Please check Broker URL, Username, or Password.");
            setDialogOpen(true);
        }
    };


    const handleConnect = () => {
        if (!brokerUrl) return showError("Broker URL is required.");
        doPost(`${API_BASE}/connect`, { brokerUri: brokerUrl, username, password });
    };

    const handlePublish = () => {
        if (!topic || !message) return showError("Topic and Value required.");
        const numericValue = parseFloat(message);
        if (numericValue > 101) return showError("Value cannot be greater than 101.");
        const fullTopic = `sensors/${topic}`;
        const jsonMsg = JSON.stringify({ value: numericValue });
        doPost(`${API_BASE}/publishHive`, { topic: fullTopic, message: jsonMsg });
    };

    const showError = (msg) => {
        setIsError(true);
        setDialogMessage(msg);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        if (isError) {
            setBrokerUrl("");
            setUsername("");
            setPassword("");
            setTopic("");
            setMessage("");
            setDisconnected();
        } else {
            setBrokerUrl("");
            setUsername("");
            setPassword("");
        }
    };

    // New Disconnect handler to call backend
    const handleDisconnect = async () => {
        try {
            const res = await fetch(`${API_BASE}/disconnect`, { method: "POST" });
            const text = await res.text();
            setDialogMessage(text);
            setDialogOpen(true);
            setIsError(false);
            setDisconnected(); // update store state
            setBrokerUrl("");
            setUsername("");
            setPassword("");
            setTopic("");
            setMessage("");
        } catch (err) {
            setDialogMessage("❌ " + err.message);
            setDialogOpen(true);
            setIsError(true);
        }
    };

    const inputStyle = { backgroundColor: "#D3A1FF", borderRadius: 1 };

    return (
        <div
            style={{
                height: "100vh",
                background: `url("growtika-S2mxfA7tDEI-unsplash.jpg") center/cover no-repeat`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: "rgba(255,255,255,0.8)",
                    borderRadius: 2,
                    p: 2,
                    mt: 15,
                }}
            >
                <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
                    <Tab label="MQTT Connect" />
                    <Tab label="Test Publish" />
                </Tabs>
                {tab === 0 && (
                    <>
                        {!formDisappear ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                                <TextField
                                    label="Broker URL"
                                    placeholder="ssl://broker:8883"
                                    value={brokerUrl}
                                    onChange={(e) => setBrokerUrl(e.target.value)}
                                    sx={inputStyle}
                                />
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={inputStyle}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={inputStyle}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: "#512da8",
                                        color: "white",
                                        fontWeight: "bold",
                                        "&:hover": {
                                            backgroundColor: "#7e57c2",
                                        },
                                    }}
                                    onClick={handleConnect}
                                >
                                    Connect
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: "center", mt: 3 }}>
                                <Typography variant="h6" color="primary">
                                    ✅ Connected to Broker
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 2 }}
                                    onClick={handleDisconnect} // updated to call backend
                                >
                                    Disconnect
                                </Button>
                            </Box>
                        )}
                    </>
                )}
                {tab === 1 && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <TextField
                            label="Topic"
                            placeholder="e.g. topic2"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            sx={inputStyle}
                        />
                        <TextField
                            label="Value"
                            placeholder="e.g. 12 or 23.5"
                            type="number"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            inputProps={{ min: -50, max: 101, step: "any" }}
                            sx={inputStyle}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                mt: 2,
                                backgroundColor: "#512da8",
                                color: "white",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "#7e57c2",
                                },
                            }}
                            onClick={handlePublish}
                        >
                            Publish
                        </Button>
                    </Box>
                )}
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: isError ? "red" : "#512da8" }}>
                    {isError ? "Error" : "Success"}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography
                        sx={{
                            color: isError ? "red" : "#512da8",
                            whiteSpace: "pre-wrap",
                            fontFamily: "monospace",
                        }}
                    >
                        {typeof dialogMessage === "string"
                            ? dialogMessage
                            : JSON.stringify(dialogMessage, null, 2)}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        sx={{
                            backgroundColor: "#512da8",
                            color: "#fff",
                            fontWeight: "bold",
                            ":hover": { backgroundColor: "#7e57c2" },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>


            <Footer />
        </div>
    );
}
