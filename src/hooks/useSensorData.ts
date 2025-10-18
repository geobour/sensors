
import axios from 'axios';
import { SensorDataDto, SensorRecordDto } from "../api/ApiSensor";
import { useQuery } from 'react-query';

const API_BASE = 'http://localhost:8080/api';
const API_SENSOR = `${API_BASE}/sensor`;


export const useSensorData = (sensorId: string | number, year: number) => {
    const query = useQuery<SensorDataDto[], Error>(
        ['sensorData', sensorId, year],
        async () => {
            const response = await axios.get<SensorDataDto[]>(`${API_SENSOR}/load/sensor-data/${sensorId}/${year}`);
            return response.data;
        },
        { keepPreviousData: true }
    );

    return {
        sensorData: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
};

export const useLineChartData = (sensorId: string) => {
    return useQuery<SensorRecordDto[], Error>(
        ['lineChartData', sensorId],
        async () => {
            const response = await axios.get<SensorRecordDto[]>(`${API_SENSOR}/reports/get-daily-data?sensorId=${sensorId}`);
            return response.data;
        },
        { refetchInterval: 20000 }
    );
};

