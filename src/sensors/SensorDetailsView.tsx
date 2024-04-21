import React, {useEffect, useState} from 'react';
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
import {useNavigate, useParams} from 'react-router-dom';
import ExportToExcel from '../export/ExportToExcel';
import {useQuery} from 'react-query';
import {Box, Divider} from '@mui/material';
import axios from 'axios';
import {SensorDto, SensorRecordDto, FileData, SensorDataDto} from "../api/ApiSensor";
import Chart from "chart.js/auto";


const SensorDetailsView: React.FC = () => {
    const {sensorId} = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const [minValues, setMinValues] = useState<number[]>([]); // Define state for min values
    const [maxValues, setMaxValues] = useState<number[]>([]); // Define state for max values
    const [avgValues, setAvgValues] = useState<number[]>([]); // Define state for avg values
    const [avgSensorValues, setSensorAvgValues] = useState<number[]>([]); // Define state for avg values
    const [minSensorValues, setSensorMinValues] = useState<number[]>([]); // Define state for avg values
    const [maxSensorValues, setSensorMaxValues] = useState<number[]>([]); // Define state for avg values


    const {data: sensors} = useQuery<SensorDto, Error>(
        ['sensorData', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(
                `http://localhost:8080/api/sensor/get-sensor/${sensorId}`
            );
            return response.data;
        }
    );
    const {data: temp = []} = useQuery<SensorRecordDto[], Error>(
        ['data', sensorId],
        async () => {
            const response = await axios.get<SensorRecordDto[]>(
                `http://localhost:8080/api/sensor/reports/get-month-data?sensorId=${sensorId}`
            );
            console.log(response.data)
            return response.data;
        }
    );
    const {data: fileData = []} = useQuery<FileData[], Error>(
        ['data', sensorId],
        async () => {
            const response = await axios.get<FileData[]>(
                `http://localhost:8080/api/sensor/upload`
            );
            console.log(response.data)
            return response.data;
        }
    );

    // const {data: loadFileData = []} = useQuery<FileData[], Error>(
    //     ['data', sensorId],
    //     async () => {
    //         const response = await axios.get<FileData[]>(
    //             `http://localhost:8080/api/sensor/load-file-data`
    //         );
    //         const [predictedData, setPredictedData] = useState<FileData[]>([]);
    //
    //         console.log(response.data)
    //         return response.data;
    //     }
    // );



    const handlePrediction = async () => {
        try {
            // Make the API call to trigger prediction
            const response = await axios.get('http://localhost:8080/api/sensor/predict');
            // Set the predicted data to the state variable
            // setPredictedData(response.data);
            // Optionally, you can do something after the prediction is triggered
            console.log('Prediction triggered successfully');
        } catch (error) {
            // Handle errors if any
            console.error('Error while triggering prediction:', error);
        }
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0]; // Get the first file from the list
            handleUpload(file); // Pass the file to the handleUpload function
        }
    };

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.put<FileData[]>(
                `http://localhost:8080/api/sensor/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('File uploaded:', response.data);
            const minValues = response.data.map(data => data.min).filter(min => min !== undefined) as number[];
            const maxValues = response.data.map(data => data.max).filter(max => max !== undefined) as number[];
            const avgValues = response.data.map(data => data.avg).filter(avg => avg !== undefined) as number[];
            setMinValues(minValues);
            setMaxValues(maxValues);
            setAvgValues(avgValues);

        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const {data: sensorData, isLoading, isError} = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, 2024],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/2024`);
            const avgSensorTemperatures: number[] = response.data.map((item: SensorDataDto) => item.averageTemperature || 0);
            setSensorAvgValues(avgSensorTemperatures);
            const minSensorTemperatures: number[] = response.data.map((item: SensorDataDto) => item.minTemperature || 0);
            setSensorMinValues(minSensorTemperatures);
            const maxSensorTemperatures: number[] = response.data.map((item: SensorDataDto) => item.maxTemperature || 0);
            setSensorMaxValues(maxSensorTemperatures);

            return response.data;
        }
    );


    useEffect(() => {
        console.log(avgSensorValues)
    }, [avgSensorValues]);


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
    const handleMap = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`map`);
    };

    useEffect(() => {
        const ctx = document.getElementById('maxChart');
        if (ctx) {
            // Check if a chart instance already exists and destroy it
            // @ts-ignore
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }


            // @ts-ignore
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'File Values',
                            data: maxValues, // Use dynamic sensor data here
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Prediction Values',
                            data: [30, 50, 70, 60, 40, 70, 80, 65, 55, 45, 35, 25],
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        },
                        {
                            label: 'Sensor Values',
                            //here
                            data: maxSensorValues,
                            fill: false,
                            borderColor: 'rgb(121, 176, 215)',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [maxValues,sensorData]);



    useEffect(() => {
        const ctx = document.getElementById('minChart');
        if (ctx) {
            // Check if a chart instance already exists and destroy it
            // @ts-ignore
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }

            // Create new chart with dynamic sensor data
            // @ts-ignore
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'File Values',
                            data: minValues, // Use dynamic sensor data here
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Prediction Values',
                            data: [30, 50, 70, 60, 40, 70, 80, 65, 55, 45, 35, 25],
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        },
                        {
                            label: 'Sensor Values',
                            data: minSensorValues,
                            fill: false,
                            borderColor: 'rgb(121, 176, 215)',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [minValues,sensorData]);
    useEffect(() => {
        const ctx = document.getElementById('avgChart');
        if (ctx) {
            // Check if a chart instance already exists and destroy it
            // @ts-ignore
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }

            // @ts-ignore
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'File Values',
                            data: avgValues,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        },
                        {
                            label: 'Prediction Values',
                            data: [30, 50, 70, 60, 40, 70, 80, 65, 55, 45, 35, 25],
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        },
                        {
                            label: 'Sensor Values',
                            data: avgSensorValues,
                            fill: false,
                            borderColor: 'rgb(121, 176, 215)',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, [avgValues,sensorData]);


    return (
        <div style={{marginTop: '20px', marginBottom: '200px', overflowY: 'hidden'}}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={6} sx={{padding: 3}}>
                        <Paper elevation={6} sx={{padding: 3}}>
                            <Typography variant="h5" padding={2} fontWeight="bold" color="text.secondary">
                                Sensor Details
                            </Typography>
                            <Divider/>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">Sensor
                                                    ID</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">Sensor
                                                    Name</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">Sensor
                                                    Area</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold"
                                                            color="text.secondary">Status</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{sensors?.id}</TableCell>
                                            <TableCell>{sensors?.name}</TableCell>
                                            <TableCell>{sensors?.area}</TableCell>
                                            <TableCell style={{color: sensors?.status ? 'green' : 'red'}}>
                                                {sensors?.status ? 'Active' : 'Inactive'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider/>

                            <div style={{marginTop: '20px', flex: 'max-content'}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleMap}
                                    sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}
                                > Map
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
                            </div>
                        </Paper>
                        <Box sx={{marginBottom: '20px'}}></Box>
                        <Paper elevation={6} sx={{padding: 3}}>
                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                Upload file and run prediction algorithm
                            </Typography>

                            <input type="file" accept=".xlsx, .xls" onChange={handleChange}/>
                            <Box sx={{marginTop: '10px'}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePrediction}
                                    sx={{marginRight: '10px', marginTop: '10px', marginBottom: '20px'}}>
                                    Run Algorithm
                                </Button>
                                <Divider/>
                                <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                    Export results in xlsx
                                </Typography>
                                <Box sx={{
                                    marginRight: '10px',
                                    marginTop: '10px',
                                    marginBottom: '20px',
                                    alignContent: 'flex-end'
                                }}>
                                    {sensors && <ExportToExcel data={temp || []} fileName="exportedSensors"/>}
                                </Box>
                            </Box>
                        </Paper>
                        <Box sx={{marginBottom: '20px'}}></Box>
                        <Paper elevation={6} sx={{padding: 3}}>
                            <Grid container justifyContent="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                        Max
                                    </Typography>
                                    <Box sx={{
                                        width: '400px',
                                        height: '400px',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Add shadow here
                                    }}>
                                        <canvas id="maxChart" width="400" height="400"></canvas>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                        Min
                                    </Typography>
                                    <Box sx={{
                                        width: '400px',
                                        height: '400px',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Add shadow here
                                    }}>
                                        <canvas id="minChart" width="400" height="400"></canvas>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                        Avg
                                    </Typography>
                                    <Box sx={{
                                        width: '400px',
                                        height: '400px',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // Add shadow here
                                    }}>
                                        <canvas id="avgChart" width="400" height="400"></canvas>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default SensorDetailsView;