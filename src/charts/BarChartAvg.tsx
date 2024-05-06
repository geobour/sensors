import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useQuery } from 'react-query';
import { SensorDataDto } from "../api/ApiSensor";
import { useParams } from "react-router-dom";
import Footer from "../layout/Footer";

interface BarChartProps {
    className?: string;
}

const BarChartAvg: React.FC<BarChartProps> = ({ className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();

    const { data: sensorData, isLoading, isError } = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, 2024],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/2024`);
            return response.data;
        }
    );

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
    }, [sensorData]);

    // Function to get month name from month number
    const getMonthName = (monthNumber: number) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber - 1];
    };

    return (
        <div className={"barChart"} style={{ marginTop: '100px', flex: "max-content" }}>
            <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p>Error: Failed to fetch data. Please try again.</p>
                    ) : (
                        <Paper className={className}>
                            <canvas ref={chartRef} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
            <Footer></Footer>
        </div>
    );
};

export default BarChartAvg;
