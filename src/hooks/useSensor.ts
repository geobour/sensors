import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { SensorDto } from "../api/ApiSensor";

const API_BASE = 'http://localhost:8080/api';
const API_SENSOR = `${API_BASE}/sensor`;


export const useSensor = (sensorId: string | number) => {
    const query = useQuery<SensorDto, Error>(
        ['sensor', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(`${API_SENSOR}/get-sensor/${sensorId}`);
            return response.data;
        }
    );

    return {
        sensor: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};

export const useUpdateSensor = () => {
    const queryClient = useQueryClient();

    return useMutation<SensorDto, Error, SensorDto>(
        async (updatedSensor) => {
            const { id, name, latitude, longitude, area, topic, type } = updatedSensor;
            const response = await axios.put<SensorDto>(`${API_SENSOR}/update-sensor/${id}`, {
                id, name, latitude, longitude, area, topic, type
            });
            return response.data;
        },
        {
            onSuccess: (_, updatedSensor) => {
                queryClient.setQueryData(['sensor', updatedSensor.id], updatedSensor);
            },
        }
    );
};

// Fetch all sensors
export const useSensors = () => {
    return useQuery<SensorDto[], Error>(
        ['sensors'],
        async () => {
            const response = await axios.get<SensorDto[]>(`${API_SENSOR}/show-sensors`);
            return response.data;
        }
    );
};

// Delete sensor
export const useDeleteSensor = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (sensorId: number) => {
            await axios.delete(`${API_SENSOR}/delete-sensor/${sensorId}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['sensors']);
            },
        }
    );
};

// Restore sensor
export const useRestoreSensor = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (sensor: SensorDto) => {
            const response = await axios.put(`${API_SENSOR}/restore/${sensor.id}`, {
                ...sensor,
                status: true,
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['sensors']);
            },
        }
    );
};
