import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Footer from "../layout/Footer";
import axios from "axios";
import { DashboardDto, SensorDto } from "../api/ApiSensor";
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

// Clock Component
const Clock: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentDateTime({
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'rgba(75, 192, 192, 0.2)', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>
                    Current Date and Time
                </Typography>
                <Typography variant="body1" style={{ color: '#fff' }}>
                    {currentDateTime.date}
                </Typography>
                <Typography variant="body1" style={{ color: '#fff' }}>
                    {currentDateTime.time}
                </Typography>
            </div>
        </div>
    );
};

// Chart Component
const ChartComponent: React.FC<{ data: any, options: any }> = React.memo(({ data, options }) => {
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
});

// Pie Chart Component
const PieChartComponent: React.FC<{ data: any, options: any }> = React.memo(({ data, options }) => {
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
});

// Main ChartGrid Component
const ChartGrid: React.FC = React.memo(() => {
    const [values, setValues] = useState<DashboardDto[]>([]);  // Holds array of DashboardDto
    const [sensorData, setSensorData] = useState<SensorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSensorData = async () => {
        try {
            const response = await axios.get<SensorDto[]>('http://localhost:8080/api/sensor/show-sensors');
            setSensorData(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const fetchValues = async () => {
        try {
            const response = await axios.get<DashboardDto[]>('http://localhost:8080/api/dashboard/current-values');  // Fetch array
            setValues(response.data);  // Set array of DashboardDto
        } catch (error) {
            console.error('Error fetching values:', error);
        }
    };

    useEffect(() => {
        const refreshData = async () => {
            try {
                console.log("Refreshing data...");
                await fetchSensorData();
                await fetchValues();
                console.log("Data refreshed successfully");
            } catch (error) {
                console.error("Error refreshing data:", error);
            }
        };

        // Fetch initial data
        refreshData();

        // Set up an interval to refresh data every 2 minutes
        const interval = setInterval(() => {
            refreshData();
        }, 60 * 1000); // 1 minute in milliseconds

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff',
                },
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
                    color: '#fff',
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#fff',
                },
            },
        },
    };

    const barChartData = {
        labels: sensorData.map(sensor => sensor.name),
        datasets: [
            {
                label: 'Sensor Status',
                data: sensorData.map(sensor => sensor.status ? 1 : 0.5),
                backgroundColor: sensorData.map(sensor => sensor.status ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'),
                borderColor: sensorData.map(sensor => sensor.status ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 1,
            },
        ],
    };

    // Include sensor type in the labels
    const valuesChartData = {
        labels: values.map(value => `${value.name} (${value.type})`),  // Show name and type
        datasets: [
            {
                label: 'Current Values',
                data: values.map(value => value.currentValue),
                backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange background color
                borderColor: 'rgba(255, 165, 0, 1)', // Solid orange border color
                borderWidth: 1,
            },
        ],
    };

    const valuesChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#fff',
                },
                grid: {
                    display: false,
                },
            },
            x: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#fff',
                },
            },
        },
    };

    return (
        <div style={{ backgroundColor: '#333', minHeight: '100vh', padding: '20px' }}>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={6}>
                    <Clock />
                </Grid>
                <Grid item xs={6}>
                    <div style={{ height: '300px' }}>
                        <PieChartComponent
                            data={pieChartData}
                            options={pieChartOptions}
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <div style={{ height: '300px' }}>
                        <ChartComponent
                            data={barChartData}
                            options={barChartOptions}
                        />
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: '300px' }}>
                        <ChartComponent
                            data={valuesChartData}
                            options={valuesChartOptions}
                        />
                    </div>
                </Grid>
            </Grid>
            <div style={{ height: '100px' }}></div>
            <Footer />
        </div>
    );
});

export default ChartGrid;
