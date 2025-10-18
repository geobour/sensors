import {useMutation, useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import {DashboardDto, SensorDto} from '../api/ApiSensor';

const API_BASE = 'http://localhost:8080/api';


const fetchSensors = async (): Promise<SensorDto[]> => {
    const response = await axios.get<SensorDto[]>(`${API_BASE}/sensor/show-sensors`);
    return response.data;
};


const fetchDashboardValues = async (): Promise<DashboardDto[]> => {
    const response = await axios.get<DashboardDto[]>(`${API_BASE}/dashboard/current-values`);
    return response.data;
};


const checkSensors = async (): Promise<void> => {
    await axios.get(`${API_BASE}/sensor/check`);
};

export const useDashboardData = () => {
    const queryClient = useQueryClient();


    const sensorsQuery = useQuery({
        queryKey: ['sensors'],
        queryFn: fetchSensors,
        refetchInterval: 60 * 1000,
    });

    const valuesQuery = useQuery({
        queryKey: ['dashboardValues'],
        queryFn: fetchDashboardValues,
        refetchInterval: 60 * 1000,
    });


    const checkStatusMutation = useMutation({
        mutationFn: checkSensors,
        onSuccess: () => {
            queryClient.invalidateQueries(['sensors']);
        },
    });

    return {
        sensorsQuery,
        valuesQuery,
        checkStatusMutation,
    };
};
