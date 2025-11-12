// hooks/useDashboardData.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { DashboardDto } from '../api/ApiSensor';

const API_BASE = 'http://localhost:8080/api';

export interface PagedResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

// Fetch dashboard data
const fetchDashboardValues = async (page = 0, size = 10): Promise<PagedResponse<DashboardDto>> => {
    const response = await axios.get<PagedResponse<DashboardDto>>(`${API_BASE}/dashboard/current-values`, {
        params: { page, size }
    });
    return response.data;
};

// Publish value to MQTT
const publishValue = async (topic: string, value: number) => {
    if (!topic) throw new Error("Topic is required");
    const fullTopic = `sensors/${topic}`;
    const formData = new URLSearchParams();
    formData.append('topic', fullTopic);
    formData.append('message', JSON.stringify({ value }));

    const res = await fetch(`${API_BASE}/mqtt/publishHive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
};

export const useDashboardData = (page = 0, size = 10) => {
    const queryClient = useQueryClient();

    const query = useQuery(['dashboardValues', page, size], () => fetchDashboardValues(page, size), {
        keepPreviousData: true
    });

    const publishMutation = useMutation(
        ({ topic, value }: { topic: string; value: number }) => publishValue(topic, value),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['dashboardValues'], exact: false });
            },
        }
    );

    return {
        ...query,
        publishMutation
    };
};
