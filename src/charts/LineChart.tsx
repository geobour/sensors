import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { SensorRecordDto } from "../api/ApiSensor";
import { useParams } from "react-router-dom";
import Footer from "../layout/Footer";

interface LineChartProps {
    className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart<'line'> | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get<SensorRecordDto[]>(`http://localhost:8080/api/sensor/reports/get-daily-data?sensorId=${sensorId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Failed to fetch data. Please try again.');
        }
    };

    // Track the current date and time
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
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Initialize the chart with the fetched data
    const initializeChart = (sensorData: SensorRecordDto[]) => {
        console.log('Initializing chart with data:', sensorData);

        if (chartRef.current && sensorData.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const labels = sensorData.map(data => data.time);
                const values = sensorData.map(data => data.value);

                // Initialize chart instance
                // @ts-ignore
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
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
    };

    // Load data from the API and initialize the chart
    const loadData = async () => {
        try {
            const data = await fetchData();
            initializeChart(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();

        // Refresh data every 2 minutes (120000 milliseconds)
        const interval = setInterval(() => {
            console.log('Refreshing data...');
            loadData();
        }, 120000); // Refresh every 2 minutes

        // Cleanup on component unmount or chartInstance destruction
        return () => {
            clearInterval(interval);
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [loadData, sensorId]);

    // Handle server-sent events for real-time updates
    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8080/stream-sensor-data`);
        console.log('stream-sensor-data:');

        eventSource.onmessage = (event) => {
            const newData: SensorRecordDto = JSON.parse(event.data);
            console.log('newData:', newData);
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        // Close the EventSource when the component unmounts
        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className="lineChart" style={{ overflowY: 'hidden', backgroundColor: '#333', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                    <Paper elevation={6} sx={{
                        marginTop: 10,
                        marginBottom: 30,
                        padding: 3,
                        backgroundColor: 'lightgray',
                        height: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <canvas ref={chartRef} />
                    </Paper>
                </Grid>
            </Grid>
            <Footer />
        </div>
    );
};

export default LineChart;
