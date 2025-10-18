import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Input, InputAdornment, Box, Tooltip, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestoreIcon from '@mui/icons-material/Restore';
import { SensorDto } from '../api/ApiSensor';
import { useDeleteSensor, useRestoreSensor, useSensors } from "../hooks/useSensor";

const SensorsListView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sensorToDelete, setSensorToDelete] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);

    const navigate = useNavigate();
    const { data: sensorList = [], isLoading, isError } = useSensors();
    const deleteSensor = useDeleteSensor();
    const restoreSensor = useRestoreSensor();

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, sensorId: number) => {
        e.stopPropagation();
        setSensorToDelete(sensorId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (sensorToDelete !== null) {
            deleteSensor.mutate(sensorToDelete, {
                onSuccess: () => {
                    setModalMessage('Sensor deleted successfully!');
                    setModalSuccess(true);
                    setModalOpen(true);
                },
                onError: () => {
                    setModalMessage('Error deleting sensor.');
                    setModalSuccess(false);
                    setModalOpen(true);
                }
            });
        }
        setDeleteDialogOpen(false);
        setSensorToDelete(null);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSensorToDelete(null);
    };

    const handleRestoreClick = (e: React.MouseEvent<HTMLButtonElement>, sensor: SensorDto) => {
        e.stopPropagation();
        restoreSensor.mutate(sensor);
    };

    const filteredSensors = sensorList.filter(sensor =>
        sensor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <Typography color="text.secondary">Loading sensors...</Typography>;
    if (isError) return <Typography color="text.secondary">Error loading sensors</Typography>;

    return (
        <Box sx={{ minHeight: '100vh', padding: 2, bgcolor: 'white' }}>
            <Container sx={{ bgcolor: 'white', py: 2 }}>
                <Paper elevation={3} sx={{ mt: 4, padding: '10px', bgcolor: 'white' }}>
                    <Typography variant="h4" align="center" fontWeight="bold" color="text.secondary">
                        Sensors List
                    </Typography>
                </Paper>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        mb: 2,
                        bgcolor: 'white',
                    }}
                >
                    <Input
                        placeholder="Search by ID"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ color: 'text.secondary' }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('add')}
                        sx={{
                            backgroundColor: '#512da8',
                            color: 'white',
                            '&:hover': { backgroundColor: '#c089f2' },
                            fontWeight: 'bold',
                        }}
                    >
                        Add Sensor
                    </Button>
                </Box>

                <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{ maxHeight: '500px', bgcolor: 'white' }}
                >
                    <Table sx={{ minWidth: 650 }} aria-label="sensor table">
                        <TableHead sx={{ bgcolor: 'white' }}>
                            <TableRow>
                                {['Sensor ID','Sensor Name','Sensor Area','Topic','Type','Status','Actions'].map(col => (
                                    <TableCell
                                        key={col}
                                        sx={{ fontWeight: 'bold', color: 'text.secondary', bgcolor: 'white' }}
                                    >
                                        <Typography variant="h6" color="text.secondary">{col}</Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredSensors.map((sensor) => (
                                <TableRow
                                    key={sensor.id}
                                    hover
                                    onClick={() => navigate(`${sensor.id}`)}
                                    sx={{ cursor: 'pointer', bgcolor: 'white' }}
                                >
                                    <TableCell sx={{ color: 'text.secondary' }}>{sensor.id}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Tooltip title={sensor.name} arrow>
                                            <span>{sensor.name}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Tooltip title={sensor.area} arrow>
                                            <span>{sensor.area}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        <Tooltip title={sensor.topic} arrow>
                                            <span>{sensor.topic}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{sensor.type}</TableCell>

                                    {/* Status indicator with tooltip */}
                                    <TableCell align="center">
                                        <Tooltip title={sensor?.status ? "Active" : "Inactive"} arrow>
                                            <Box
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    bgcolor: sensor?.status ? 'green' : 'red',
                                                    margin: '0 auto',
                                                }}
                                            />
                                        </Tooltip>
                                    </TableCell>

                                    <TableCell>
                                        {/* Edit Button with Tooltip */}
                                        <Tooltip title="Edit Sensor" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); navigate(`${sensor.id}/edit`) }}
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: '#512da8',
                                                    color: 'white',
                                                    minWidth: '40px',
                                                    padding: '6px',
                                                    '&:hover': { backgroundColor: '#c089f2' },
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>

                                        {/* Delete Button with Tooltip */}
                                        <Tooltip title="Delete Sensor" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => handleDeleteClick(e, sensor.id)}
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: '#512da8',
                                                    color: 'white',
                                                    minWidth: '40px',
                                                    padding: '6px',
                                                    '&:hover': { backgroundColor: '#c089f2' },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Tooltip>

                                        {/* Restore Button with Tooltip */}
                                        <Tooltip title="Restore Sensor Status" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => handleRestoreClick(e, sensor)}
                                                sx={{
                                                    backgroundColor: '#512da8',
                                                    color: 'white',
                                                    minWidth: '40px',
                                                    padding: '6px',
                                                    '&:hover': { backgroundColor: '#c089f2' },
                                                }}
                                            >
                                                <RestoreIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>

            {/* Delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle sx={{ color: 'text.secondary', bgcolor: 'white' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent sx={{ color: 'text.secondary', bgcolor: 'white' }}>
                    Are you sure you want to delete this sensor?
                </DialogContent>
                <DialogActions sx={{ bgcolor: 'white' }}>
                    <Button
                        onClick={cancelDelete}
                        sx={{
                            backgroundColor: '#512da8',
                            color: 'white',
                            '&:hover': { backgroundColor: '#c089f2' },
                        }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={confirmDelete}
                        sx={{
                            backgroundColor: '#512da8',
                            color: 'white',
                            '&:hover': { backgroundColor: '#c089f2' },
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error modal after delete */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle sx={{ color: modalSuccess ? 'green' : 'red', bgcolor: 'white' }}>
                    {modalSuccess ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogContent sx={{ color: modalSuccess ? 'green' : 'red', bgcolor: 'white' }}>
                    {modalMessage}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SensorsListView;
