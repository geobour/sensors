import {useMutation} from 'react-query';
import axios from 'axios';
import {SensorDto, SensorInput} from '../api/ApiSensor';

const API_BASE = 'http://localhost:8080/api';
const API_SENSOR = `${API_BASE}/sensor`;

export const useAddSensor = () => {
    return useMutation<SensorDto, Error, SensorInput>(
        async (newSensor) => {
            const response = await axios.post<SensorDto>(
                `${API_SENSOR}/create-sensor`,
                newSensor
            );
            return response.data;
        }
    );
};
