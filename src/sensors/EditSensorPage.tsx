import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { SensorDto } from '../api/ApiSensor';
import {useSensor, useUpdateSensor} from "../hooks/useSensor";

const EditSensorPage: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const { sensor, isLoading, isError } = useSensor(sensorId || '');
    const mutation = useUpdateSensor();

    const [formData, setFormData] = useState<SensorDto | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);

    useEffect(() => {
        if (sensor) {
            setFormData(sensor);
        }
    }, [sensor]);

    useEffect(() => {
        if (openModal && modalSuccess) {
            const timer = setTimeout(() => {
                setOpenModal(false);
                navigate('/sensors');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [openModal, modalSuccess, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData) return;

        mutation.mutate(formData, {
            onSuccess: () => {
                setModalMessage('Sensor updated successfully!');
                setModalSuccess(true);
                setOpenModal(true);
            },
            onError: (error) => {
                console.error('Error updating sensor:', error);
                setModalMessage('Error updating sensor.');
                setModalSuccess(false);
                setOpenModal(true);
            },
        });
    };

    return (
        <div style={{ backgroundColor: '#333', minHeight: '100vh', padding: '20px' }}>
            {isLoading && <div>Loading sensor data...</div>}
            {(isError || (!isLoading && !formData)) && <div>Error loading sensor data.</div>}

            {!isLoading && !isError && formData && (
                <Paper
                    elevation={6}
                    sx={{
                        padding: '40px',
                        maxWidth: '400px',
                        margin: 'auto',
                        marginTop: '20px',
                        backgroundColor: 'lightgray'
                    }}
                >
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
                            style={{ marginTop: '20px' }}
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Paper>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle style={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalSuccess ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogContent style={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalMessage}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditSensorPage;
