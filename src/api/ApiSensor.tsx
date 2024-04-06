export interface SensorDataDto {
    year?: number;
    month?: number;
    maxTemperature?: number;
    minTemperature?: number;
    averageTemperature?: number;
}
export  interface SensorRecordDto {
    id: number;
    temperature?: number;
    time: string;
}
export interface SensorDto {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    area: string;
    status:boolean;
    active:string;
}



