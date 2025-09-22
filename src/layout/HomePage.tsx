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
} from "@mui/material";
import Footer from "./Footer";

const HomePage = () => {
    const [brokerUrl, setBrokerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleConnect = () => {
        if (!brokerUrl) return;

        console.log("Connecting to broker:", brokerUrl);
        console.log("Username:", username);
        console.log("Password:", password);

        fetch(
            `/api/mqtt/connect?brokerUri=${encodeURIComponent(
                brokerUrl
            )}&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            { method: "POST" }
        )
            .then((res) => {
                if (!res.ok) throw new Error("Server error: " + res.status);
                return res.text();
            })
            .then((data) => {
                setIsError(false);
                setDialogMessage(data);
                setDialogOpen(true);
            })
            .catch((err) => {
                setIsError(true);
                setDialogMessage("Failed to connect: " + err.message);
                setDialogOpen(true);
            });
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const inputStyle = {
        backgroundColor: "#D3A1FF",
        borderRadius: 1,
    };

    return (
        <div
            style={{
                height: "100vh",
                background: `url("growtika-S2mxfA7tDEI-unsplash.jpg") center/cover no-repeat`,
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}>
                <TextField
                    label="Broker URL"
                    variant="outlined"
                    size="medium"
                    value={brokerUrl}
                    onChange={(e) => setBrokerUrl(e.target.value)}
                    sx={inputStyle}
                />
                <TextField
                    label="Username (optional)"
                    variant="outlined"
                    size="medium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={inputStyle}
                />
                <TextField
                    label="Password (optional)"
                    type="password"
                    variant="outlined"
                    size="medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={inputStyle}
                />
                <Button
                    variant="contained"
                    sx={{
                        mt: 4,
                        backgroundColor: "#D3A1FF",
                        color: "text.secondary",
                        "&:hover": {
                            backgroundColor: "#c089f2",
                        },
                    }}
                    onClick={handleConnect}
                >
                    Connect
                </Button>

            </Box>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <DialogTitle>Connection Status</DialogTitle>
                <DialogContent>
                    <Typography color={isError ? "error" : "textPrimary"}>
                        {dialogMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        sx={{
                            backgroundColor: "#D3A1FF",
                            color: "text.secondary",
                            "&:hover": { backgroundColor: "#c089f2" },
                        }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </div>
    );
};

export default HomePage;
