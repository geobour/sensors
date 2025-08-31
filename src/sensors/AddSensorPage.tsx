import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useNavigate } from 'react-router-dom';
import {useAddSensor} from "../hooks/useAddSensor";

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
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);
    const navigate = useNavigate();
    const mutation = useAddSensor();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSensorData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formErrors: any = {};
        if (!sensorData.name) formErrors.name = 'Name is required';
        if (!sensorData.latitude) formErrors.latitude = 'Latitude is required';
        if (!sensorData.longitude) formErrors.longitude = 'Longitude is required';

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setModalMessage('Please fill in required fields.');
            setModalSuccess(false);
            setOpenModal(true);
            return;
        }

        mutation.mutate(sensorData, {
            onSuccess: () => {
                setModalMessage('Sensor created successfully!');
                setModalSuccess(true);
                setOpenModal(true);
            },
            onError: (error) => {
                console.error('Error creating sensor:', error);
                setModalMessage('Error creating sensor.');
                setModalSuccess(false);
                setOpenModal(true);
            },
        });
    };

    useEffect(() => {
        if (openModal && modalSuccess) {
            const timer = setTimeout(() => {
                setOpenModal(false);
                navigate('/sensors');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [openModal, modalSuccess, navigate]);

    return (
        <div style={{ backgroundColor: '#333', minHeight: '100vh', padding: '20px' }}>
            <Paper
                elevation={6}
                sx={{ padding: '40px', maxWidth: '400px', margin: 'auto', marginTop: '20px', backgroundColor: 'lightgray' }}
            >
                <form onSubmit={handleSubmit}>
                    {['name','latitude','longitude','area','topic','type'].map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={sensorData[field as keyof typeof sensorData]}
                            onChange={handleChange}
                            name={field}
                            error={!!errors[field]}
                            helperText={errors[field]}
                            inputProps={{ maxLength: 30 }}
                        />
                    ))}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px' }}
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Adding...' : 'Add Sensor'}
                    </Button>
                </form>
            </Paper>
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

export default AddSensorPage;
