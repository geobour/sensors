import React, {useEffect, useRef, useState} from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from "axios";
import {useQuery} from 'react-query';
import {SensorDataDto, SensorDto} from "../api/ApiSensor";
import {useParams} from "react-router-dom";
import Footer from "../layout/Footer";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material/index";

interface BarChartProps {
    className?: string;
}

const BarChartAvg: React.FC<BarChartProps> = ({className}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const {sensorId} = useParams<{ sensorId: string }>();
    const [type, setType] = useState('');
    const [year, setYear] = useState<number>(2025);

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
    const {data: sensorData, isLoading, isError} = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, 2025],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/2025`);
            return response.data;
        }
    );

    const handleChangeYear = (event: SelectChangeEvent<number>) => {
        setYear(Number(event.target.value));
    };

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            window.location.reload();
        }, 60000); // Refresh the page every 2 minutes
        console.log("rendering the page every 2 minutes")
        return () => clearInterval(refreshInterval);
    }, []);

    useEffect(() => {
        if (chartRef.current && sensorData && sensorData.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const filteredData = sensorData.filter(data => data.month !== undefined);
                const labels = filteredData.map(data => getMonthName(data.month!)); // Map numeric months to month names
                const avgValues = filteredData.map(data => data.averageValue || 0);

                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Average Values',
                                data: avgValues,
                                backgroundColor: 'rgba(255, 206, 86, 0.2)', // Yellow background color
                                borderColor: 'rgba(255, 206, 86, 1)', // Yellow border color
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'category',
                                position: 'bottom',
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        // Check the measurement type and format accordingly
                                        if (type === 'temperature') {
                                            return value + ' °C';  // Celsius symbol for temperature
                                        } else if (type === 'humidity') {
                                            return value + ' %';  // Percentage symbol for humidity
                                        }
                                        return value; // Fallback if measurement type is neither
                                    }
                                }
                            },
                        },
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [sensorData, type]);

    // Function to get month name from month number
    const getMonthName = (monthNumber: number) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber - 1];
    };

    return (
        <div
            className="barChart"
            style={{
                overflowY: 'hidden',
                backgroundColor: '#cccccc',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '20px',
                minHeight: '100vh',
            }}
        >
            <FormControl
                sx={{
                    m: 2,
                    minWidth: 120,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)', // Yellow background color
                    borderRadius: 2,
                    color: '#333',
                    marginBottom: '16px',

                }}
            >
                <InputLabel id="year-label" sx={{color: '#333'}}>
                    Year
                </InputLabel>
                <Select
                    labelId="year-label"
                    id="year-select"
                    value={year}
                    onChange={handleChangeYear}
                    autoWidth
                    label="Year"
                    sx={{
                        color: '#333',
                        '& .MuiSelect-icon': {color: '#333'},
                    }}
                >
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2022}>2022</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2019}>2019</MenuItem>
                    <MenuItem value={2018}>2018</MenuItem>
                    <MenuItem value={2017}>2017</MenuItem>
                    <MenuItem value={2016}>2016</MenuItem>
                    <MenuItem value={2015}>2015</MenuItem>
                    <MenuItem value={2014}>2014</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={6} justifyContent="center" alignItems="center" style={{width: '100%'}}>
                <Grid item xs={12} md={10} lg={8} style={{height: 'auto', maxWidth: '100%'}}>
                    {isLoading ? (
                        <p style={{color: '#fff'}}>Loading...</p>
                    ) : isError ? (
                        <p style={{color: '#fff'}}>Error: Failed to fetch data. Please try again.</p>
                    ) : (
                        <Paper elevation={6} sx={{
                            marginTop: 2,
                            padding: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#cccccc',
                            marginBottom: '16px', // Moves chart slightly up

                        }}>
                            <canvas ref={chartRef}/>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default BarChartAvg;


