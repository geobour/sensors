import React from 'react';
import MapBox from '../map/MapBox';
import { Typography, Box } from '@mui/material';

const MapPage: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#333',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
            }}
        >
            <Typography variant="h4" color="white" gutterBottom>
                Sensor Map
            </Typography>
            <MapBox />
        </Box>
    );
};

export default MapPage;
