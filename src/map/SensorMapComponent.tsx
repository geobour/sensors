import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import axios from "axios";
import {SensorDto, SensorRecordDto} from "../api/ApiSensor";


// @ts-ignore
const AnyReactComponent = ({ lat, lng, text }) => (
    <div>
        <div>Latitude: {lat}</div>
        <div>Longitude: {lng}</div>
        <div>{text}</div>
    </div>
);

export default function SensorMapComponent(){
    const [loading, setLoading] = useState(true);
    const defaultProps = {
        center: {
            lat: 38.2999988,
            lng: 24.1999992
        },
        zoom: 14
    };
    const [sensor, setSensor] = useState<SensorDto | null>(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                // @ts-ignore
                const response = await axios.get<SensorDto>(`http://localhost:8080//api/sensor/get-sensor/${sensorId}`);
                setSensor(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Stop loading state in case of error
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000); // Adjust the delay time as needed

        // Clear the timeout to prevent memory leaks
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            {loading ? (
                <div>Loading map...</div>
            ) : (
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                    <AnyReactComponent
                        lat={sensor?.latitude }
                        lng={sensor?.longitude}
                        text="Sensor 1"
                    />
                </GoogleMapReact>
            )}
        </div>
    );
}
