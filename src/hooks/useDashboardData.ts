// hooks/useDashboardData.ts
import { useQuery } from 'react-query';
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

const fetchDashboardValues = async (page = 0, size = 10): Promise<PagedResponse<DashboardDto>> => {
    const response = await axios.get<PagedResponse<DashboardDto>>(`${API_BASE}/dashboard/current-values`, {
        params: { page, size }
    });
    return response.data;
};

export const useDashboardData = (page = 0, size = 10) => {
    return useQuery(['dashboardValues', page, size], () => fetchDashboardValues(page, size), {
        keepPreviousData: true
    });
};
