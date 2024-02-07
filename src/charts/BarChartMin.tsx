import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

interface BarChartProps {
    data: number[];
    labels: string[];
    className?: string;
}

const BarChartMin: React.FC<BarChartProps> = ({ data, labels, className }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Minimum Temperatures ',
                                data: data,
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
    }, [data, labels]);

    return (
        <div className={"barChart"} style={{ marginTop: '100px', flex: "max-content" }}>
            <Grid container spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={8}>
                    <Paper className={className}>
                        <canvas ref={chartRef} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default BarChartMin;
