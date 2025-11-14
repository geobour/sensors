import React, { useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

interface MqttConnectionFormProps {
    brokerUrl: string;
    username: string;
    password: string;
    isLoading: boolean;
    errorMessage: string;
    onChangeBrokerUrl: (v: string) => void;
    onChangeUsername: (v: string) => void;
    onChangePassword: (v: string) => void;
    onConnect: () => void;
    onCloseError: () => void;
}

const MqttConnectionForm: React.FC<MqttConnectionFormProps> = ({
                                                                   brokerUrl,
                                                                   username,
                                                                   password,
                                                                   isLoading,
                                                                   errorMessage,
                                                                   onChangeBrokerUrl,
                                                                   onChangeUsername,
                                                                   onChangePassword,
                                                                   onConnect,
                                                                   onCloseError,
                                                               }) => {
    const inputSx = {
        backgroundColor: "rgba(129, 90, 210, 0.2)",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#512da8" },
            "&:hover fieldset": { borderColor: "#7e57c2" },
            "&.Mui-focused": {
                borderColor: "#512da8",
                backgroundColor: "rgba(129, 90, 210, 0.35)",
            },
            "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 1000px rgba(129, 90, 210, 0.2) inset",
                WebkitTextFillColor: "#000",
            },
        },
        "& label.Mui-focused": { color: "#512da8" },
    };

    useEffect(() => {
        if (!isLoading && !errorMessage) {
            onChangeBrokerUrl("");
            onChangeUsername("");
            onChangePassword("");
        }
    }, [isLoading, errorMessage, onChangeBrokerUrl, onChangeUsername, onChangePassword]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                backgroundColor: "rgba(129, 90, 210, 0.2)",
                paddingTop: "6rem",
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: "rgba(255,255,255,0.95)",
                    borderRadius: 2,
                    p: 3,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h5"
                    align="center"
                    sx={{ color: "#512da8", mb: 2, fontWeight: "bold" }}
                >
                    Connect to MQTT Broker
                </Typography>

                <TextField
                    label="Broker URL"
                    value={brokerUrl}
                    onChange={(e) => onChangeBrokerUrl(e.target.value)}
                    sx={inputSx}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => onChangeUsername(e.target.value)}
                    sx={inputSx}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => onChangePassword(e.target.value)}
                    sx={inputSx}
                    fullWidth
                    margin="normal"
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: brokerUrl ? "#512da8" : "gray",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: brokerUrl ? "#7e57c2" : "gray" },
                    }}
                    onClick={onConnect}
                    disabled={!brokerUrl || isLoading}
                >
                    {isLoading ? "Connecting..." : "Connect"}
                </Button>

                <Dialog open={!!errorMessage} onClose={onCloseError} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: "red" }}>Connection Error</DialogTitle>
                    <DialogContent dividers>
                        <Typography sx={{ color: "red" }}>
                            ❌ Connection failed. Please check the Broker URL, Username, or Password.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={onCloseError}
                            sx={{
                                borderColor: "#512da8",
                                color: "#512da8",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "rgba(81,45,168,0.1)" },
                            }}
                            variant="outlined"
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default MqttConnectionForm;
