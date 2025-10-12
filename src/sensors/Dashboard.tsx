import React, {useEffect,  useState} from 'react';
import Grid from '@mui/material/Grid';
import {Box, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import {useDashboardData} from '../hooks/useDashboardData';
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
        <div style={{
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'forestgreen',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <Typography variant="body1" style={{color: '#fff'}}>{currentDateTime.date}</Typography>
                <Typography variant="body1" style={{color: '#fff'}}>{currentDateTime.time}</Typography>
            </div>
        </div>
    );
};


const ChartGrid: React.FC = React.memo(() => {
    const {sensorsQuery, valuesQuery, checkStatusMutation} = useDashboardData();

    if (sensorsQuery.isLoading || valuesQuery.isLoading) return <div>Loading...</div>;
    if (sensorsQuery.isError || valuesQuery.isError) return <div>Error loading data</div>;

    const values = valuesQuery.data!;
    const handleCheckStatus = async () => {
        await checkStatusMutation.mutateAsync();
    };



    return (
        <div style={{backgroundColor: "whitesmoke", minHeight: '100vh', padding: '20px'}}>
            {/*<Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>*/}
                {/*<Grid item xs={2}>*/}
                    {/*<Box display="flex" flexDirection="column" alignItems="center" gap={2}>*/}
                    {/*    <Clock />*/}
                    {/*    <Button*/}
                    {/*        onClick={handleCheckStatus}*/}
                    {/*        variant="contained"*/}
                    {/*        color="error"*/}
                    {/*        sx={{ px: 2, py: 1 }}*/}
                    {/*    >*/}
                    {/*        Check Status*/}
                    {/*    </Button>*/}
                    {/*</Box>*/}
                {/*</Grid>*/}
                {/*<Grid item xs={12}>*/}
                    <MapBoxMany />
            {/*    </Grid>*/}
            {/*</Grid>*/}

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {values.map((value: any, index: React.Key | null | undefined) => (
                    <Grid key={index} item xs={2}>
                        <div style={{
                            backgroundColor: value.status ? 'forestgreen' : 'darkred', // green if active, red if inactive
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            height: '150px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            cursor: 'pointer'
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


            <div style={{height: '100px'}}></div>
        </div>
    );
});

export default ChartGrid;
