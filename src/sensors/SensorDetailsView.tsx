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
import {Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import axios from 'axios';
import {SensorDto, SensorRecordDto, FileData, SensorDataDto, PredictionData} from "../api/ApiSensor";
import Chart from "chart.js/auto";
import Footer from "../layout/Footer";


const SensorDetailsView: React.FC = () => {
    const {sensorId} = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const [minValues, setMinValues] = useState<number[]>([]); // Define state for min values
    const [maxValues, setMaxValues] = useState<number[]>([]); // Define state for max values
    const [avgValues, setAvgValues] = useState<number[]>([]); // Define state for avg values
    const [avgSensorValues, setSensorAvgValues] = useState<number[]>([]); // Define state for avg values
    const [minSensorValues, setSensorMinValues] = useState<number[]>([]); // Define state for avg values
    const [maxSensorValues, setSensorMaxValues] = useState<number[]>([]); // Define state for avg values
    const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [values, setValues] = useState<{ min?: number; max?: number; avg?: number }>({});
    const [selectedMonth, setSelectMonth] = useState('');
    const [monthValues, setMonthValues] = useState<{ min?: number; max?: number; avg?: number }>({});



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
            return response.data;
        }
    );

    const handleLoadFileData = async () => {
        try {
            const response = await axios.get<PredictionData[]>('http://localhost:8080/api/predict');
            setPredictionData(response.data);
            console.log(response.data)

        } catch (error) {
            console.error('Error loading file data:', error);
            // Handle error, e.g., display an error message
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
            const avgSensorValues: number[] = response.data.map((item: SensorDataDto) => item.averageValue || 0);
            setSensorAvgValues(avgSensorValues);
            const minSensorValues: number[] = response.data.map((item: SensorDataDto) => item.minValue || 0);
            setSensorMinValues(minSensorValues);
            const maxSensorValues: number[] = response.data.map((item: SensorDataDto) => item.maxValue || 0);
            setSensorMaxValues(maxSensorValues);

            return response.data;
        }
    );


    useEffect(() => {
        console.log(predictionData.map(data => data.january))
    }, [predictionData]);


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
                            label: 'Prediction Values',
                            data:predictionData.map(data => data.january),
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1
                        },
                        {
                            label: 'Sensor Values',
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
                            label: 'Prediction Values',
                            data: [4, 10, 16, 20, 22, 0, 0, 0, 0, 0, 0, 0],
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
                            label: 'Prediction Values',
                            data: [15, 10, 16, 20, 22, 0, 0, 0, 0, 0, 0, 0],
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




    const handleChangeType = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value);
        // Fetch min, max, avg values based on selected type
        // For now, setting dummy values
        if (event.target.value === '10') { // Max
            setValues({ min: 50, max: 100, avg: 75 }); // Example values
        } else if (event.target.value === '21') { // Min
            setValues({ min: 20, max: 70, avg: 45 }); // Example values
        } else if (event.target.value === '22') { // Avg
            setValues({ min: 30, max: 80, avg: 55 }); // Example values
        } else {
            setValues({});
        }
    };
    const handleChangeMonth = (event: SelectChangeEvent<string>) => {
        setSelectMonth(event.target.value);
        // Fetch min, max, avg values based on selected type
        // For now, setting dummy values
        // if (event.target.value === '10') { // Max
        //     setValues({ min: 50, max: 100, avg: 75 }); // Example values
        // } else if (event.target.value === '21') { // Min
        //     setValues({ min: 20, max: 70, avg: 45 }); // Example values
        // } else if (event.target.value === '22') { // Avg
        //     setValues({ min: 30, max: 80, avg: 55 }); // Example values
        // } else {
        //     setValues({});
        // }
    };



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
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    ID</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Name</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Area</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Latitude</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Longitude</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Type</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Topic</Typography>
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
                                            <TableCell>{sensors?.latitude}</TableCell>
                                            <TableCell>{sensors?.longitude}</TableCell>
                                            <TableCell>{sensors?.type}</TableCell>
                                            <TableCell>{sensors?.topic}</TableCell>
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
                                <Divider/>

                            </div>
                        </Paper>
                        <Box sx={{marginBottom: '20px'}}></Box>
                        <Paper elevation={6} sx={{padding: 3}}>
                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                Upload file
                            </Typography>

                            <input type="file" accept=".xlsx, .xls" onChange={handleChange}/>
                            <Box sx={{marginTop: '10px'}}>
                                <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                    Choose type, year, month
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 100 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        value={selectedType}
                                        onChange={handleChangeType}
                                        autoWidth
                                        label="Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={10}>Max</MenuItem>
                                        <MenuItem value={21}>Min</MenuItem>
                                        <MenuItem value={22}>Avg</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 100 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Month</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-autowidth-label"
                                        id="demo-simple-select-autowidth"
                                        // value={age}
                                        // onChange={handleChange}
                                        autoWidth
                                        label="Month"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                            <em>None</em>
                                            <MenuItem value={10}>January</MenuItem>
                                            <MenuItem value={21}>February</MenuItem>
                                            <MenuItem value={32}>March</MenuItem>
                                            <MenuItem value={43}>April</MenuItem>
                                            <MenuItem value={54}>May</MenuItem>
                                            <MenuItem value={65}>June</MenuItem>
                                            <MenuItem value={76}>July</MenuItem>
                                            <MenuItem value={87}>August</MenuItem>
                                            <MenuItem value={98}>September</MenuItem>
                                            <MenuItem value={109}>October</MenuItem>
                                            <MenuItem value={111}>November</MenuItem>
                                            <MenuItem value={112}>December</MenuItem>

                                    </Select>
                                </FormControl>
                                {1<2 ? (
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item>
                                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                                Max
                                            </Typography>
                                            <Box sx={{
                                                width: '700px',
                                                height: '400px',
                                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                                textAlign: 'center'
                                            }}>
                                                <canvas id="maxChart" width="700" height="400"></canvas>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item>
                                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                                Min
                                            </Typography>
                                            <Box sx={{
                                                width: '700px',
                                                height: '400px',
                                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                                textAlign: 'center'
                                            }}>
                                                <canvas id="minChart" width="700" height="400"></canvas>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                                {/*: (*/}
                                {/*<Grid container justifyContent="center" spacing={2}>*/}
                                {/*    <Grid item>*/}
                                {/*        <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">*/}
                                {/*            Avg*/}
                                {/*        </Typography>*/}
                                {/*        <Box sx={{*/}
                                {/*            width: '700px',*/}
                                {/*            height: '400px',*/}
                                {/*            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',*/}
                                {/*            textAlign: 'center'*/}
                                {/*        }}>*/}
                                {/*            <canvas id="avgChart" width="700" height="400"></canvas>*/}
                                {/*        </Box>*/}
                                {/*    </Grid>*/}
                                {/*</Grid>*/}
                                {/*)}*/}

                                <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                    Run the algorithm
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleLoadFileData}
                                    sx={{ marginTop: '10px' }}>
                                    Run
                                </Button>
                                {/*<Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">*/}
                                {/*    Export results in xlsx*/}
                                {/*</Typography>*/}
                                {/*<Box sx={{*/}
                                {/*    marginRight: '10px',*/}
                                {/*    marginTop: '10px',*/}
                                {/*    marginBottom: '20px',*/}
                                {/*    alignContent: 'flex-end'*/}
                                {/*}}>*/}
                                {/*    {sensors && <ExportToExcel data={temp || []} fileName="exportedSensors"/>}*/}
                                {/*</Box>*/}

                            </Box>
                        </Paper>

                    </Paper>
                </Grid>
            </Grid>
            <Footer></Footer>
        </div>

    );
};

export default SensorDetailsView;