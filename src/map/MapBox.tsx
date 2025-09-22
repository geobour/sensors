import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useParams } from 'react-router-dom';
import { LatLngExpression } from 'leaflet';
import { useSensor } from "../hooks/useSensor";

// Fix marker icons
const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

const MapBox: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const { sensor, isLoading, isError } = useSensor(sensorId || '');

    if (isLoading) return <div>Loading map...</div>;
    if (isError) return <div>Error loading sensor location</div>;

    // Wait until sensor is loaded and has valid coordinates
    if (!sensor?.latitude || !sensor?.longitude) return <div>No sensor coordinates</div>;

    const position: LatLngExpression = [
        Number(sensor.latitude),
        Number(sensor.longitude)
    ];

    return (
        <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
            {/* MapContainer is remounted every time sensorId changes */}
            <MapContainer key={sensorId} center={position} zoom={10} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: USGS, Esri, DeLorme, NGA, NPS'
                />
                <Marker position={position}>
                    <Popup>
                        Sensor {sensorId}<br />
                        Lat: {sensor.latitude}, Lng: {sensor.longitude}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapBox;
