import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const HomePage = () => {
    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper elevation={6} style={{ padding: 16, textAlign: 'center' }}>
                        <header>
                            <h1>Welcome to Our App</h1>
                        </header>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab animi autem doloribus ducimus eius error excepturi facilis, harum id in ipsam itaque neque nostrum placeat porro possimus, sapiente similique temporibus!
                        </p>
                    </Paper>
                </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '400px', background: `url("/Sensor1.jpg") center/cover no-repeat`, margin: '20px 0' }}></div>
        </div>
    );
};

export default HomePage;
