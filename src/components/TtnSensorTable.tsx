// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Button,
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useHeaders } from "../hooks/useHeaders";

interface TtnSensorTableProps {
    data: any[];
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;
    setSelectedRecord: (record: any) => void;
    setRecordToDelete: (record: any) => void;
    setDeleteDialogOpen: (open: boolean) => void;
    isOlderThan6Hours: (dateString: string) => boolean;
}

const TtnSensorTable: React.FC<TtnSensorTableProps> = ({
                                                           data,
                                                           page,
                                                           rowsPerPage,
                                                           setPage,
                                                           setRowsPerPage,
                                                           setSelectedRecord,
                                                           setRecordToDelete,
                                                           setDeleteDialogOpen,
                                                           isOlderThan6Hours,
                                                       }) => {
    const { headers, updateHeaders } = useHeaders();
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempHeaders, setTempHeaders] = useState(headers);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (dialogOpen) setTempHeaders(headers);
    }, [dialogOpen, headers]);

    const handleHeaderChange = (field: string, value: string) => {
        setTempHeaders({ ...tempHeaders, [field]: value });
    };

    const handleDialogSave = async () => {
        await updateHeaders(tempHeaders);
        setDialogOpen(false);
        setEditingHeader(false);
    };

    const headerKeys = [...Object.keys(headers)];

    return (
        <>
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#ede7f6" }}>
                            <TableCell><strong>Device ID</strong></TableCell>
                            <TableCell><strong>Received At</strong></TableCell>

                            {["valueOne", "valueTwo", "valueThree"].map((key) => (
                                <TableCell key={key}>
                                    {editingHeader ? (
                                        <TextField
                                            size="small"
                                            value={tempHeaders[key] ?? ""}
                                            onChange={(e) => handleHeaderChange(key, e.target.value)}
                                            sx={{ width: "100%" }}
                                        />
                                    ) : (
                                        <strong>{headers[key]}</strong>
                                    )}
                                </TableCell>
                            ))}

                            <TableCell><strong>Latitude</strong></TableCell>
                            <TableCell><strong>Longitude</strong></TableCell>

                            <TableCell align="center">
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setDialogOpen(true)}
                                        sx={{
                                            textTransform: "none",
                                            borderColor: "#512da8",
                                            color: "#512da8",
                                            fontWeight: "bold",
                                            display: "flex",
                                            alignItems: "center",
                                            "&:hover": { backgroundColor: "#ede7f6" },
                                        }}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit Type Of Values
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                                <TableRow key={record.id} hover>
                                    <TableCell>{record.deviceId}</TableCell>
                                    <TableCell
                                        style={{
                                            color: isOlderThan6Hours(record.receivedAt) ? "red" : "inherit",
                                            fontWeight: isOlderThan6Hours(record.receivedAt) ? "bold" : "normal",
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            {new Date(record.receivedAt).toLocaleString()}
                                            <Tooltip title="If there are no data for over 1 hour, the date turns red." arrow>
                                                <InfoOutlinedIcon sx={{ fontSize: 16, color: "#512da8", cursor: "pointer" }} />
                                            </Tooltip>
                                        </Box>
                                    </TableCell>

                                    <TableCell>{record.valueOne ?? "-"}</TableCell>
                                    <TableCell>{record.valueTwo ?? "-"}</TableCell>
                                    <TableCell>{record.valueThree ?? "-"}</TableCell>

                                    <TableCell>{record.latitude ?? "-"}</TableCell>
                                    <TableCell>{record.longitude ?? "-"}</TableCell>

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
                                                mr: 1,
                                            }}
                                        >
                                            More Info
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            sx={{
                                                textTransform: "none",
                                                borderColor: "#512da8",
                                                color: "#512da8",
                                                fontWeight: "bold",
                                                "&:hover": { backgroundColor: "#ede7f6" },
                                            }}
                                            onClick={() => {
                                                setRecordToDelete(record);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={data.length}
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

            {/* Dialog for Editing Headers */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Edit Header Values</DialogTitle>
                <DialogContent>
                    {headerKeys.map((key) => (
                        <TextField
                            key={key}
                            label={key}
                            value={tempHeaders[key] ?? ""}
                            onChange={(e) => handleHeaderChange(key, e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        sx={{
                            backgroundColor: "#512da8",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: '#9c27b0' },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDialogSave}
                        variant="contained"
                        sx={{
                            backgroundColor: "#512da8",
                            color: "#fff",
                            fontWeight: "bold",
                            "&:hover": {backgroundColor: '#9c27b0' },
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TtnSensorTable;
