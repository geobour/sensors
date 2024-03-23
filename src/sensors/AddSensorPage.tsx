import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const AddSensorPage: React.FC = () => {
    const [sensorData, setSensorData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        area: '',
        status: '',
    });
    const [errors, setErrors] = useState<any>({});

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setSensorData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Basic form validation
        const formErrors: any = {};
        if (!sensorData.name.trim()) {
            formErrors.name = 'Name is required';
        }
        if (!sensorData.latitude.trim()) {
            formErrors.latitude = 'Latitude is required';
        }
        if (!sensorData.longitude.trim()) {
            formErrors.longitude = 'Longitude is required';
        }
        if (!sensorData.area.trim()) {
            formErrors.area = 'Area is required';
        }
        if (!sensorData.status.trim()) {
            formErrors.status = 'Status is required';
        }

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
        <Paper elevation={6} sx={{padding: '40px', maxWidth: '400px', margin: 'auto', marginTop: '20px',marginBottom: '20px'}}>
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
                />
                <TextField
                    label="Status"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensorData.status}
                    onChange={handleChange}
                    name="status"
                    error={!!errors.status}
                    helperText={errors.status}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{marginTop: '20px'}}
                >
                    Add Sensor
                </Button>
            </form>
        </Paper>
    );
};

export default AddSensorPage;
