import {useMutation, useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import {SensorDto} from "../api/ApiSensor";

export const useSensor = (sensorId: string | number) => {
    const query = useQuery<SensorDto, Error>(
        ['sensor', sensorId],
        async () => {
            const response = await axios.get<SensorDto>(
                `http://localhost:8080/api/sensor/get-sensor/${sensorId}`
            );
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
            const {id, name, latitude, longitude, area, topic, type} = updatedSensor;
            const response = await axios.put<SensorDto>(
                `http://localhost:8080/api/sensor/update-sensor/${id}`,
                {id, name, latitude, longitude, area, topic, type}
            );
            return response.data;
        },
        {
            onSuccess: (_, updatedSensor) => {
                queryClient.setQueryData(['sensor', updatedSensor.id], updatedSensor);
            },
        }
    );
};