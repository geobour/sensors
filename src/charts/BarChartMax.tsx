import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

interface BarChartProps {
    data: number[];
    labels: string[];
    className?: string;
}

const BarChartMax: React.FC<BarChartProps> = ({ data, labels, className }) => {
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
                                label: 'Maximum Temperatures ',
                                data: data,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red background color
                                borderColor: 'rgba(255, 99, 132, 1)', // Red border color
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

export default BarChartMax;
