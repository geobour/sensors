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

const API_BASE = "http://localhost:8080/api/mqtt"; // ✅ always points to backend

export default function HomePage() {
    const [tab, setTab] = useState(0);

    // MQTT form fields
    const [brokerUrl, setBrokerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Publish form fields
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");

    // Dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Zustand store
    const { connected, formDisappear, setConnected, setDisconnected } = useMqttConnectionStore();

    const doPost = async (url, data) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(data),
            });
            if (!res.ok) throw new Error(await res.text());
            const txt = await res.text();
            setIsError(false);
            setDialogMessage(txt);
            setDialogOpen(true);
            setConnected(); // ✅ mark connected after success
        } catch (err) {
            setIsError(true);
            setDialogMessage("❌ " + err.message);
            setDialogOpen(true);
        }
    };

    const handleConnect = () => {
        if (!brokerUrl) return showError("Broker URL is required.");
        // ✅ use absolute URL
        doPost(`${API_BASE}/connect`, { brokerUri: brokerUrl, username, password });
    };

    const handlePublish = () => {
        if (!topic || !message) return showError("Topic and Value required.");

        const numericValue = parseFloat(message);
        if (numericValue > 101) return showError("Value cannot be greater than 101.");

        const fullTopic = `sensors/${topic}`;
        const jsonMsg = JSON.stringify({ value: numericValue });

        // ✅ use absolute URL
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

                {/* MQTT CONNECT */}
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
                                <Button variant="contained" sx={{ mt: 2 }} onClick={handleConnect}>
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
                                    onClick={setDisconnected}
                                >
                                    Disconnect
                                </Button>
                            </Box>
                        )}
                    </>
                )}

                {/* PUBLISH */}
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
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handlePublish}>
                            Publish
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Dialog for feedback */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isError ? "Error" : "Success"}</DialogTitle>
                <DialogContent>
                    <Typography color={isError ? "error" : "primary"}>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>OK</Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </div>
    );
}
