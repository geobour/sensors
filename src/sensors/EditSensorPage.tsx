import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {SensorDto} from '../api/ApiSensor';
import {useSensor, useUpdateSensor} from "../hooks/useSensor ";

const EditSensorPage: React.FC = () => {
    const {sensorId} = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const { sensor, isLoading, isError } = useSensor(sensorId || '');
    const mutation = useUpdateSensor();

    const [formData, setFormData] = useState<SensorDto | null>(null);

    useEffect(() => {
        if (sensor) {
            setFormData(sensor);
        }
    }, [sensor]);

    if (isLoading) return <div>Loading sensor data...</div>;
    if (isError || !formData) return <div>Error loading sensor data.</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => prev ? {...prev, [name]: value} : prev);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData) return;

        mutation.mutate(formData, {
            onSuccess: () => {
                navigate('/sensors');
            },
            onError: (error) => {
                console.error('Error updating sensor:', error);
            },
        });
    };

    return (
        <div style={{backgroundColor: '#333', minHeight: '100vh', padding: '20px'}}>
            <Paper elevation={6} sx={{
                padding: '40px',
                maxWidth: '400px',
                margin: 'auto',
                marginTop: '20px',
                backgroundColor: 'lightgray'
            }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Edit Sensor
                </Typography>
                <form onSubmit={handleSubmit}>
                    {['name', 'latitude', 'longitude', 'area', 'topic', 'type'].map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={formData[field as keyof SensorDto] || ''}
                            onChange={handleChange}
                            name={field}
                        />
                    ))}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{marginTop: '20px'}}
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {mutation.isError && <div style={{color: 'red', marginTop: '10px'}}>Error updating sensor.</div>}
                </form>
            </Paper>
        </div>
    );
};

export default EditSensorPage;
