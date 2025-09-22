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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
    Box,
    Dialog,
    DialogContent, DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    IconButton,
    Tooltip
} from '@mui/material';
import axios from 'axios';
import { SensorDto, FileData, SensorDataDto, PredictionData } from "../api/ApiSensor";
import Chart from "chart.js/auto";
import InfoIcon from '@mui/icons-material/Info';
import FileSaver from "file-saver";

const SensorDetailsView: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const [year, setYear] = useState<number>(2025);
    const navigate = useNavigate();
    const [minValues, setMinValues] = useState<number[]>([]);
    const [maxValues, setMaxValues] = useState<number[]>([]);
    const [avgValues, setAvgValues] = useState<number[]>([]);
    const [avgSensorValues, setSensorAvgValues] = useState<number[]>([]);
    const [minSensorValues, setSensorMinValues] = useState<number[]>([]);
    const [maxSensorValues, setSensorMaxValues] = useState<number[]>([]);
    const [predictionData, setPredictionData] = useState<PredictionData>();
    const [selectedType, setSelectedType] = useState('');
    const [type, setType] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isNoDataDialogOpen, setIsNoDataDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data: sensors } = useQuery<SensorDto, Error>(
        ['sensorData', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(`http://localhost:8080/api/sensor/get-sensor/${sensorId}`);
            setType(response.data.type);
            return response.data;
        }
    );

    const { data: sensorData, isLoading, isError } = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, year],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/${year}`);
            setSensorAvgValues(response.data.map(item => item.averageValue || 0));
            setSensorMinValues(response.data.map(item => item.minValue || 0));
            setSensorMaxValues(response.data.map(item => item.maxValue || 0));
            return response.data;
        }
    );

    const handleChangeYear = (event: SelectChangeEvent<number>) => setYear(Number(event.target.value));
    const handleChangeType = (event: SelectChangeEvent<string>) => setSelectedType(event.target.value);

    const handlePrediction = async () => {
        try {
            const response = await axios.get<PredictionData>('http://localhost:8080/api/predict');
            setPredictionData(response.data);
        } catch (error) {
            console.error('Error loading prediction data:', error);
        }
    };

    const handleDialogOpen = () => setIsDialogOpen(true);
    const handleDialogClose = () => setIsDialogOpen(false);
    const handleNoDataDialogClose = () => setIsNoDataDialogOpen(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            const allowedExtensions = /(\.xlsx|\.xls|\.ods)$/i;

            if (!allowedExtensions.exec(file.name)) {
                setErrorMessage("Invalid file format. Please upload an Excel (.xlsx, .xls) or LibreOffice (.ods) file.");
                setIsErrorDialogOpen(true);
                return;
            }

            handleUpload(file);
        }
    };




    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.put<FileData[]>(`http://localhost:8080/api/sensor/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMinValues(response.data.map(d => d.min ?? 0));
            setMaxValues(response.data.map(d => d.max ?? 0));
            setAvgValues(response.data.map(d => d.avg ?? 0));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    const handleMap = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigate(`/sensors/${sensorId}/map`);
    };

    const handleLineChart = (e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); navigate(`line-chart`); };
    const handleMinChart = (e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); navigate(`bar-chart-min`); };
    const handleMaxChart = (e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); navigate(`bar-chart-max`); };
    const handleAvgChart = (e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); navigate(`bar-chart-avg`); };

    const handleDownloadTemplate = () => {
        const csvHeaders = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const blob = new Blob([csvHeaders.join(',') + "\n"], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, 'template.csv');
    };

    useEffect(() => {
        const renderChart = () => {
            const ctx = document.getElementById(selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart');
            if (!ctx) return;
            // @ts-ignore
            const existingChart = Chart.getChart(ctx);
            if (existingChart) existingChart.destroy();

            // @ts-ignore
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    datasets: [
                        {
                            label: 'Prediction Values',
                            data: Object.values(predictionData || {}),
                            fill: false,
                            borderColor: 'rgb(0,128,0)',
                            tension: 0.1
                        },
                        {
                            label: selectedType === "Max" ? 'Sensor Values (Max)' : selectedType === "Min" ? 'Sensor Values (Min)' : 'Sensor Values (Avg)',
                            data: selectedType === "Max" ? maxSensorValues : selectedType === "Min" ? minSensorValues : avgSensorValues,
                            fill: false,
                            borderColor: selectedType === "Max" ? 'rgb(255,99,132)' : selectedType === "Min" ? 'rgb(70,130,180)' : 'rgb(255,165,0)',
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (type === 'temperature') return value + ' °C';
                                    if (type === 'humidity') return value + ' %';
                                    return value;
                                }
                            }
                        }
                    }
                }
            });
        };

        renderChart();
    }, [selectedType, maxSensorValues, minSensorValues, avgSensorValues, predictionData, type]);

    return (
        <div>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={6} sx={{ padding: 3 }}>
                        <Typography variant="h5" padding={2} fontWeight="bold" color="text.secondary">
                            Sensor Details
                        </Typography>
                        <Divider />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {['ID','Name','Area','Latitude','Longitude','Type','Topic','Status'].map(col => (
                                            <TableCell key={col} sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                                {col}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        {[sensors?.id, sensors?.name, sensors?.area, sensors?.latitude, sensors?.longitude, sensors?.type, sensors?.topic].map((val, i) => (
                                            <TableCell key={i}>
                                                <Tooltip title={val || ''} arrow>
                                                    <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'block', maxWidth:'100px' }}>{val}</span>
                                                </Tooltip>
                                            </TableCell>
                                        ))}
                                        <TableCell style={{ color: sensors?.status ? 'green' : 'red' }}>
                                            {sensors?.status ? 'Active' : 'Inactive'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{ my: 2 }} />

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                onClick={handleMap}
                                sx={{
                                    backgroundColor: '#D3A1FF',
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: '#c089f2' },
                                }}
                            >
                                Map
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleLineChart}
                                sx={{
                                    backgroundColor: '#D3A1FF',
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: '#c089f2' },
                                }}
                            >
                                Graph
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleMinChart}
                                sx={{
                                    backgroundColor: '#D3A1FF',
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: '#c089f2' },
                                }}
                            >
                                Min
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleMaxChart}
                                sx={{
                                    backgroundColor: '#D3A1FF',
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: '#c089f2' },
                                }}
                            >
                                Max
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleAvgChart}
                                sx={{
                                    backgroundColor: '#D3A1FF',
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: '#c089f2' },
                                }}
                            >
                                Avg
                            </Button>
                        </div>


                        <Paper elevation={6} sx={{ padding: 3, mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="text.secondary">
                                Upload File
                            </Typography>
                            <input type="file" accept=".xlsx, .xls" onChange={handleChange} />

                            <Box sx={{ display: 'flex', alignItems:'center', mt:2, gap:2 }}>
                                <FormControl sx={{ minWidth: 100 }}>
                                    <InputLabel>Metric</InputLabel>
                                    <Select value={selectedType} onChange={handleChangeType}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="Max">Max</MenuItem>
                                        <MenuItem value="Min">Min</MenuItem>
                                        <MenuItem value="Avg">Avg</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ minWidth: 100 }}>
                                    <InputLabel>Year</InputLabel>
                                    <Select value={year} onChange={handleChangeYear}>
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value={2025}>Current</MenuItem>
                                        <MenuItem value={2024}>Previous</MenuItem>
                                    </Select>
                                </FormControl>

                                <IconButton onClick={handleDownloadTemplate}>
                                    <CloudDownloadIcon />
                                </IconButton>

                                <IconButton onClick={handleDialogOpen}>
                                    <InfoIcon />
                                </IconButton>
                            </Box>

                            <Box sx={{ width: '700px', height: '400px', mt:2 }}>
                                <canvas id={selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart'} width="700" height="400"></canvas>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={handlePrediction}
                                    sx={{
                                        backgroundColor: '#D3A1FF',
                                        color: 'text.secondary',
                                        mt: 1.2,
                                        '&:hover': {
                                            backgroundColor: '#b87de0',
                                        },
                                    }}
                                >
                                    Run
                                </Button>
                                {predictionData && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.2 }}>
                                        <ExportToExcel
                                            data={predictionData}
                                            fileName="predictionResults"
                                            buttonProps={{
                                                sx: {
                                                    backgroundColor: '#D3A1FF',
                                                    color: 'text.secondary',
                                                    '&:hover': { backgroundColor: '#c089f2' },
                                                },
                                            }}
                                        />
                                    </Box>

                                )}
                            </Box>

                        </Paper>

                        {/* Info Dialog */}
                        <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                            <DialogTitle>Upload File Instructions</DialogTitle>
                            <DialogContent>
                                <Typography variant="body1">
                                    Fill the Excel file with months in first row and data in subsequent rows.
                                    Select metric and run algorithm. Export results as CSV.
                                </Typography>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isNoDataDialogOpen} onClose={handleNoDataDialogClose}>
                            <DialogTitle>No Previous Year Data</DialogTitle>
                            <DialogContent>
                                <Typography>No data available for the selected previous year. Please upload required data.</Typography>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                            <DialogTitle>Error</DialogTitle>
                            <DialogContent>
                                <Typography>{errorMessage}</Typography>
                            </DialogContent>
                        </Dialog>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default SensorDetailsView;
