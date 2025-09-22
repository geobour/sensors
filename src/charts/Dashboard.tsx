import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { useDashboardData } from '../hooks/useDashboardData';
import MapBoxMany from "../map/MapBoxMany";

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
                <Typography variant="h6" gutterBottom style={{ color: '#fff' }}>Current Date and Time</Typography>
                <Typography variant="body1" style={{ color: '#fff' }}>{currentDateTime.date}</Typography>
                <Typography variant="body1" style={{ color: '#fff' }}>{currentDateTime.time}</Typography>
            </div>
        </div>
    );
};

const ChartComponent: React.FC<{ data: any, options: any }> = React.memo(({ data, options }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart<'bar'> | null>(null);

    useEffect(() => {
        if (chartRef.current && data) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstanceRef.current) chartInstanceRef.current.destroy();
                chartInstanceRef.current = new Chart(ctx, { type: 'bar', data, options });
            }
        }
        return () => chartInstanceRef.current?.destroy();
    }, [data, options]);

    return <canvas ref={chartRef}></canvas>;
});

const PieChartComponent: React.FC<{ data: any, options: any }> = React.memo(({ data, options }) => {
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartInstanceRef = useRef<Chart<'pie'> | null>(null);

    useEffect(() => {
        if (pieChartRef.current && data) {
            const ctx = pieChartRef.current.getContext('2d');
            if (ctx) {
                if (pieChartInstanceRef.current) pieChartInstanceRef.current.destroy();
                pieChartInstanceRef.current = new Chart(ctx, { type: 'pie', data, options });
            }
        }
        return () => pieChartInstanceRef.current?.destroy();
    }, [data, options]);

    return <canvas ref={pieChartRef}></canvas>;
});

const ChartGrid: React.FC = React.memo(() => {
    const { sensorsQuery, valuesQuery, checkStatusMutation } = useDashboardData();

    if (sensorsQuery.isLoading || valuesQuery.isLoading) return <div>Loading...</div>;
    if (sensorsQuery.isError || valuesQuery.isError) return <div>Error loading data</div>;

    const sensorData = sensorsQuery.data!;
    const values = valuesQuery.data!;

    const handleCheckStatus = async () => {
        await checkStatusMutation.mutateAsync();
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { color: '#fff' } } },
    };

    const activeCount = sensorData.filter((s: { status: any }) => s.status).length;
    const inactiveCount = sensorData.length - activeCount;

    const pieChartData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [activeCount, inactiveCount],
            backgroundColor: ['rgba(75,192,192,0.2)', 'rgba(255,99,132,0.2)'],
            borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
            borderWidth: 1
        }],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#fff',
                    stepSize: 1,
                    callback: (value: any) => (value === 0 || value === 1 ? value : ''),
                },
                grid: { display: false }
            },
            x: {
                ticks: { color: '#fff' },
                grid: { display: false }
            }
        },
        plugins: { legend: { display: true, labels: { color: '#fff' } } },
    };

    const barChartData = {
        labels: sensorData.map((s: { name: string }) =>
            (s.name.length > 10 ? `${s.name.substring(0, 10)}...` : s.name)
        ),
        datasets: [{
            label: 'Sensor Status',
            data: sensorData.map((s: { status: any }) => (s.status ? 1 : 0.5)),
            backgroundColor: sensorData.map((s: { status: any }) =>
                (s.status ? 'rgba(75,192,192,0.2)' : 'rgba(255,99,132,0.2)')
            ),
            borderColor: sensorData.map((s: { status: any }) =>
                (s.status ? 'rgba(75,192,192,1)' : 'rgba(255,99,132,1)')
            ),
            borderWidth: 1,
            maxBarThickness: 50,
        }],
    };

    return (
        <div style={{ backgroundColor: '#333', minHeight: '100vh', padding: '20px' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: '20px' }}>
                <Grid item xs={4}><Clock /></Grid>
                <Grid item xs={4}><MapBoxMany /></Grid>

                <Grid item xs={4}>
                    <div style={{ height: '300px' }}>
                        <PieChartComponent data={pieChartData} options={pieChartOptions} />
                    </div>
                </Grid>
                <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button onClick={handleCheckStatus} variant="contained" color="error" style={{ padding: '10px 20px' }}>
                        Check Status
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                <Grid item xs={12}>
                    <div style={{ height: '300px' }}>
                        <ChartComponent data={barChartData} options={barChartOptions} />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {values.map((value: any, index: React.Key | null | undefined) => (
                    <Grid key={index} item xs={2}>
                        <div style={{
                            backgroundColor: 'rgba(75,192,192,0.2)',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            height: '150px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff'
                        }}>
                            <div>
                                <Tooltip title={value.name} placement="top" arrow>
                                    <Typography variant="h6" gutterBottom style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '100px'
                                    }}>{value.name}</Typography>
                                </Tooltip>
                                <Typography variant="body1">
                                    {value.type === 'temperature' && `${value.currentValue}°C`}
                                    {value.type === 'humidity' && `${parseFloat(String(value.currentValue)).toFixed(1)}%`}
                                    {value.type !== 'temperature' && value.type !== 'humidity' && value.currentValue}
                                </Typography>
                                <Tooltip title={value.type} placement="top" arrow>
                                    <Typography variant="h6" gutterBottom style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        width: '100px'
                                    }}>{value.type}</Typography>
                                </Tooltip>
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>

            <div style={{ height: '100px' }}></div>
        </div>
    );
});

export default ChartGrid;
