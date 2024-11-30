import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
import RestoreIcon from '@mui/icons-material/Restore';
import axios from 'axios';
import {SensorDto} from '../api/ApiSensor';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const SensorsListView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const [sensorList, setSensorList] = useState<SensorDto[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<SensorDto[]>('http://localhost:8080/api/sensor/show-sensors');
                setSensorList(response.data);
            } catch (error) {
                console.error('Error fetching sensor list:', error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, sensorId: number) => {
        e.stopPropagation();

        try {
            await axios.delete(`http://localhost:8080/api/sensor/delete-sensor/${sensorId}`);
            setSensorList(prevSensorList => prevSensorList.filter(sensor => sensor.id !== sensorId));
            navigate(`/sensors`);
        } catch (error) {
            console.error(`Error deleting sensor with ID ${sensorId}:`, error);
        }
    };

    const handleRestoreClick = async (e: React.MouseEvent<HTMLButtonElement>, sensorId: number) => {
        e.stopPropagation();
        try {
            const sensorIndex = sensorList.findIndex(sensor => sensor.id === sensorId);

            if (sensorIndex !== -1) {
                const updatedSensorList = [...sensorList];
                updatedSensorList[sensorIndex] = {...updatedSensorList[sensorIndex], status: true};
                const response = await axios.put(`http://localhost:8080/api/sensor/restore/${sensorId}`, updatedSensorList[sensorIndex]);
                setSensorList(updatedSensorList);
            } else {
                console.error(`Sensor with ID ${sensorId} not found in the list.`);
            }
        } catch (error) {
            console.error(`Error restoring sensor with ID ${sensorId}:`, error);
        }
    };

    const filteredSensors = sensorList.filter(sensor =>
        sensor.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (sensorId: number) => {
        navigate(`${sensorId}`);
    };

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, sensorId: number) => {
        e.stopPropagation();
        navigate(`${sensorId}/edit`);
    };

    const handleAddSensorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate('add');
    };

    return (
        <Box sx={{backgroundColor: '#cccccc', minHeight: '100vh', padding: 2}}>
            <Container>
                <Paper elevation={3} sx={{mt: 4, backgroundColor: '#a5a5a5', padding: '10px'}}>
                    <Typography variant="h4" align="center" fontWeight="bold" color="text.secondary">
                        Sensors List
                    </Typography>
                </Paper>
                <div
                    style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
                    <Input
                        placeholder="Search by ID"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon   /> {/* Changes search icon color */}
                            </InputAdornment>
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
                        onClick={handleAddSensorClick}
                        style={{
                            marginRight: '10px',
                            marginTop: '10px',
                            marginBottom: '20px',
                            backgroundColor: ' #D3A1FF',
                            color: 'black',
                        }}
                    >
                        Add Sensor
                    </Button>
                </div>
                <div style={{marginTop: '20px'}}/>
                <div style={{maxHeight: '500px', overflowY: 'auto'}}>
                    <TableContainer component={Paper} elevation={3} sx={{backgroundColor: '#cccccc'}}>
                        <Table sx={{minWidth: 650}} aria-label="sensor table">
                            <TableHead>
                                <TableRow>
                                    <TableCell >Sensor ID</TableCell>
                                    <TableCell >Sensor Name</TableCell>
                                    <TableCell >Sensor Area</TableCell>
                                    <TableCell>Topic</TableCell>
                                    <TableCell >Type</TableCell>
                                    <TableCell >Status</TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {filteredSensors.map((sensor) => (
                                    <TableRow
                                        key={sensor.id}
                                        onClick={() => handleRowClick(sensor.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell >{sensor.id}</TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                                            <Tooltip title={sensor.name} arrow>
                                                <span>{sensor.name}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                                            <Tooltip title={sensor.area} arrow>
                                                <span>{sensor.area}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                                            <Tooltip title={sensor.topic} arrow>
                                                <span>{sensor.topic}</span>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                                            {sensor.type}
                                        </TableCell>
                                        <TableCell sx={{ color: sensor.status ? 'green' : 'red' }}>
                                            {sensor.status ? 'Active' : 'Inactive'}
                                        </TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<EditIcon />}
                                                    onClick={(e) => handleEditClick(e, sensor.id)}
                                                    style={{
                                                        marginRight: '5px',
                                                        marginTop: '10px',
                                                        marginBottom: '10px',
                                                        backgroundColor: ' #D3A1FF',
                                                        color: 'black',
                                                    }}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={(e) => handleDeleteClick(e, sensor.id)}
                                                    style={{
                                                        marginRight: '5px',
                                                        marginTop: '10px',
                                                        marginBottom: '10px',
                                                        backgroundColor: ' #D3A1FF',
                                                        color: 'black',
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<RestoreIcon />}
                                                    onClick={(e) => handleRestoreClick(e, sensor.id)}
                                                    style={{
                                                        marginRight: '5px',
                                                        marginTop: '10px',
                                                        marginBottom: '10px',
                                                        backgroundColor: '#D3A1FF',
                                                        color: 'black',
                                                    }}
                                                >
                                                    Restore
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </Box>
    );
};

export default SensorsListView;
