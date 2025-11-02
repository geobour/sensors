import React, { useState } from "react";
import {
    Typography,
    Button,
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
    Box,
    TablePagination,
} from "@mui/material";
import { useDashboardData } from "../hooks/useDashboardData";
import { DashboardDto } from "../api/ApiSensor";
import MapBoxMany from "../map/MapBoxMany";


const getStatusColor = (status: boolean) => (status ? "lightgreen" : "red");
const formatTime = (time: string | null) => {
    if (!time) return "-";
    const date = new Date(time);
    return date.toLocaleString();
};

const truncateText = (text: any, maxLength = 12) => {
    if (text == null) return "-";
    const str = String(text);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

const Dashboard: React.FC = () => {
    const [selectedRecord, setSelectedRecord] = useState<DashboardDto | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const { data: pagedData, isLoading, isError } = useDashboardData(page, rowsPerPage);

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error loading data</Typography>;

    const values = pagedData?.content ?? [];

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ backgroundColor: "whitesmoke", minHeight: "100vh", padding: 2 }}>
            <MapBoxMany />

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mt: 3 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
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
                        {values.map((record, index) => (
                            <TableRow key={index} hover onClick={() => setSelectedRecord(record)}>
                                <TableCell>{truncateText(record.name)}</TableCell>
                                <TableCell>{truncateText(record.type)}</TableCell>
                                <TableCell>
                                    {record.type === "temperature" && truncateText(`${record.currentValue}°C`)}
                                    {record.type === "humidity" &&
                                        truncateText(`${parseFloat(String(record.currentValue)).toFixed(1)}%`)}
                                    {record.type !== "temperature" &&
                                        record.type !== "humidity" &&
                                        truncateText(record.currentValue)}
                                </TableCell>
                                <TableCell>{truncateText(formatTime(record.currentTime))}</TableCell>
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
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </TableContainer>

            <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Sensor Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRecord && (
                        <>
                            <Typography>
                                Name: <strong>{selectedRecord.name}</strong>
                            </Typography>
                            <Typography>
                                Type: <strong>{selectedRecord.type}</strong>
                            </Typography>
                            <Typography>
                                Current Value: <strong>{selectedRecord.currentValue}</strong>
                            </Typography>
                            <Typography>
                                Time: <strong>{formatTime(selectedRecord.currentTime)}</strong>
                            </Typography>
                            <Typography>
                                Latitude: <strong>{selectedRecord.latitude ?? "-"}</strong>
                            </Typography>
                            <Typography>
                                Longitude: <strong>{selectedRecord.longitude ?? "-"}</strong>
                            </Typography>
                            <Typography>
                                Status:{" "}
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor: getStatusColor(selectedRecord.status),
                                    }}
                                />
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedRecord(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
