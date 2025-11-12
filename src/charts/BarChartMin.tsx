import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useSensorData } from "../hooks/useSensorData";

const BarChartMin: React.FC = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { sensorId } = useParams<{ sensorId: string }>();
    const [year, setYear] = useState<number>(2025);
    const { sensorData, isLoading, isError, refetch } = useSensorData(sensorId || '', year);

    const handleChangeYear = (event: SelectChangeEvent<number>) => {
        const newYear = Number(event.target.value);
        setYear(newYear);
        refetch();
    };

    useEffect(() => {
        if (!chartRef.current || !sensorData || sensorData.length === 0) return;

        if (chartInstance.current) chartInstance.current.destroy();

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        const filteredData = sensorData.filter(data => data.month !== undefined);
        const labels = filteredData.map(data => getMonthName(data.month!));
        const minValues = filteredData.map(data => data.minValue || 0);

        const chartType = filteredData[0]?.type || 'temperature';

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Minimum Values',
                        data: minValues,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: { type: 'category', position: 'bottom' },
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function (value) {
                                if (chartType === 'temperature') return value + ' °C';
                                if (chartType === 'humidity') return value + ' %';
                                return value;
                            },
                        },
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) chartInstance.current.destroy();
        };
    }, [sensorData]);

    const getMonthName = (monthNumber: number) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        return months[monthNumber - 1];
    };

    return (
        <div
            className="barChart"
            style={{
                backgroundColor: 'whitesmoke',
                overflowY: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '20px',
                minHeight: '100vh',
            }}
        >
            <FormControl sx={{ m: 2, minWidth: 120, borderRadius: 2 }}>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                    labelId="year-label"
                    id="year-select"
                    value={year}
                    onChange={handleChangeYear}
                    autoWidth
                    label="Year"
                    sx={{ backgroundColor: 'white' }}
                >
                    {[2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={6} justifyContent="center" alignItems="center" style={{ width: '100%' }}>
                <Grid item xs={12} md={10} lg={8}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p>Error: Failed to fetch data. Please try again.</p>
                    ) : (
                        <Paper
                            elevation={6}
                            sx={{
                                marginTop: 2,
                                padding: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '16px',
                                backgroundColor: 'white',
                            }}
                        >
                            <canvas ref={chartRef} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default BarChartMin;
