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
import { Link } from 'react-router-dom';
interface SensorDetails {
    sensorId: string;
    sensorName: string;
    sensorArea: string;
    sensorData: string[];
}

// Generate 30 data points
const generateSensorData = () => {
    const dataPoints = Array.from({length: 30}, (_, index) => `Data Point ${index + 1}`);
    return dataPoints;
};

const mockSensorDetails: SensorDetails = {
    sensorId: '1',
    sensorName: 'Sensor 1',
    sensorArea: 'Athens',
    sensorData: generateSensorData(),
};

const SensorDetailsView: React.FC = () => {
    return (
        <div style={{marginTop: '100px'}}>
            <Grid container justifyContent="center" alignItems="center" spacing={3} >
                <Grid item xs={12} md={6}>
                    <Paper elevation={6} sx={{padding: 3}}>
                        <Typography variant="h5" padding={3}>Sensor Details</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sensor ID</TableCell>
                                        <TableCell>Sensor Name</TableCell>
                                        <TableCell>Sensor Area</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{mockSensorDetails.sensorId}</TableCell>
                                        <TableCell>{mockSensorDetails.sensorName}</TableCell>
                                        <TableCell>{mockSensorDetails.sensorArea}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div style={{marginTop: '20px', flex: "max-content"}}>
                            {/* Wrap your Buttons with Link */}
                            <Button component={Link} to="/map" variant="contained" color="primary" sx={{marginRight: '10px',marginTop:'10px',marginBottom:'20px'}}>
                                Map
                            </Button>
                            <Button component={Link} to="/line-chart" variant="contained" color="primary" sx={{marginRight: '10px',marginTop:'10px',marginBottom:'20px'}}>
                                Graph
                            </Button>
                            <Button component={Link} to="/bar-chart" variant="contained" color="primary" sx={{marginRight: '10px',marginTop:'10px',marginBottom:'20px'}}>
                                Max
                            </Button>
                            <Button component={Link} to="/bar-chart" variant="contained" color="primary" sx={{marginRight: '10px',marginTop:'10px',marginBottom:'20px'}}>
                                Min
                            </Button>
                            <Button component={Link} to="/bar-chart" variant="contained" color="primary" sx={{marginRight: '10px',marginTop:'10px',marginBottom:'20px'}}>
                                Average
                            </Button>
                            <Typography>
                                Choose for the "Location" of the sensor, "Daily" Temperatures and "Monthly" maximum, minimum and average temperatures.
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default SensorDetailsView;
