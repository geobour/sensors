// hooks/useAddSensor.ts
import {useMutation} from 'react-query';
import axios from 'axios';
import {SensorDto} from '../api/ApiSensor';

interface SensorInput {
    name: string;
    latitude: string;
    longitude: string;
    area: string;
    topic: string;
    type: string;
}

export const useAddSensor = () => {
    return useMutation<SensorDto, Error, SensorInput>(
        async (newSensor) => {
            const response = await axios.post<SensorDto>(
                'http://localhost:8080/api/sensor/create-sensor',
                newSensor
            );
            return response.data;
        }
    );
};
