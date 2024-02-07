import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface SensorInfo {
    sensorId: string;
    sensorName: string;
    sensorArea: string;
}

const SensorsListView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate(); // Initialize useNavigate

    const sensorData: SensorInfo[] = [
        { sensorId: '1', sensorName: 'Sensor 1', sensorArea: 'Athens' },
        { sensorId: '2', sensorName: 'Sensor 2', sensorArea: 'Crete'},
        { sensorId: '3', sensorName: 'Sensor 3', sensorArea: 'Thessaloniki'},
        { sensorId: '4', sensorName: 'Sensor 4', sensorArea: 'Patra'},
        { sensorId: '5', sensorName: 'Sensor 5', sensorArea: 'Ioannina'},

    ];

    const filteredSensors = sensorData.filter(sensor =>
        sensor.sensorId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (sensorId: string) => {
        // Redirect to the specific page based on sensorId
        navigate(`/sensors/${sensorId}`);
    };

    const handleEditClick = (sensorId: string) => {
        // Handle edit action (you can navigate or perform any other action)
        navigate(`/map`);
        console.log(`Edit button clicked for sensorId: ${sensorId}`);
    };

    const handleDeleteClick = (sensorId: string) => {
        // Handle delete action (you can navigate or perform any other action)
        console.log(`Delete button clicked for sensorId: ${sensorId}`);
    };

    const handleMapClick = (sensorId: string) => {
        // Handle map action (you can navigate or perform any other action)
        console.log(`Map button clicked for sensorId: ${sensorId}`);
    };

    const handleChartClick = (sensorId: string) => {
        // Handle chart action (you can navigate or perform any other action)
        console.log(`Chart button clicked for sensorId: ${sensorId}`);
    };

    const handleAddSensorClick = () => {
        // Redirect to the page for adding a new sensor
        navigate('/add-sensor');
    };

    return (
        <Container>
            <Paper elevation={3} sx={{ mt: 4, backgroundColor: '#f0f0f0', padding: '10px' }}>
                <Typography variant="h4" align={"center"}>
                    Sensors List
                </Typography>
            </Paper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <Input
                    placeholder="Search by ID"
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddSensorClick}
                >
                    Add Sensor
                </Button>
            </div>
            <div style={{ marginTop: '20px' }} />
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }} aria-label="sensor table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sensor ID</TableCell>
                            <TableCell>Sensor Name</TableCell>
                            <TableCell>Sensor Area</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSensors.map((sensor) => (
                            <TableRow
                                key={sensor.sensorId}
                                onClick={() => handleRowClick(sensor.sensorId)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell>{sensor.sensorId}</TableCell>
                                <TableCell>{sensor.sensorName}</TableCell>
                                <TableCell>{sensor.sensorArea}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditClick(sensor.sensorId)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteClick(sensor.sensorId)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SensorsListView;
