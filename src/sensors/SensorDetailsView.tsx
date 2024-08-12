import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import ExportToExcel from '../export/ExportToExcel';
import { useQuery } from 'react-query';
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { SensorDto, FileData, SensorDataDto, PredictionData } from "../api/ApiSensor";
import Chart from "chart.js/auto";
import Footer from "../layout/Footer";

const SensorDetailsView: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const [minValues, setMinValues] = useState<number[]>([]);
    const [maxValues, setMaxValues] = useState<number[]>([]);
    const [avgValues, setAvgValues] = useState<number[]>([]);
    const [avgSensorValues, setSensorAvgValues] = useState<number[]>([]);
    const [minSensorValues, setSensorMinValues] = useState<number[]>([]);
    const [maxSensorValues, setSensorMaxValues] = useState<number[]>([]);
    const [predictionData, setPredictionData] = useState<PredictionData>();
    const [selectedType, setSelectedType] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const { data: sensors } = useQuery<SensorDto, Error>(
        ['sensorData', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(
                `http://localhost:8080/api/sensor/get-sensor/${sensorId}`
            );
            return response.data;
        }
    );

    const handlePrediction = async () => {
        try {
            const response = await axios.get<PredictionData>('http://localhost:8080/api/predict');
            setPredictionData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error loading file data:', error);
        }
    };

    const { data: sensorData, isLoading, isError } = useQuery<SensorDataDto[], Error>(
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

    const handleChangeType = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value);
    };

    const handleChangeYear = (event: SelectChangeEvent<string>) => {
        setSelectedYear(event.target.value);
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
        const renderChart = () => {
            const ctx = document.getElementById(selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart');
            if (ctx) {
                // Check if a chart instance already exists and destroy it
                // @ts-ignore
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {
                    existingChart.destroy();
                }

                // Render the appropriate chart
                // @ts-ignore
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        datasets: [
                            {
                                label: 'Prediction Values',
                                data: Object.values(predictionData || {}),
                                fill: false,
                                borderColor: 'rgb(0, 255, 0)',
                                tension: 0.1
                            },
                            {
                                label: selectedType === "Max" ? 'Sensor Values (Max)' : selectedType === "Min" ? 'Sensor Values (Min)' : 'Sensor Values (Avg)',
                                data: selectedType === "Max" ? maxSensorValues : selectedType === "Min" ? minSensorValues : avgSensorValues,
                                fill: false,
                                borderColor: selectedType === "Max" ? 'rgb(255, 99, 132)' : selectedType === "Min" ? 'rgb(70, 130, 180)' : 'rgb(255, 206, 86)', // Redish, Bluish, Yellowish
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
        };

        renderChart();
    }, [selectedType, maxSensorValues, minSensorValues, avgSensorValues, predictionData]);

    return (
        <div style={{  overflowY: 'hidden' }}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={6} sx={{ padding: 3, backgroundColor: '#333' }}>
                        <Paper elevation={6} sx={{ padding: 3, backgroundColor: 'lightgray' }}>
                            <Typography variant="h5" padding={2} fontWeight="bold" color="text.secondary">
                                Sensor Details
                            </Typography>
                            <Divider />
                            <TableContainer component={Paper} sx={{ backgroundColor: 'lightgray' }}>
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
                                            <TableCell style={{ color: sensors?.status ? 'green' : 'red' }}>
                                                {sensors?.status ? 'Active' : 'Inactive'}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider />

                            <div style={{ marginTop: '20px', flex: 'max-content' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleMap}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        // backgroundColor: '#55565B',
                                        backgroundColor: '#FFD700',
                                        color: '#55565B',
                                    }}                                > Map
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleLineChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#FFD700',
                                        color: '#55565B',
                                    }}                                > Graph
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleMinChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#FFD700',
                                        color: '#55565B',
                                    }}                                >
                                    Min
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleMaxChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#FFD700',
                                        color: '#55565B',
                                    }}                                >
                                    Max
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAvgChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#FFD700',
                                        color: '#55565B',
                                    }}
                                >
                                    Avg
                                </Button>

                                <Divider />

                            </div>
                        </Paper>
                        <Box sx={{ marginBottom: '20px' }}></Box>
                        <Paper elevation={6} sx={{ padding: 3, backgroundColor: 'lightgray' }}>
                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                Upload file
                            </Typography>

                            <input type="file" accept=".xlsx, .xls" onChange={handleChange} />
                            <Box sx={{ marginTop: '10px' }}>
                                <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                    Select metric/year
                                </Typography>
                                <FormControl sx={{ m: 1, minWidth: 100 }}>
                                    <InputLabel id="demo-simple-select-autowidth-label">Metric</InputLabel>
                                    <Select
                                        labelId="metric"
                                        id="demo-simple-select-autowidth"
                                        value={selectedType}
                                        onChange={handleChangeType}
                                        autoWidth
                                        label="Metric"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="Max">Max</MenuItem>
                                        <MenuItem value="Min">Min</MenuItem>
                                        <MenuItem value="Avg">Avg</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 100 }}>
                                    <InputLabel id="year-label">Year</InputLabel>
                                    <Select
                                        labelId="year-label"
                                        id="demo-simple-select-autowidth"
                                        value={selectedYear}
                                        onChange={handleChangeYear}
                                        autoWidth
                                        label="Year"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                        <MenuItem value="2023">2023</MenuItem>

                                    </Select>
                                </FormControl>
                                <Grid container justifyContent="center" spacing={2}>
                                    <Grid item>
                                        <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                            {selectedType === "Max" ? 'Max' : selectedType === "Min" ? 'Min' : 'Avg'}
                                        </Typography>
                                        <Box sx={{
                                            width: '700px',
                                            height: '400px',
                                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                            textAlign: 'center'
                                        }}>
                                            <canvas id={selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart'} width="700" height="400"></canvas>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '20px',
                                }}>
                                    <Button
                                        variant="contained"
                                        onClick={handlePrediction}
                                        style={{
                                            marginRight: '10px',
                                            marginTop: '10px',
                                            marginBottom: '20px',
                                            backgroundColor: '#CCFF00',
                                            color: '#55565B',
                                        }}
                                    >
                                        Run
                                    </Button>
                                    <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary" sx={{ flexGrow: 1 }}>
                                        Run the algorithm
                                    </Typography>
                                    <Box sx={{ marginRight: '10px', marginLeft: '10px' }}>
                                        {predictionData &&
                                            <ExportToExcel data={predictionData || []} fileName="epredictionResults" />
                                        }
                                    </Box>

                                </Box>
                            </Box>
                        </Paper>

                    </Paper>
                </Grid>
            </Grid>
            {/*<Footer></Footer>*/}
        </div>
    );
};

export default SensorDetailsView;
