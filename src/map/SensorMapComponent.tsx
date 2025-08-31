import React from "react";
import GoogleMapReact from 'google-map-react';
import {useParams} from "react-router-dom";
import {useSensor} from "../hooks/useSensor";

const Marker = ({lat, lng, text}: { lat: number; lng: number; text: string }) => (
    <div>
        <div>Latitude: {lat}</div>
        <div>Longitude: {lng}</div>
        <div>{text}</div>
    </div>
);

export default function SensorMapComponent() {
    const {sensorId} = useParams<{ sensorId: string }>();
    const {sensor, isLoading, isError} = useSensor(sensorId || '');

    const defaultProps = {
        center: {
            lat: 38.2999988,
            lng: 24.1999992
        },
        zoom: 14
    };

    if (isLoading) return <div>Loading map...</div>;
    if (isError || !sensor) return <div>Error loading sensor data</div>;

    return (
        <div style={{height: '100vh', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{key: ""}}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <Marker
                    lat={Number(sensor.latitude)}
                    lng={Number(sensor.longitude)}
                    text="Sensor 1"
                />
            </GoogleMapReact>
        </div>
    );

}
