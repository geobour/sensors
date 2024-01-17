import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const HomePage = () => {
    return (
        <div><img src="/public/Sensor1.jpg" alt="App Photo" style={{ maxWidth: '100%', height: 'auto' }} />
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
        </div>
    );
};

export default HomePage;
