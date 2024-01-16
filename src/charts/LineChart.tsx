import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

interface LineChartProps {
    data: number[];
    labels: string[];
    className?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, labels, className }) => {
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
                    type: 'line', // Change the chart type to 'line'
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Daily Temperatures',
                                data: data,
                                fill: false, // Don't fill the area under the line
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
    }, [data, labels]);

    return (

        <div className={"lineChart"} style={{marginTop: '100px', flex: "max-content"}}>
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

export default LineChart;
