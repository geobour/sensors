import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { useSensorsMap} from "../hooks/useSensor";
import { SensorDto } from "../api/ApiSensor";

const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

// Fit map to all marker
const RecenterOnPositions: React.FC<{ positions: LatLngExpression[] }> = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);
    return null;
};

const MapBoxMany: React.FC = () => {
    // @ts-ignore
    const { data: sensorList = [], isLoading, isError } = useSensorsMap<SensorDto[]>();

    if (isLoading) return <div>Loading map...</div>;
    if (isError) return <div>Error loading sensors</div>;
    if (sensorList.length === 0) return <div>No sensors available</div>;

    const validSensors = sensorList.filter(
        s => !isNaN(Number(s.latitude)) && !isNaN(Number(s.longitude))
    );

    const positions: LatLngExpression[] = validSensors.map(
        s => [Number(s.latitude), Number(s.longitude)]
    );

    const center: LatLngExpression = positions.length > 0 ? positions[0] : [37.9838, 23.7275];

    return (
        <div style={{ width: '100%', height: '560px', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                key={sensorList.length}
                center={center}
                zoom={6}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: USGS, Esri, DeLorme, NGA, NPS'
                />

                <RecenterOnPositions positions={positions} />

                {validSensors.map(sensor => {
                    const statusCircle = `
                        <span style="
                            display:inline-block;
                            width:12px;
                            height:12px;
                            border-radius:50%;
                            background-color:${sensor.status ? 'limegreen' : 'red'};
                            vertical-align:middle;
                        "></span>
                    `;
                    return (
                        <Marker
                            key={sensor.id}
                            position={[Number(sensor.latitude), Number(sensor.longitude)]}
                            icon={sensor.status ? greenIcon : redIcon}
                        >
                            <Tooltip direction="top" offset={[0, -42]} opacity={1}>
                                <div>
                                    <strong>{sensor.name}</strong><br />
                                    Lat: {sensor.latitude}, Lng: {sensor.longitude}<br />
                                    Area: {sensor.area}<br />
                                    Type: {sensor.type}<br />
                                    Status: <span dangerouslySetInnerHTML={{ __html: statusCircle }} />
                                </div>
                            </Tooltip>

                            <Popup>
                                <strong>{sensor.name}</strong><br />
                                Lat: {sensor.latitude}, Lng: {sensor.longitude}<br />
                                Area: {sensor.area}<br />
                                Type: {sensor.type}<br />
                                Status: <span dangerouslySetInnerHTML={{ __html: statusCircle }} />
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapBoxMany;
