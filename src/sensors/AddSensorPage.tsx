import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAddSensor } from "../hooks/useAddSensor";

const MAX_LENGTH = 20;

const AddSensorPage: React.FC = () => {
    const [sensorData, setSensorData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        area: '',
        topic: '',
        type: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fieldWarnings, setFieldWarnings] = useState<Record<string, boolean>>({});
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalSuccess, setModalSuccess] = useState(true);
    const navigate = useNavigate();
    const mutation = useAddSensor();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSensorData(prev => ({ ...prev, [name]: value }));

        setFieldWarnings(prev => ({
            ...prev,
            [name]: value.length >= MAX_LENGTH
        }));

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formErrors: Record<string, string> = {};
        Object.keys(sensorData).forEach(field => {
            const value = sensorData[field as keyof typeof sensorData];
            if (!value || String(value).trim() === '') {
                formErrors[field] = 'This field is required';
            }
        });

        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
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
        <div style={{ backgroundColor: 'whitesmoke', minHeight: '100vh', padding: '20px' }}>
            <Paper
                elevation={6}
                sx={{
                    padding: '40px',
                    maxWidth: '400px',
                    margin: 'auto',
                    marginTop: '20px',
                    backgroundColor: 'whitesmoke',
                }}
            >
                <form onSubmit={handleSubmit}>
                    {/* Text Inputs */}
                    {['name','latitude','longitude','area','topic'].map((field) => (
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
                            helperText={
                                errors[field] ? errors[field] :
                                    (fieldWarnings[field] ? `Maximum ${MAX_LENGTH} characters reached` : '')
                            }
                            inputProps={{ maxLength: MAX_LENGTH }}
                            required
                            sx={{
                                '& .MuiInputLabel-root': { color: 'text.secondary' },
                                '& .MuiFormHelperText-root': { color: 'text.secondary' },
                                color: 'text.secondary',
                            }}
                        />
                    ))}

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type-select"
                            name="type"
                            value={sensorData.type}
                            onChange={(e) =>
                                setSensorData(prev => ({ ...prev, type: e.target.value }))
                            }
                            required
                            sx={{ backgroundColor: 'whitesmoke' }}
                        >
                            <MenuItem value="temperature">Temperature</MenuItem>
                            <MenuItem value="humidity">Humidity</MenuItem>
                        </Select>
                    </FormControl>

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

export default AddSensorPage;
