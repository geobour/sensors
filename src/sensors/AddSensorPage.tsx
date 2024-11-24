import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSensorPage: React.FC = () => {
    const [sensorData, setSensorData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        area: '',
        topic: '',
        type: '',
    });
    const [errors, setErrors] = useState<any>({});

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSensorData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formErrors: any = {};



        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/sensor/create-sensor', sensorData);
            console.log('Sensor created:', response.data);
            navigate('/sensors');
        } catch (error) {
            console.error('Error creating sensor:', error);
        }
    };

    return (
        <div style={{ backgroundColor: '#333', minHeight: '100vh', padding: '20px' }}>

            <Paper elevation={6} sx={{
                padding: '40px',
                maxWidth: '400px',
                margin: 'auto',
                marginTop: '20px',
                marginBottom: '20px',
                backgroundColor: 'lightgray'
            }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Sensor Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.name}
                        onChange={handleChange}
                        name="name"
                        error={!!errors.name}
                        helperText={errors.name}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                    <TextField
                        label="Latitude"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.latitude}
                        onChange={handleChange}
                        name="latitude"
                        error={!!errors.latitude}
                        helperText={errors.latitude}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                    <TextField
                        label="Longitude"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.longitude}
                        onChange={handleChange}
                        name="longitude"
                        error={!!errors.longitude}
                        helperText={errors.longitude}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                    <TextField
                        label="Area"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.area}
                        onChange={handleChange}
                        name="area"
                        error={!!errors.area}
                        helperText={errors.area}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                    <TextField
                        label="Topic"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.topic}
                        onChange={handleChange}
                        name="topic"
                        error={!!errors.topic}
                        helperText={errors.topic}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                    <TextField
                        label="Type"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={sensorData.type}
                        onChange={handleChange}
                        name="type"
                        error={!!errors.type}
                        helperText={errors.type}
                        inputProps={{ maxLength: 30 }} // Set maxLength to 30
                    />
                <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px' }}
                    >
                        Add Sensor
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default AddSensorPage;
