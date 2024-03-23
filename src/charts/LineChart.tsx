import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from "axios";
import {SensorRecordDto} from "../api/ApiSensor";
import {useParams} from "react-router-dom";

interface LineChartProps {
    className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [sensorData, setSensorData] = useState<SensorRecordDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<SensorRecordDto[]>(`http://localhost:8080/api/sensor/reports/get-daily-data?sensorId=${sensorId}`);
                setSensorData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again.');
                setLoading(false); // Stop loading state in case of error
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chartRef.current && sensorData.length > 0) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const labels = sensorData.map(data => data.time);
                const temperatures = sensorData.map(data => data.temperature);

                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Hourly Temperatures',
                                data: temperatures,
                                fill: false,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                                pointRadius: 4,
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

    return (
        <div className={"lineChart"} style={{ marginTop: '100px', flex: "max-content" }}>
            <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <Paper className={className}>
                            <canvas ref={chartRef} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default LineChart;
