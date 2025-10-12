import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import Footer from '../layout/Footer';
import { useLineChartData } from '../hooks/useSensorData';
import { LineChartProps } from "../api/ApiSensor";

const LineChart: React.FC<LineChartProps> = ({ className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<'line'> | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();
    const { data: sensorData = [], isLoading, isError } = useLineChartData(sensorId || '');

    useEffect(() => {
        if (chartRef.current && sensorData.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            if (!ctx) return;

            const labels = sensorData.map(data => data.time);
            const values = sensorData.map(data => data.value);

            if (chartInstance.current) chartInstance.current.destroy();

            // @ts-ignore
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Hourly Values',
                            data: values,
                            fill: false,
                            borderColor: '#FFD700',
                            borderWidth: 2,
                            pointBackgroundColor: '#FFD700',
                            pointRadius: 4,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: { type: 'category', position: 'bottom' },
                        y: { beginAtZero: false },
                    },
                },
            });
        }

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [sensorData]);

    return (
        <div
            className={className || 'lineChart'}
            style={{
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'whitesmoke',
            }}
        >
            <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={10} md={8}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p>Error: Failed to fetch data.</p>
                    ) : (
                        <Paper
                            elevation={6}
                            sx={{
                                marginTop: 10,
                                marginBottom: 30,
                                padding: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <canvas ref={chartRef} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
            <Footer />
        </div>
    );
};

export default LineChart;
