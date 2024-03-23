import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Paper from "@mui/material/Paper";

interface SensorDto {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    area: string;
}

const EditSensorPage: React.FC = () => {
    const { sensorId } = useParams(); // Get the sensorId from the URL
    const navigate = useNavigate();
    const [sensor, setSensor] = useState<SensorDto>({
        id: 0,
        name: '',
        latitude: '',
        longitude: '',
        area: '',
    });

    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/sensor/get-sensor/${sensorId}`);
                setSensor(response.data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        fetchSensorData();
    }, [sensorId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSensor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/sensor/update-sensor/${sensorId}`, sensor);
            console.log('Sensor updated successfully');
            navigate('/sensors'); // Redirect to sensors list page after successful update
        } catch (error) {
            console.error('Error updating sensor:', error);
        }
    };

    return (
        <Paper elevation={6} sx={{ padding: '40px', maxWidth: '400px', margin: 'auto',marginTop: '20px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Edit Sensor
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Sensor Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensor.name}
                    onChange={handleInputChange}
                    name="name"
                />
                <TextField
                    label="Latitude"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensor.latitude}
                    onChange={handleInputChange}
                    name="latitude"
                />
                <TextField
                    label="Longitude"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensor.longitude}
                    onChange={handleInputChange}
                    name="longitude"
                />
                <TextField
                    label="Area"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={sensor.area}
                    onChange={handleInputChange}
                    name="area"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                >
                    Save Changes
                </Button>
            </form>
        </Paper>
    );
};

export default EditSensorPage;
