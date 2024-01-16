import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AddSensorPage = () => {
    const [sensorName, setSensorName] = useState('');
    const [sensorArea, setSensorArea] = useState('');
    const navigate = useNavigate();

    const handleAddSensor = () => {
        // Perform the action to add the sensor (e.g., make an API call)
        console.log('Adding sensor...', { sensorName, sensorArea });

        // Redirect to the desired page after adding the sensor
        navigate('/sensors'); // Adjust the path as needed
    };

    return (
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh', // Make sure the Container covers the full height of the viewport
            }}
        >
            <Paper elevation={6} sx={{ backgroundColor: '#f0f0f0', padding: '20px', maxWidth: '300px' }}>
                <Typography variant="h4" align="center">
                    Add Sensor
                </Typography>
                <TextField
                    label="Sensor Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensorName}
                    onChange={(e) => setSensorName(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <TextField
                    label="Sensor Area"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensorArea}
                    onChange={(e) => setSensorArea(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSensor}
                    style={{ maxWidth: '300px', padding: '12px', marginTop: '16px', textAlign: 'center' }}
                >
                    Add Sensor
                </Button>
            </Paper>
        </Container>
    );
};

export default AddSensorPage;
