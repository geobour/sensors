import React, {useEffect, useRef, useState} from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useQuery } from 'react-query';
import {SensorDataDto, SensorDto} from "../api/ApiSensor";
import { useParams } from "react-router-dom";
import Footer from "../layout/Footer";

interface BarChartProps {
    className?: string;
}

const BarChartMin: React.FC<BarChartProps> = ({ className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();
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

    const { data: sensorData, isLoading, isError } = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, 2024],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/2024`);
            return response.data;
        }
    );

    // Use effect for refreshing the page every 2 minutes
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
                const filteredData = sensorData.filter(data => data.month !== undefined); // Filter out entries with undefined month
                const labels = filteredData.map(data => getMonthName(data.month!)); // Map numeric months to month names
                const minValues = filteredData.map(data => data.minValue || 0);

                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Minimum Values',
                                data: minValues,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue background color
                                borderColor: 'rgba(54, 162, 235, 1)', // Blue border color
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
                                    callback: function(value) {
                                        // Check the type and format accordingly
                                        if (type === 'temperature') {
                                            return value + ' °C';  // Celsius symbol for temperature
                                        } else if (type === 'humidity') {
                                            return value + ' %';  // Percentage symbol for humidity
                                        }
                                        return value; // Fallback if type is neither
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
    }, [sensorData, type]); // Add type to dependencies

    // Function to get month name from month number
    const getMonthName = (monthNumber: number) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber - 1];
    };

    return (
        <div className={"barChart"} style={{ overflowY: 'hidden', backgroundColor: '#333', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid container spacing={6} justifyContent="center" alignItems="center" style={{ height: '100%', width: '100%' }}>
                <Grid item xs={12} md={10} lg={8} style={{ height: 'auto', maxWidth: '100%' }}>
                    {isLoading ? (
                        <p style={{ color: '#fff' }}>Loading...</p>
                    ) : isError ? (
                        <p style={{ color: '#fff' }}>Error: Failed to fetch data. Please try again.</p>
                    ) : (
                        <Paper elevation={6} sx={{
                            marginTop: 10,
                            marginBottom: 30,
                            padding: 3,
                            backgroundColor: 'lightgray',                            height: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <canvas ref={chartRef} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
            <Footer />
        </div>
    );
};

export default BarChartMin;
