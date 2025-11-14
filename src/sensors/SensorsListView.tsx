import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, TextField, InputAdornment, Box, Tooltip, Dialog,
    DialogTitle, DialogContent, DialogActions, TablePagination, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestoreIcon from '@mui/icons-material/Restore';
import { SensorDto } from '../api/ApiSensor';
import { useDeleteSensor, useRestoreSensor, useSensors } from "../hooks/useSensor";

const SensorsListView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sensorToDelete, setSensorToDelete] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const navigate = useNavigate();
    const { data, isLoading, isError } = useSensors(0, 1000);
    const deleteSensor = useDeleteSensor();
    const restoreSensor = useRestoreSensor();

    useEffect(() => {
        setPage(0);
    }, [searchTerm, rowsPerPage]);

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

    const handleClearSearch = () => {
        setSearchTerm('');
        setPage(0);
    };

    if (isLoading) return <Typography color="text.secondary">Loading sensors...</Typography>;
    if (isError) return <Typography color="text.secondary">Error loading sensors</Typography>;

    const allSensors: SensorDto[] = data?.content ?? [];

    const filteredSensors = allSensors.filter(sensor =>
        sensor.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sensor.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedSensors = filteredSensors.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ minHeight: '100vh', padding: 2, bgcolor: 'white' }}>
            <Container sx={{ bgcolor: 'white', py: 2 }}>
                <Paper elevation={3} sx={{ mt: 4, padding: '10px', bgcolor: 'white' }}>
                    <Typography variant="h4" align="center" fontWeight="bold" color="text.secondary">
                        Sensors
                    </Typography>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
                    <TextField
                        placeholder="Search by ID, name, area, topic ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        sx={{ width: '300px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClearSearch} size="small">
                                        <ClearIcon sx={{ color: 'text.secondary' }} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('add')}
                        sx={{
                            backgroundColor: '#512da8',
                            color: 'white',
                            '&:hover': { backgroundColor: "#9c27b0" },
                            fontWeight: 'bold'
                        }}
                    >
                        Add Sensor
                    </Button>
                </Box>

                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="sensor table">
                        <TableHead>
                            <TableRow>
                                {['Sensor ID', 'Sensor Name', 'Sensor Area', 'Topic', 'Type', 'Status', 'Actions'].map(col => (
                                    <TableCell key={col}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                            {col}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedSensors.map(sensor => (
                                <TableRow
                                    key={sensor.id}
                                    hover
                                    onClick={() => navigate(`${sensor.id}`)}
                                    sx={{ cursor: 'pointer', bgcolor: 'white' }}
                                >
                                    <TableCell>{sensor.id}</TableCell>
                                    <TableCell>
                                        <Tooltip title={sensor.name} arrow><span>{sensor.name}</span></Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={sensor.area} arrow><span>{sensor.area}</span></Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={sensor.topic} arrow><span>{sensor.topic}</span></Tooltip>
                                    </TableCell>
                                    <TableCell>{sensor.type}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={sensor?.status ? "Active" : "Inactive"} arrow>
                                            <Box sx={{
                                                width: 12, height: 12, borderRadius: '50%',
                                                bgcolor: sensor?.status ? 'green' : 'red',
                                                margin: '0 auto'
                                            }} />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit Sensor" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); navigate(`${sensor.id}/edit`); }}
                                                sx={{
                                                    mr: 1, backgroundColor: '#512da8', color: 'white',
                                                    minWidth: '40px', p: '6px',
                                                    '&:hover': { backgroundColor: '#9c27b0' }
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Delete Sensor" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => handleDeleteClick(e, sensor.id)}
                                                sx={{
                                                    mr: 1, backgroundColor: '#512da8', color: 'white',
                                                    minWidth: '40px', p: '6px',
                                                    '&:hover': { backgroundColor: '#9c27b0' }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Restore Sensor Status" arrow>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => handleRestoreClick(e, sensor)}
                                                sx={{
                                                    backgroundColor: '#512da8', color: 'white',
                                                    minWidth: '40px', p: '6px',
                                                    '&:hover': { backgroundColor: '#9c27b0' }
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

                    <TablePagination
                        component="div"
                        count={filteredSensors.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                    />
                </TableContainer>
            </Container>

            <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>Are you sure you want to delete this sensor?</DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} sx={{ backgroundColor: '#512da8', color: 'white', '&:hover': { backgroundColor: '#9c27b0' } }}>No</Button>
                    <Button onClick={confirmDelete} sx={{ backgroundColor: '#512da8', color: 'white', '&:hover': { backgroundColor: '#9c27b0' } }}>Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle sx={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalSuccess ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogContent sx={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalMessage}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SensorsListView;
