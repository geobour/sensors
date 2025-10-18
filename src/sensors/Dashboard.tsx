import React, {useState} from 'react';
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
    DialogActions
} from '@mui/material';
import {useDashboardData} from '../hooks/useDashboardData';
import MapBoxMany from "../map/MapBoxMany";

const getStatusColor = (status: any) => status ? 'green' : 'red';

const ChartGrid: React.FC = React.memo(() => {
    const {sensorsQuery, valuesQuery} = useDashboardData();
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    if (sensorsQuery.isLoading || valuesQuery.isLoading) return <div>Loading...</div>;
    if (sensorsQuery.isError || valuesQuery.isError) return <div>Error loading data</div>;

    const values = valuesQuery.data!;

    // @ts-ignore
    return (
        <div style={{backgroundColor: "whitesmoke", minHeight: '100vh', padding: '20px'}}>
            <MapBoxMany/>
            <TableContainer component={Paper} sx={{borderRadius: 2, boxShadow: 2, marginTop: 3}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Device Name</strong></TableCell>
                            <TableCell><strong>Type</strong></TableCell>
                            <TableCell><strong>Current Value</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Latitude</strong></TableCell>
                            <TableCell><strong>Longitude</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {values.map((record: any, index: number) => (
                            <TableRow key={index} hover>
                                <TableCell>{record.name}</TableCell>
                                <TableCell>{record.type}</TableCell>
                                <TableCell>
                                    {record.type === 'temperature' && `${record.currentValue}°C`}
                                    {record.type === 'humidity' && `${parseFloat(String(record.currentValue)).toFixed(1)}%`}
                                    {record.type !== 'temperature' && record.type !== 'humidity' && record.currentValue}
                                </TableCell>
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
                                <TableCell>{record.latitude ?? "-"}</TableCell>
                                <TableCell>{record.longitude ?? "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!selectedRecord} onClose={() => setSelectedRecord(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Sensor Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRecord && (
                        <>
                            <Typography variant="body1">Name: <strong>{selectedRecord.name}</strong></Typography>
                            <Typography variant="body1">Type: <strong>{selectedRecord.type}</strong></Typography>
                            <Typography variant="body1">Current
                                Value: <strong>{selectedRecord.currentValue}</strong></Typography>
                            <Typography variant="body1">
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

                            {selectedRecord.extraFields && Object.keys(selectedRecord.extraFields).length > 0 && (
                                <>
                                    {Object.entries(selectedRecord.extraFields).map(([key, value]) => (
                                        <Typography key={key} variant="body1">
                                            {key}:{" "}
                                            {key.toLowerCase() === "status" ? (
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: "50%",
                                                        backgroundColor: Number(value) === 1 ? "green" : "red",
                                                    }}
                                                />
                                            ) : (
                                                <strong>{String(value)}</strong>
                                            )}
                                        </Typography>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedRecord(null)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default ChartGrid;
