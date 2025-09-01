import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { SensorDto } from '../api/ApiSensor';
import { useSensor, useUpdateSensor } from "../hooks/useSensor";

const MAX_LENGTH = 20;

const EditSensorPage: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const navigate = useNavigate();
    const { sensor, isLoading, isError } = useSensor(sensorId || '');
    const mutation = useUpdateSensor();

    const [formData, setFormData] = useState<SensorDto | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);
    const [fieldWarnings, setFieldWarnings] = useState<Record<string, boolean>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (sensor) setFormData(sensor);
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

        const newValue = name === 'latitude' || name === 'longitude' ? Number(value) : value;

        setFormData(prev => prev ? { ...prev, [name]: newValue } : prev);

        setFieldWarnings(prev => ({ ...prev, [name]: String(value).length >= MAX_LENGTH }));

        setFieldErrors(prev => ({ ...prev, [name]: String(value).trim() === '' }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData) return;

        const errors: Record<string, boolean> = {};
        let hasError = false;
        ['name', 'latitude', 'longitude', 'area', 'topic', 'type'].forEach(field => {
            const value = formData[field as keyof SensorDto];
            if (value === undefined || value === null || String(value).trim() === '') {
                errors[field] = true;
                hasError = true;
            }
        });
        setFieldErrors(errors);
        if (hasError) return;

        mutation.mutate(formData, {
            onSuccess: () => {
                setModalMessage('Sensor updated successfully!');
                setModalSuccess(true);
                setOpenModal(true);
            },
            onError: () => {
                setModalMessage('Error updating sensor.');
                setModalSuccess(false);
                setOpenModal(true);
            },
        });
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: 'white' }}>
            {isLoading && <div style={{ color: 'text.secondary' }}>Loading sensor data...</div>}
            {(isError || (!isLoading && !formData)) && <div style={{ color: 'text.secondary' }}>Error loading sensor data.</div>}

            {!isLoading && !isError && formData && (
                <Paper elevation={6} sx={{ padding: '40px', maxWidth: '400px', margin: 'auto', marginTop: '20px', backgroundColor: 'white' }}>
                    <form onSubmit={handleSubmit}>
                        {['name', 'latitude', 'longitude', 'area', 'topic', 'type'].map((field) => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={formData[field as keyof SensorDto] ?? ''}
                                onChange={handleChange}
                                name={field}
                                inputProps={{ maxLength: MAX_LENGTH }}
                                required
                                error={fieldErrors[field] || false}
                                helperText={
                                    fieldErrors[field]
                                        ? 'This field is required'
                                        : fieldWarnings[field]
                                            ? `Maximum ${MAX_LENGTH} characters reached`
                                            : ''
                                }
                                sx={{
                                    '& .MuiInputLabel-root': { color: 'text.secondary' },
                                    '& .MuiFormHelperText-root': { color: 'text.secondary' },
                                    '& .MuiInputBase-input': { color: 'text.secondary' },
                                }}
                            />
                        ))}

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                marginTop: '20px',
                                backgroundColor: '#D3A1FF',
                                color: 'text.secondary',
                                '&:hover': { backgroundColor: '#c089f2' },
                            }}
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </Paper>
            )}

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle sx={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalSuccess ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogContent sx={{ color: modalSuccess ? 'green' : 'red' }}>
                    {modalMessage}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditSensorPage;
