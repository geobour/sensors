
import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

interface SensorProps {
    sensorId: string;
    sensorName: string;
    sensorArea: string;
    sensorValues: string[];
}

const Sensor: React.FC<SensorProps> = ({ sensorId, sensorName, sensorArea }) => {
    return (
        <TableRow key={sensorId}>
            <TableCell>{sensorId}</TableCell>
            <TableCell>{sensorName}</TableCell>
            <TableCell>{sensorArea}</TableCell>
        </TableRow>
    );
};

export default Sensor;
