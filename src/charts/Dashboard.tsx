import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Footer from "../layout/Footer";
import axios from "axios";
import { SensorDto } from "../api/ApiSensor";
import Grid from '@mui/material/Grid'; // Import MUI Grid component
import Typography from '@mui/material/Typography'; // Import MUI Typography component
// import { format } from 'date-fns'; // Import format function from date-fns

const ChartGrid: React.FC = () => {
    const ChartComponent: React.FC<{ data: any, options: any }> = ({ data, options }) => {
        const chartRef = useRef<HTMLCanvasElement>(null);
        const chartInstanceRef = useRef<Chart<'bar'> | null>(null);

        useEffect(() => {
            if (chartRef.current && data) {
                const ctx = chartRef.current.getContext('2d');

                if (ctx) {
                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                    }

                    chartInstanceRef.current = new Chart(ctx, {
                        type: 'bar',
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
        const pieChartInstanceRef = useRef<Chart<'pie'> | null>(null);

        useEffect(() => {
            if (pieChartRef.current && data) {
                const ctx = pieChartRef.current.getContext('2d');

                if (ctx) {
                    if (pieChartInstanceRef.current) {
                        pieChartInstanceRef.current.destroy();
                    }

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

    const [sensorData, setSensorData] = useState<SensorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        axios.get<SensorDto[]>('http://localhost:8080/api/sensor/show-sensors')
            .then(response => {
                setSensorData(response.data);
                console.log(JSON.stringify(response.data, null, 2));
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const activeCount = sensorData.filter(sensor => sensor.status).length;
    const inactiveCount = sensorData.length - activeCount;

    const pieChartData = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                data: [activeCount, inactiveCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    display: false, // Hide the Y-axis ticks
                },
                grid: {
                    display: false, // Hide the Y-axis grid lines
                },
            },
            x: {
                grid: {
                    display: false, // Optionally hide the X-axis grid lines
                },
            },
        },
        plugins: {
            legend: {
                display: true, // Display the legend
            },
        },
    };

    const barChartData = {
        labels: sensorData.map(sensor => sensor.name),
        datasets: [
            {
                label: 'Sensor Status',
                data: sensorData.map(sensor => sensor.status ? 1 : 0),
                backgroundColor: sensorData.map(sensor => sensor.status ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
                borderColor: sensorData.map(sensor => sensor.status ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 1,
            },
        ],
    };

    // Get current time and date
    // const now = new Date();
    // const formattedDate = format(now, 'MMMM dd, yyyy');
    // const formattedTime = format(now, 'HH:mm:ss');

    return (
        <div>
            <Grid container spacing={2} style={{ marginTop: '20px', margin: '20px' }}>
                {/*<Grid item xs={4}>*/}
                {/*    <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>*/}
                {/*        <Typography variant="h6" gutterBottom>Current Date and Time</Typography>*/}
                {/*        <Typography variant="body1">{formattedDate}</Typography>*/}
                {/*        <Typography variant="body1">{formattedTime}</Typography>*/}
                {/*    </div>*/}
                {/*</Grid>*/}
                <Grid item xs={8}>
                    <div style={{ height: '300px' }}>
                        <PieChartComponent
                            data={pieChartData}
                            options={pieChartOptions}
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px', margin: '20px' }}>
                <Grid item xs={12}>
                    <div style={{ height: '300px' }}>
                        <ChartComponent
                            data={barChartData}
                            options={barChartOptions}
                        />
                    </div>
                </Grid>
            </Grid>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
};

export default ChartGrid;
