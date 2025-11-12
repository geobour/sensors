import React from "react";
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

interface TtnConnectionFormProps {
    appId: string;
    accessKey: string;
    region: string;
    errorMessage: string;
    isLoading: boolean;
    onChangeAppId: (v: string) => void;
    onChangeAccessKey: (v: string) => void;
    onChangeRegion: (v: string) => void;
    onConnect: () => void;
    onCloseError: () => void;
}

const TtnConnectionForm: React.FC<TtnConnectionFormProps> = ({
                                                                 appId,
                                                                 accessKey,
                                                                 region,
                                                                 errorMessage,
                                                                 isLoading,
                                                                 onChangeAppId,
                                                                 onChangeAccessKey,
                                                                 onChangeRegion,
                                                                 onConnect,
                                                                 onCloseError,
                                                             }) => {
    const inputSx = {
        backgroundColor: "rgba(129, 90, 210, 0.2)", // soft purple
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#512da8" },
            "&:hover fieldset": { borderColor: "#7e57c2" },
            "&.Mui-focused": {
                borderColor: "#512da8",
                backgroundColor: "rgba(129, 90, 210, 0.35)", // darker on focus
            },
        },
        "& label.Mui-focused": { color: "#512da8" },
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                background: "#7e57c2",
                paddingTop: "6rem",
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: "rgba(255,255,255,0.9)",
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
                    Connect to TTN
                </Typography>

                <TextField
                    label="App ID"
                    value={appId}
                    onChange={(e) => onChangeAppId(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={inputSx}
                />
                <TextField
                    label="Access Key"
                    value={accessKey}
                    onChange={(e) => onChangeAccessKey(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={inputSx}
                />
                <TextField
                    label="Region"
                    value={region}
                    onChange={(e) => onChangeRegion(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={inputSx}
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 2,
                        backgroundColor: "#512da8",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#7e57c2" },
                    }}
                    onClick={onConnect}
                    disabled={isLoading || !appId || !accessKey || !region}
                >
                    {isLoading ? "Connecting..." : "Connect"}
                </Button>

                <Dialog open={!!errorMessage} onClose={onCloseError} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ color: "red" }}>Connection Error</DialogTitle>
                    <DialogContent dividers>
                        {/*<Typography sx={{ color: "red" }}>*/}
                        {/*    {typeof errorMessage === "string"*/}
                        {/*        ? errorMessage*/}
                        {/*        : JSON.stringify(errorMessage, null, 2)}*/}
                        {/*</Typography>*/}
                        <Typography sx={{ color: "red" }}>
                            ❌ Connection failed. Please check the App ID, Access Key, or Region.
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

export default TtnConnectionForm;
