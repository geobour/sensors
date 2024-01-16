import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const PageNotFound = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={3} style={{ padding: 16, textAlign: 'center' }}>
                    <header>
                        <h1>Page not Found</h1>
                    </header>
                   <p></p>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default PageNotFound;
