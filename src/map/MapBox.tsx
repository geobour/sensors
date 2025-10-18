import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useParams } from 'react-router-dom';
import { LatLngExpression } from 'leaflet';
import { useSensor } from "../hooks/useSensor";


const purpleIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="42">
        <path fill="#D3A1FF" stroke="#8000FF" stroke-width="1" d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z"/>
        <circle fill="white" cx="12" cy="9" r="2"/>
    </svg>`,
    className: '',
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
});

const MapBox: React.FC = () => {
    const { sensorId } = useParams<{ sensorId: string }>();
    const { sensor, isLoading, isError } = useSensor(sensorId || '');

    if (isLoading) return <div>Loading map...</div>;
    if (isError) return <div>Error loading sensor location</div>;
    if (!sensor?.latitude || !sensor?.longitude) return <div>No sensor coordinates</div>;

    const position: LatLngExpression = [
        Number(sensor.latitude),
        Number(sensor.longitude),
    ];

    const statusCircle = sensor.status
        ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background-color:green;margin-left:5px;"></span>`
        : `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background-color:red;margin-left:5px;"></span>`;

    return (
        <div style={{ width: '100%', height: '600px', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                key={sensorId}
                center={position}
                zoom={10}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: USGS, Esri, DeLorme, NGA, NPS'
                />
                <Marker position={position} icon={purpleIcon}>
                    <Tooltip direction="top" offset={[0, -42]} opacity={1} permanent={false}>
                        <div>
                            <strong>{sensor.name}</strong><br />
                            Lat: {sensor.latitude}, Lng: {sensor.longitude}<br />
                            Area: {sensor.area}<br />
                            Type: {sensor.type}<br />
                            Status: <span dangerouslySetInnerHTML={{ __html: statusCircle }} />
                        </div>
                    </Tooltip>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapBox;
