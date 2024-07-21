import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import Footer from "../layout/Footer";
import { Grid } from '@mui/material'; // Import Grid from Material-UI

const ChartGrid: React.FC = () => {
    const ChartComponent: React.FC<{ data: any, options: any }> = ({ data, options }) => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstanceRef = useRef<Chart | null>(null);

        useEffect(() => {
            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');

                if (ctx) {
                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                    }

                    chartInstanceRef.current = new Chart(ctx, {
                        type: 'bar', // Changed this to 'bar'
                        data,
                        options,
                    });
                }
            }

            return () => {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                }
            };
        }, [data, options]);

        return <canvas ref={chartRef}></canvas>;
    };

    const PieChartComponent: React.FC<{ data: any, options: any }> = ({ data, options }) => {
        const pieChartRef = useRef<HTMLCanvasElement>(null);
        const pieChartInstanceRef = useRef<Chart | null>(null);

        useEffect(() => {
            if (pieChartRef.current) {
                const ctx = pieChartRef.current.getContext('2d');

                if (ctx) {
                    if (pieChartInstanceRef.current) {
                        pieChartInstanceRef.current.destroy();
                    }
                    // @ts-ignore
                    pieChartInstanceRef.current = new Chart(ctx, {
                        type: 'pie',
                        data,
                        options,
                    });
                }
            }

            return () => {
                if (pieChartInstanceRef.current) {
                    pieChartInstanceRef.current.destroy();
                }
            };
        }, [data, options]);

        return <canvas ref={pieChartRef}></canvas>;
    };

    const [sensorData, setSensorData] = useState<any[]>([]); // State to hold sensor data

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sensor/all');
                setSensorData(response.data); // Assuming response.data is an array of sensor data objects
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        fetchSensorData();
    }, []);

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div>
            <Grid container spacing={2} style={{ margin: '20px' }}>
                {sensorData.map((sensor, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <div style={{ height: '300px' }}>
                            <ChartComponent data={sensor.chartData} options={barChartOptions} />
                        </div>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} style={{ marginTop: '20px', margin: '20px' }}>
                {sensorData.map((sensor, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <div style={{ height: '300px' }}>
                            <PieChartComponent data={sensor.pieChartData} options={pieChartOptions} />
                        </div>
                    </Grid>
                ))}
            </Grid>

            <div style={{ height: '100px' }}></div> {/* Gap between the charts and the footer */}
            <Footer />
        </div>
    );
};

export default ChartGrid;
