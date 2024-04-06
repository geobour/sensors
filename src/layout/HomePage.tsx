import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Typography} from "@mui/material";

const HomePage = () => {
    return (
        <div>
            <Grid container spacing={2}>
               
            </Grid>
            <div style={{
                height: '100vh', // Set height to 100vh to cover the entire viewport height
                background: `url("/Sensor1.jpg") center/cover no-repeat`,
                margin: '20px 0',
                paddingLeft: 20, // Added left padding
                paddingRight: 20, // Added right padding
            }}></div>
        </div>
    );
};

export default HomePage;
