import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Input, InputAdornment, Box, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestoreIcon from '@mui/icons-material/Restore';
import {SensorDto} from '../api/ApiSensor';
import {useDeleteSensor, useRestoreSensor, useSensors} from "../hooks/useSensor";

const SensorsListView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();

    const {data: sensorList = [], isLoading, isError} = useSensors();
    const deleteSensor = useDeleteSensor();
    const restoreSensor = useRestoreSensor();

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, sensorId: number) => {
        e.stopPropagation();
        deleteSensor.mutate(sensorId);
    };

    const handleRestoreClick = (e: React.MouseEvent<HTMLButtonElement>, sensor: SensorDto) => {
        e.stopPropagation();
        restoreSensor.mutate(sensor);
    };

    const filteredSensors = sensorList.filter(sensor =>
        sensor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <Typography>Loading sensors...</Typography>;
    if (isError) return <Typography>Error loading sensors</Typography>;

    return (
        <Box sx={{minHeight: '100vh', padding: 2}}>
            <Container>
                <Paper elevation={3} sx={{mt: 4, padding: '10px'}}>
                    <Typography variant="h4" align="center" fontWeight="bold" color="text.secondary">
                        Sensors List
                    </Typography>
                </Paper>

                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
                    <Input
                        placeholder="Search by ID"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={() => navigate('add')}
                        sx={{mt: 2, mb: 2, backgroundColor: '#D3A1FF', color: 'black'}}
                    >
                        Add Sensor
                    </Button>
                </div>

                <TableContainer component={Paper} elevation={3} sx={{ maxHeight: '500px'}}>
                    <Table sx={{minWidth: 650}} aria-label="sensor table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sensor ID</TableCell>
                                <TableCell>Sensor Name</TableCell>
                                <TableCell>Sensor Area</TableCell>
                                <TableCell>Topic</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSensors.map((sensor) => (
                                <TableRow
                                    key={sensor.id}
                                    hover
                                    onClick={() => navigate(`${sensor.id}`)}
                                    sx={{cursor: 'pointer'}}
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
                                    <TableCell sx={{color: sensor.status ? 'green' : 'red'}}>
                                        {sensor.status ? 'Active' : 'Inactive'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon/>}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`${sensor.id}/edit`);
                                            }}
                                            sx={{mr: 1, backgroundColor: '#D3A1FF', color: 'black'}}
                                        >
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<DeleteIcon/>}
                                            onClick={(e) => handleDeleteClick(e, sensor.id)}
                                            sx={{mr: 1, backgroundColor: '#D3A1FF', color: 'black'}}
                                        >
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<RestoreIcon/>}
                                            onClick={(e) => handleRestoreClick(e, sensor)}
                                            sx={{backgroundColor: '#D3A1FF', color: 'black'}}
                                        >
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default SensorsListView;
