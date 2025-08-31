import React, {useRef, useEffect} from 'react';
import {Grid, Paper} from '@mui/material';
import Chart from 'chart.js/auto';
import Footer from "../layout/Footer";
import {useSensorPieData} from "../hooks/useSensorData";

interface ChartProps {
    data: any;
    options: any;
    type: 'bar' | 'pie';
}

const ChartComponent: React.FC<ChartProps> = ({data, options, type}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstanceRef.current) chartInstanceRef.current.destroy();
                // @ts-ignore
                chartInstanceRef.current = new Chart(ctx, {type, data, options});
            }
        }

        return () => {
            if (chartInstanceRef.current) chartInstanceRef.current.destroy();
        };
    }, [data, options, type]);

    return <canvas ref={chartRef}></canvas>;
};

const ChartGrid: React.FC = () => {
    const {data: sensorData = [], isLoading, isError} = useSensorPieData();

    const barChartOptions = {responsive: true, maintainAspectRatio: false};
    const pieChartOptions = {responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'top'}}};

    if (isLoading) return <p>Loading sensor data...</p>;
    if (isError) return <p>Error loading sensor data.</p>;

    return (
        <div>
            {/* Bar Charts */}
            <Grid container spacing={2} style={{margin: '20px'}}>
                {sensorData.map((sensor: any, index: number) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper elevation={6} style={{
                            height: '300px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10
                        }}>
                            <ChartComponent data={sensor.chartData} options={barChartOptions} type="bar"/>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Pie Charts */}
            <Grid container spacing={2} style={{marginTop: '20px', margin: '20px'}}>
                {sensorData.map((sensor: any, index: number) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper elevation={6} style={{
                            height: '300px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10
                        }}>
                            <ChartComponent data={sensor.pieChartData} options={pieChartOptions} type="pie"/>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <div style={{height: '100px'}}/>
            {/* Spacer */}
            <Footer/>
        </div>
    );
};

export default ChartGrid;
