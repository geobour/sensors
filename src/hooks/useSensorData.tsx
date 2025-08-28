// hooks/useSensorData.ts
import axios from 'axios';
import { SensorDataDto } from "../api/ApiSensor";
import { useQuery } from 'react-query';

export const useSensorData = (sensorId: string | number, year: number) => {
    const query = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, year], // include year in key
        async () => {
            const response = await axios.get<SensorDataDto[]>(
                `http://localhost:8080/api/sensor/load/sensor-data/${sensorId}/${year}`
            );
            return response.data;
        },
        {
            keepPreviousData: true, // optional: keeps old data until new data loads
        }
    );

    return {
        sensorData: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};
