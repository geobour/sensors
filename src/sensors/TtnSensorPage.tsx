// @ts-nocheck
import React, {useState, useEffect} from "react";
import {useQuery, useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {
    Grid,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import {MapContainer, TileLayer, Marker, Popup, Tooltip, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {useTtnConnectionStore} from "../stores/useTtnConnectionStore";

// Fix leaflet marker icons
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const API_BASE = "http://localhost:8080/api/ttn";
delete L.Icon.Default.prototype["_getIconUrl"];
L.Icon.Default.mergeOptions({iconRetinaUrl, iconUrl, shadowUrl});

const RecenterOnPositions = ({positions}) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, {padding: [50, 50], maxZoom: 15});
        }
    }, [positions, map]);
    return null;
};

const TtnSensorPage = () => {
    const queryClient = useQueryClient();
    const {connected, showForm, setConnected, setDisconnected, toggleForm} = useTtnConnectionStore();
    const [appId, setAppId] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [region, setRegion] = useState("");

    const purpleIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
        shadowUrl: shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const blueIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl: shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    const connectMutation = useMutation(
        () =>
            axios.post("http://localhost:8080/api/mqtt/connect-ttn", null, {params: {appId, accessKey, region}}),
        {
            onSuccess: () => {
                setConnected();
                queryClient.invalidateQueries("ttnSensors");
            },
            onError: (err) => {
                console.error("Failed to connect to TTN", err);
                alert("Connection failed. Please check App ID, Access Key, and Region.");
            },
        }
    );

    const handleDisconnect = () => {
        setDisconnected();
        setAppId("");
        setAccessKey("");
        setRegion("");
        queryClient.invalidateQueries("ttnSensors");
    };

    const {data} = useQuery(
        "ttnSensors",
        async () => (await axios.get(`${API_BASE}/records`)).data,
        {enabled: connected, refetchInterval: 60000}
    );

    const latestPerDevice = data
        ? Object.values(
            data.reduce((acc, record) => {
                const existing = acc[record.deviceId];
                if (!existing || new Date(record.receivedAt) > new Date(existing.receivedAt)) {
                    acc[record.deviceId] = record;
                }
                return acc;
            }, {})
        )
        : [];

    const validCoords = latestPerDevice.filter(d => d.latitude && d.longitude);
    const positions = validCoords.map(d => [d.latitude, d.longitude]);
    const center = positions.length > 0 ? positions[0] : [37.9838, 23.7275];

    if (showForm) {
        return (
            <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"flex-start", backgroundColor:"whitesmoke", padding:"20px"}}>
                <div style={{maxWidth:"400px", width:"100%", padding:"30px", borderRadius:"12px", backgroundColor:"whitesmoke", boxShadow:"0 8px 20px rgba(0,0,0,0.2)", display:"flex", flexDirection:"column", gap:"20px", marginTop:"50px"}}>
                    <Typography variant="h5" align="center" style={{color:"#333"}}>Connect to TTN</Typography>
                    <TextField label="App ID" value={appId} onChange={e=>setAppId(e.target.value)} variant="filled" size="small" fullWidth InputProps={{style:{backgroundColor:"#eee", color:"#000"}}} InputLabelProps={{style:{color:"#555"}}} />
                    <TextField label="Access Key" value={accessKey} onChange={e=>setAccessKey(e.target.value)} variant="filled" size="small" fullWidth InputProps={{style:{backgroundColor:"#eee", color:"#000"}}} InputLabelProps={{style:{color:"#555"}}} />
                    <FormControl fullWidth variant="filled" size="small">
                        <InputLabel style={{color:"#555"}}>Region</InputLabel>
                        <Select value={region} onChange={e=>setRegion(e.target.value)} style={{backgroundColor:"#eee", color:"#000"}}>
                            <MenuItem value="eu1">Europe 1 (EU)</MenuItem>
                            <MenuItem value="nam1">North America 1 (NA)</MenuItem>
                            <MenuItem value="au1">Asia-Pacific 1 (AU)</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={()=>connectMutation.mutate()} disabled={connectMutation.isLoading || !appId || !accessKey || !region} style={{marginTop:"10px", padding:"10px 0", fontWeight:"bold", backgroundColor:"#8e44ad"}}>
                        {connectMutation.isLoading?"Connecting...":"Connect"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{padding:"20px", minHeight:"100vh", backgroundColor:"whitesmoke"}}>
            <Typography variant="h5" style={{color:"#333", marginBottom:"20px", textAlign:"center"}}>TTN Sensors Latest Values</Typography>

            {connected && (
                <div style={{textAlign:"center", marginBottom:"20px"}}>
                    <Button variant="outlined" color="secondary" onClick={()=>toggleForm(true)} style={{fontWeight:"bold", color:"#333", borderColor:"#333"}}>Connect TTN App</Button>
                    <Button variant="outlined" color="error" onClick={handleDisconnect} style={{fontWeight:"bold", color:"#333", borderColor:"#333", marginLeft:"10px"}}>Disconnect</Button>
                </div>
            )}

            <MapContainer
                center={center}
                zoom={positions.length > 0 ? 6 : 10}
                style={{ height: "500px", width: "100%", marginBottom: "20px", borderRadius: "8px" }}
            >
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution='Tiles &copy; Esri &mdash; Source: USGS, Esri, DeLorme, NGA, NPS'
                />
                {positions.length > 0 && <RecenterOnPositions positions={positions} />}

                {latestPerDevice
                    .filter(r => r.latitude && r.longitude)
                    .map(record => (
                        <Marker key={record.id} position={[record.latitude, record.longitude]} icon={purpleIcon}>
                            <Popup>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <strong>{record.deviceId}</strong>
                                    <span>Temp: {record.temperature ?? "-"}°C</span>
                                    <span>Humidity: {record.humidity ?? "-"}%</span>

                                    {/* Status from extraFields only */}
                                    {record.extraFields?.status !== undefined && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Status:
                <span
                    style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: record.extraFields.status === 1 ? "green" : "red",
                        marginLeft: 4,
                        verticalAlign: "middle",
                    }}
                />
              </span>
                                    )}

                                    {/* Other extraFields */}
                                    {record.extraFields &&
                                        Object.entries(record.extraFields)
                                            .filter(([key]) => key !== "status")
                                            .map(([key, value]) => (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            ))}
                                </div>
                            </Popup>

                            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <strong>{record.deviceId}</strong>
                                    <span>Temp: {record.temperature ?? "-"} °C</span>
                                    <span>Humidity: {record.humidity ?? "-"} %</span>
                                    <span>Lat: {record.latitude ?? "-"}</span>
                                    <span>Lng: {record.longitude ?? "-"}</span>

                                    {/* Status from extraFields only */}
                                    {record.extraFields?.status !== undefined && (
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Status:
                <span
                    style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: record.extraFields.status === 1 ? "green" : "red",
                        marginLeft: 4,
                        verticalAlign: "middle",
                    }}
                />
              </span>
                                    )}

                                    {/* Other extraFields */}
                                    {record.extraFields &&
                                        Object.entries(record.extraFields)
                                            .filter(([key]) => key !== "status")
                                            .map(([key, value]) => (
                                                <span key={key}>
                    {key}: {value}
                  </span>
                                            ))}
                                </div>
                            </Tooltip>
                        </Marker>
                    ))}
            </MapContainer>


            <Grid container spacing={2}>
                {latestPerDevice.map(record => (
                    <Grid item xs={12} sm={4} md={3} lg={2} key={record.id}>
                        <div
                            style={{
                                backgroundColor: '#D3A1FF',
                                padding: "15px",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "5px",
                                width: "160px",
                                height: "240px",
                                overflow: "auto"
                            }}
                        >
                            <Typography variant="h6" noWrap>{record.deviceId}</Typography>

                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                                <Typography variant="body2" color="textSecondary">
                                    Last Received: <strong>{new Date(record.receivedAt).toLocaleString()}</strong>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Latitude: <strong>{record.latitude ?? "-"}</strong>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Longitude: <strong>{record.longitude ?? "-"}</strong>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Temperature: <strong>{record.temperature ?? "-"}</strong> °C
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Humidity: <strong>{record.humidity ?? "-"}</strong> %
                                </Typography>

                                {record.extraFields?.status !== undefined && (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        style={{display: "flex", alignItems: "center", gap: 6}}
                                    >
                                        Status:
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: 12,
                                                height: 12,
                                                borderRadius: "50%",
                                                backgroundColor: record.extraFields.status === 1 ? "green" : "red",
                                            }}
                                        />
                                    </Typography>
                                )}

                                {record.extraFields &&
                                    Object.entries(record.extraFields)
                                        .filter(([key]) => key !== "status") // exclude status since already displayed
                                        .map(([key, value]) => (
                                            <Typography variant="body2" color="textSecondary" key={key}>
                                                {key}: <strong>{value}</strong>
                                            </Typography>
                                        ))}
                            </div>
                        </div>
                    </Grid>
                ))}


            </Grid>
        </div>
    );
};

export default TtnSensorPage;
