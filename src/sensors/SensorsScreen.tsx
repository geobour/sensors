// Sensors.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SensorCard from './SensorCard'; // Adjust the import path

const SensorsScreen: React.FC = () => {
    const sensorData = [
        { sensorName: 'Temperature Sensor', sensorType: 'Temperature', sensorValue: '25°C' },
        // Add more sensor data as needed
    ];

    return (
        <Container>
            <Typography variant="h2" sx={{ mt: 4 }}>
                Sensors
            </Typography>

            <div>
                {sensorData.map((sensor, index) => (
                    <SensorCard
                        // key={index}
                        // sensorName={sensor.sensorName}
                        // sensorType={sensor.sensorType}
                        // sensorValue={sensor.sensorValue}
                    />
                ))}
            </div>
        </Container>
    );
};

export default SensorsScreen;
