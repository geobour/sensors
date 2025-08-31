import {useMutation, useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import {DashboardDto, SensorDto} from '../api/ApiSensor';

const API_BASE = 'http://localhost:8080/api';

// Fetch all sensors
const fetchSensors = async (): Promise<SensorDto[]> => {
    const response = await axios.get<SensorDto[]>(`${API_BASE}/sensor/show-sensors`);
    return response.data;
};

// Fetch current dashboard values
const fetchDashboardValues = async (): Promise<DashboardDto[]> => {
    const response = await axios.get<DashboardDto[]>(`${API_BASE}/dashboard/current-values`);
    return response.data;
};

// Check sensor status
const checkSensors = async (): Promise<void> => {
    await axios.get(`${API_BASE}/sensor/check`);
};

export const useDashboardData = () => {
    const queryClient = useQueryClient();

    // Query for sensor data
    const sensorsQuery = useQuery({
        queryKey: ['sensors'],
        queryFn: fetchSensors,
        refetchInterval: 60 * 1000, // auto-refresh every minute
    });

    // Query for dashboard values
    const valuesQuery = useQuery({
        queryKey: ['dashboardValues'],
        queryFn: fetchDashboardValues,
        refetchInterval: 60 * 1000,
    });

    // Mutation for checking status
    const checkStatusMutation = useMutation({
        mutationFn: checkSensors,
        onSuccess: () => {
            queryClient.invalidateQueries(['sensors']); // refresh sensors after status check
        },
    });

    return {
        sensorsQuery,
        valuesQuery,
        checkStatusMutation,
    };
};
