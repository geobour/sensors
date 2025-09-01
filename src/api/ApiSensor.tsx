export interface SensorDataDto {
    year?: number;
    month?: number;
    maxValue?: number;
    minValue?: number;
    averageValue?: number;
}
export  interface SensorRecordDto {
    id: number;
    value?: number;
    time: string;
}
export interface SensorDto {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    type: string;
    topic: string;
    area: string;
    status:boolean;
    active:string;
}
export interface SensorInput {
    name: string;
    latitude: string;
    longitude: string;
    area: string;
    topic: string;
    type: string;
}
export  interface FileData {
    min?: number;
    max?: number;
    avg?: number;

}
export interface PredictionData {
    january?: number;
    february?: number;
    march?: number;
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
}

export interface DashboardDto {
    name: string;
    type: string;
    currentValue: number;
}


export interface BarChartProps {
    className?: string;
}

export interface LineChartProps {
    className?: string;
}
