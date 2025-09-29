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
    Tooltip,
    IconButton
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Footer from "./Footer";

const HomePage = () => {
    const [brokerUrl, setBrokerUrl] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [instructionOpen, setInstructionOpen] = useState(false);

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
                <Tooltip title="Click to see connection instructions">
                    <IconButton
                        onClick={() => setInstructionOpen(true)}
                        sx={{ ml: 35, color: "#D3A1FF" }}
                    >
                        <InfoOutlinedIcon />
                    </IconButton>
                </Tooltip>
                    <TextField
                        fullWidth
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
            <Dialog open={instructionOpen} onClose={() => setInstructionOpen(false)}>
                <DialogTitle>Connection Instructions</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" gutterBottom>
                        1. Enter your MQTT broker URL (e.g., <b>tcp://localhost:1883</b>)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        2. Provide username and password if authentication is required.
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        3. Click <b>Connect</b> to establish a connection.
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 3, color: "#7B2CBF" }}>
                        Mosquitto Configuration Examples
                    </Typography>

                    {/* --- No authentication example --- */}
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                        ➤ Without Username & Password:
                    </Typography>
                    <Typography
                        component="pre"
                        sx={{
                            bgcolor: "#F5F5F5",
                            p: 2,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        }}
                    >
                        {`# mosquitto.conf
listener 1883
allow_anonymous true`}
                    </Typography>

                    {/* --- With username/password example --- */}
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
                        ➤ With Username & Password:
                    </Typography>
                    <Typography
                        component="pre"
                        sx={{
                            bgcolor: "#F5F5F5",
                            p: 2,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        }}
                    >
                        {`# mosquitto.conf
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd`}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        To create the password file:
                    </Typography>
                    <Typography
                        component="pre"
                        sx={{
                            bgcolor: "#F5F5F5",
                            p: 2,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                        }}
                    >
                        {`sudo mosquitto_passwd -c /etc/mosquitto/passwd myuser
# Enter your desired password
sudo systemctl restart mosquitto`}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Replace <b>myuser</b> with your desired username.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setInstructionOpen(false)}
                        sx={{
                            backgroundColor: "#D3A1FF",
                            color: "text.secondary",
                            "&:hover": { backgroundColor: "#c089f2" },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


            <Footer />
        </div>
    );
};

export default HomePage;
