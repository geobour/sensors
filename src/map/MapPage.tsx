import React from 'react';
import MapBox from '../map/MapBox';
import {Box} from '@mui/material';

const MapPage: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'whitesmoke',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 4,
            }}
        >
            <MapBox/>
        </Box>
    );
};

export default MapPage;
