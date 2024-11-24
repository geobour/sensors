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
    SelectChangeEvent
} from '@mui/material';
import axios from 'axios';
import {SensorDto, FileData, SensorDataDto, PredictionData} from "../api/ApiSensor";
import Chart from "chart.js/auto";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import FileSaver from "file-saver";
import Tooltip from '@mui/material/Tooltip';
const SensorDetailsView: React.FC = () => {
    const {sensorId} = useParams<{ sensorId: string }>();
    const [year, setYear] = useState<number>(2024);
    const navigate = useNavigate();
    const [minValues, setMinValues] = useState<number[]>([]);
    const [maxValues, setMaxValues] = useState<number[]>([]);
    const [avgValues, setAvgValues] = useState<number[]>([]);
    const [avgSensorValues, setSensorAvgValues] = useState<number[]>([]);
    const [minSensorValues, setSensorMinValues] = useState<number[]>([]);
    const [maxSensorValues, setSensorMaxValues] = useState<number[]>([]);
    const [predictionData, setPredictionData] = useState<PredictionData>();
    const [selectedType, setSelectedType] = useState('');
    // const [selectedYear, setSelectedYear] = useState('');
    const [type, setType] = useState('');

    const {data: sensors} = useQuery<SensorDto, Error>(
        ['sensorData', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(
                `http://localhost:8080/api/sensor/get-sensor/${sensorId}`
            );
            setType(response.data.type)
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


    const handleChangeYear = (event: SelectChangeEvent<number>) => {
        setYear(Number(event.target.value)); // Convert value to a number
    };

    const {data: sensorData, isLoading, isError} = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, year],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/${year}`);
            const avgSensorValues: number[] = response.data.map((item: SensorDataDto) => item.averageValue || 0);
            setSensorAvgValues(avgSensorValues);
            const minSensorValues: number[] = response.data.map((item: SensorDataDto) => item.minValue || 0);
            setSensorMinValues(minSensorValues);
            const maxSensorValues: number[] = response.data.map((item: SensorDataDto) => item.maxValue || 0);
            setSensorMaxValues(maxSensorValues);
            return response.data;
        }
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };
    const handleChangeType = (event: SelectChangeEvent<string>) => {
        setSelectedType(event.target.value);
    };

    // const handleChangeYear = (event: SelectChangeEvent<string>) => {
    //     setSelectedYear(event.target.value);
    // };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            handleUpload(file); 
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

    const [isNoDataDialogOpen, setIsNoDataDialogOpen] = useState(false);





    const handleNoDataDialogClose = () => {
        setIsNoDataDialogOpen(false);
    };

    useEffect(() => {
        const renderChart = () => {
            const ctx = document.getElementById(selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart');
            if (ctx) {
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
                                data: Object.values(predictionData || {}),
                                fill: false,
                                borderColor: 'rgb(0, 128, 0)',
                                tension: 0.1
                            },
                            {
                                label: selectedType === "Max" ? 'Sensor Values (Max)' : selectedType === "Min" ? 'Sensor Values (Min)' : 'Sensor Values (Avg)',
                                data: selectedType === "Max" ? maxSensorValues : selectedType === "Min" ? minSensorValues : avgSensorValues,
                                fill: false,
                                borderColor: selectedType === "Max" ? 'rgb(255, 99, 132)' : selectedType === "Min" ? 'rgb(70, 130, 180)' : 'rgb(255, 165, 0)', // Redish, Bluish, Orange
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

                                        if (type === 'temperature') {
                                            return value + ' °C';
                                        } else if (type === 'humidity') {
                                            return value + ' %';
                                        }
                                        return value;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        };

        renderChart();
    }, [selectedType, maxSensorValues, minSensorValues, avgSensorValues, predictionData, type]);
    const handleDownloadTemplate = () => {
        const csvHeaders = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const csvContent = csvHeaders.join(",") + "\n";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, 'template.csv');
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <div style={{overflowY: 'hidden'}}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={6} sx={{padding: 3, backgroundColor: '#333'}}>
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
                                                    ID
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Area
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Latitude
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Longitude
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Type
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Topic
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                    Status
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <Tooltip title={sensors?.id || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px', // Adjust width as needed
                                }}
                            >
                                {sensors?.id}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.name || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.name}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.area || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.area}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.latitude || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.latitude}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.longitude || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.longitude}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.type || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.type}
                            </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title={sensors?.topic || ''} arrow>
                            <span
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                    maxWidth: '100px',
                                }}
                            >
                                {sensors?.topic}
                            </span>
                                                </Tooltip>
                                            </TableCell>
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
                                        backgroundColor: '#BC13FE',
                                        color: 'black',
                                    }}
                                >
                                    Map
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleLineChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#BC13FE',
                                        color: 'black',
                                    }}
                                >
                                    Graph
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleMinChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#BC13FE',
                                        color: 'black',
                                    }}
                                >
                                    Min
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleMaxChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#BC13FE',
                                        color: 'black',
                                    }}
                                >
                                    Max
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAvgChart}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '20px',
                                        backgroundColor: '#BC13FE',
                                        color: 'black',
                                    }}
                                >
                                    Avg
                                </Button>
                            </div>
                        </Paper>

                        <Box sx={{marginBottom: '20px'}}></Box>
                        <Paper elevation={6} sx={{padding: 3, backgroundColor: 'lightgray'}}>
                            <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                Upload file
                            </Typography>

                            <input type="file" accept=".xlsx, .xls" onChange={handleChange}/>
                            <Box sx={{marginTop: '10px'}}>
                                <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary">
                                    Select metric/year
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl sx={{m: 1, minWidth: 100}}>
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
                                            value={year}
                                            onChange={handleChangeYear}
                                            autoWidth
                                            label="Year"
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={2024}>Current</MenuItem>
                                            <MenuItem value={2023}>Previous</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <IconButton
                                        onClick={handleDownloadTemplate}
                                        style={{
                                            marginRight: '10px',
                                            marginTop: '10px',
                                            marginBottom: '10px',
                                            color: 'black',
                                        }}
                                    >
                                        <CloudDownloadIcon />
                                        <Typography style={{ marginLeft: '5px' }}>Download Template</Typography>
                                    </IconButton>
                                <IconButton
                                    onClick={handleDialogOpen}
                                    style={{
                                        marginRight: '10px',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        color: 'black',
                                    }}
                                >
                                    <InfoIcon/>
                                    <Typography>Info</Typography>
                                </IconButton>
                                <Dialog
                                    open={isDialogOpen}
                                    onClose={handleDialogClose}
                                    sx={{'& .MuiDialog-paper': {width: '600px', height: '500px'}}}
                                >
                                    <DialogTitle>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                              Upload File Instructions
                                        </Typography>
                                    </DialogTitle>
                                    <DialogContent>
                                        <Typography variant="body1">
                                            In the first row of the Excel file, list the months starting with January, followed by February, and so on. In the subsequent rows, fill in the cells with values. Each row represents a year. For example, if you want to provide data from the last ten years in a specific place, start with 2014 in the second row and continue accordingly.
                                            <br /><br />
                                            If the values you inserted are of type "Average" select the appropriate metric type from the dropdown, and after uploading the file, press the "Run" button. To download the results as a CSV file, click the "Export" button
                                        </Typography>
                                        <DialogTitle>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                Algorithm
                                            </Typography>
                                        </DialogTitle>
                                        <Typography variant="body1">
                                            The algorithm uses linear regression with one variable to predict the next values for each month and displays them in a diagram. The diagram also shows the current month's values from the selected sensor, corresponding to the location from which the data was collected. This allows you to compare the predicted values with the actual sensor data.
                                        </Typography>
                                    </DialogContent>
                                </Dialog>
                                </Box>
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
                                            <canvas
                                                id={selectedType === "Max" ? 'maxChart' : selectedType === "Min" ? 'minChart' : 'avgChart'}
                                                width="700" height="400"></canvas>
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
                                            backgroundColor: ' #BC13FE',
                                            color: 'black',
                                        }}
                                    >
                                        Run
                                    </Button>
                                    <Typography variant="h5" padding={1} fontWeight="bold" color="text.secondary"
                                                sx={{flexGrow: 1}}>
                                        Run the algorithm
                                    </Typography>
                                    <Box sx={{marginRight: '10px', marginLeft: '10px'}}>
                                        {predictionData &&
                                            <ExportToExcel data={predictionData || []} fileName="predictionResults"/>
                                        }
                                    </Box>

                                </Box>
                                {/* Dialog for No Data */}
                                <Dialog
                                    open={isNoDataDialogOpen}
                                    onClose={handleNoDataDialogClose}
                                    aria-labelledby="no-data-dialog-title"
                                >
                                    <DialogTitle id="no-data-dialog-title">
                                        No Previous Year Data
                                    </DialogTitle>
                                    <DialogContent>
                                        <Typography>
                                            There is no data available for the selected previous year. Please upload the required data or select another option.
                                        </Typography>
                                    </DialogContent>
                                </Dialog>
                            </Box>
                        </Paper>

                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default SensorDetailsView;
