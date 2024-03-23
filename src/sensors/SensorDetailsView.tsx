import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import {Link, useNavigate, useParams} from 'react-router-dom';
import ExportToExcel from '../export/ExportToExcel';
import {useQuery} from 'react-query'; // Import useQuery from react-query
import {Box, Divider} from '@mui/material';
import axios from 'axios';
import {SensorDto} from "../api/ApiSensor";


const SensorDetailsView: React.FC = () => {
    const {sensorId} = useParams<{ sensorId: string }>();
    const navigate = useNavigate();

    const {data: sensors} = useQuery<SensorDto, Error>(
        ['sensorData', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(
                `http://localhost:8080/api/sensor/get-sensor/${sensorId}`
            );
            console.log(sensorId)
            return response.data;
        }
    );
    const handleMinChart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`bar-chart-min`);
    };

    const handleMaxChart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`bar-chart-max`);
    };
    const handleAvgChart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`bar-chart-avg`);
    };
    const handleLineChart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`line-chart`);
    };

    return (
        <div style={{marginTop: '100px'}}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={6} sx={{padding: 3}}>
                        <Typography variant="h5" padding={2}>
                            Sensor Details
                        </Typography>
                        <Divider></Divider>
                        <Box sx={{
                            marginRight: '10px',
                            marginTop: '20px',
                            marginBottom: '10px',
                            alignContent: 'flex-end'
                        }}>
                            {sensors && <ExportToExcel data={[sensors]} fileName="exportedSensors"/>}
                            <Typography>Export monthly data to csv.</Typography>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sensor ID</TableCell>
                                        <TableCell>Sensor Name</TableCell>
                                        <TableCell>Sensor Area</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{sensors?.id}</TableCell>
                                        <TableCell>{sensors?.name}</TableCell>
                                        <TableCell>{sensors?.area}</TableCell>
                                        <TableCell style={{ color: sensors?.status ? 'green' : 'red' }}>
                                            {sensors?.status ? 'Active' : 'Inactive'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{marginTop: '20px', flex: 'max-content'}}>
                            <Button component={Link} to="/map" variant="contained" color="primary"
                                    sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}>
                                Map
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLineChart}
                                sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                            > Graph
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMinChart}
                                sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                            >
                                Min
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleMaxChart}
                                sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                            >
                                Max
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAvgChart}
                                sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                            >
                                Avg
                            </Button>
                            <Typography>Choose for the "Location" of the sensor, "Daily" Temperatures and max, min and
                                average "Charts".</Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default SensorDetailsView;
