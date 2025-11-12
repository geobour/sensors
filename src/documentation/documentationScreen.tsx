import React from 'react';
import { Paper, Grid, Typography, Divider, Box } from '@mui/material';

const DocumentationScreen = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom color="text.secondary">
                        MQTT Broker and Data Transmission
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        This application uses the <strong>MQTT protocol</strong> to exchange real-time sensor data between edge devices and the backend system.
                        It supports two main connection modes: <strong>HiveMQ / Custom MQTT</strong> for generic IoT sensors, and <strong>TTN (The Things Network)</strong> for LoRaWAN devices.
                    </Typography>

                    <Divider sx={{ marginY: 3 }} />

                    {/* HIVE SECTION */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                            🐝 HiveMQ / 🐙 Mosquitto Local MQTT Implementation
                        </Typography>

                        <Typography paragraph color="text.secondary">
                            The <strong>custom HiveMQ and Mosquitto implementation</strong> is designed with a focus on <strong>low-power communication efficiency</strong> and <strong>edge simplicity</strong>.
                            Each sensor transmits only a minimal JSON payload (e.g., <code>{"{ \"value\": 28.5 }"}</code>), which significantly reduces data transmission size.
                            This approach aligns with <em>LoRaWAN low-energy design principles</em>, minimizing uplink overhead and optimizing device battery lifespan.
                        </Typography>

                        <Typography paragraph color="text.secondary">
                            Upon receiving this lightweight payload, the backend enriches it with contextual metadata such as <code>sensorId</code>, <code>type</code>, <code>unit</code>, and a timestamp.
                            This enrichment is performed by the <code>MqttDataService</code>, which dynamically maps each topic (e.g., <code>sensors/topic1</code>) to a registered sensor in the database.
                            The result is a full <strong>SensorRecord</strong> object stored for analytics and visualization purposes.
                        </Typography>

                        <Typography paragraph color="text.secondary">
                            From an architectural perspective, this approach supports a <strong>multi-network and multi-sensor ecosystem</strong>.
                            The same backend is capable of connecting to both <strong>HiveMQ</strong> and <strong>Mosquitto</strong> (standard MQTT brokers), as well as <strong>TTN (LoRaWAN)</strong> brokers dynamically.
                            This allows users to integrate sensors from various communication protocols under a unified data processing layer, enabling the application to act as a <strong>multi-application IoT hub</strong> that scales horizontally across diverse IoT infrastructures.
                        </Typography>


                        {/* Academic Insight Box */}
                        <Box sx={{
                            bgcolor: '#e8f0fe',
                            borderLeft: '4px solid #1976d2',
                            padding: 2,
                            borderRadius: 2,
                            marginY: 2
                        }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                💡 Academic Insight:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                By transmitting only the numeric sensor value and delegating metadata enrichment to the backend, the system achieves significant energy efficiency and protocol independence — essential for LoRa-based low-power networks and scalable multi-sensor IoT systems.
                            </Typography>
                        </Box>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Example HiveMQ Publish Command:</strong>
                        </Typography>
                        <Typography
                            sx={{
                                backgroundColor: '#f5f5f5',
                                padding: 2,
                                borderRadius: 2,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                            }}
                        >
                            {`Topic:
"sensors/topic1"

Message:
{"value": 28.5}`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ mt: 2 }}>
                            The frontend (or any MQTT client) publishes to the topic pattern <code>sensors/&lt;sensor-topic&gt;</code> with a minimal payload containing only the <code>value</code>.
                            The backend automatically finds the corresponding sensor in the database and enriches the record with metadata (type, unit, sensorId, timestamp, etc.).
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Stored Record Example (After Backend Enrichment):</strong>
                        </Typography>
                        <Typography
                            sx={{
                                backgroundColor: '#f5f5f5',
                                padding: 2,
                                borderRadius: 2,
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                            }}
                        >
                            {`{
  "id": 1023,
  "sensorId": "sensor-001",
  "type": "temperature",
  "value": 28.5,
  "time": "2025-10-20T15:40:30Z"
}`}
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* TTN SECTION */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                            🛰️ The Things Network (TTN) Integration
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            TTN integration allows LoRaWAN sensors to send uplink messages to your application via the TTN MQTT broker.
                            The backend connects to the TTN region broker using your <strong>Application ID</strong> and <strong>Access Key</strong>, and subscribes to the topic pattern <code>v3/&lt;appId&gt;@ttn/devices/+/up</code>.
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>TTN Uplink Structure:</strong>
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            TTN sends uplink messages containing a Base64-encoded <code>frm_payload</code>.
                            Users define a <strong>Decoder Function</strong> in the TTN Console under <em>Payload Formatters</em> to convert bytes into structured data.
                        </Typography>

                        <Typography sx={{
                            backgroundColor: '#1e1e1e',
                            color: '#d4d4d4',
                            padding: 2,
                            borderRadius: 2,
                            fontFamily: 'monospace',
                            fontSize: '0.85rem'
                        }}>
                            {`function decodeUplink(input) {
  const bytes = input.bytes;
  const data = {};
  if (!bytes || bytes.length === 0) return { data };

  data.temperature = (bytes[0] << 24 >> 24) / 10.0;  // signed int8 / 10
  data.humidity = bytes[1];
  const latRaw = (bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
  const lonRaw = (bytes[6] << 24) | (bytes[7] << 16) | (bytes[8] << 8) | bytes[9];
  data.latitude = latRaw / 1e7;
  data.longitude = lonRaw / 1e7;
  data.status = bytes[10];
  return { data };
}`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ marginTop: 2 }}>
                            After decoding, the uplink message includes a structured <code>decoded_payload</code> object which your backend automatically parses.
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Decoded Payload Example:</strong>
                        </Typography>
                        <Typography sx={{
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 2,
                            fontFamily: 'monospace',
                            fontSize: '0.9rem'
                        }}>
                            {`{
  "temperature": -2.5,
  "humidity": 57,
  "latitude": 37.7858548,
  "longitude": 22.2273054,
  "status": 1
}`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ marginTop: 2 }}>
                            The backend’s <code>MqttDataServiceTtn</code> stores and processes this decoded payload, linking it to the correct TTN device ID and timestamp.
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Complete TTN Message Sample:</strong>
                        </Typography>
                        <Typography sx={{
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 2,
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            overflowX: 'auto'
                        }}>
                            {`{
  "end_device_ids": {
    "device_id": "my-new-device",
    "application_ids": { "application_id": "gbapp" }
  },
  "uplink_message": {
    "frm_payload": "5zkWhan0DT+eHgH/EjSrzQ==",
    "decoded_payload": {
      "temperature": -2.5,
      "humidity": 57,
      "latitude": 37.7858548,
      "longitude": 22.2273054,
      "status": 1
    },
    "rx_metadata": [{ "gateway_ids": { "gateway_id": "test" }, "rssi": 42, "snr": 4.2 }],
    "received_at": "2025-10-20T15:40:30.195257463Z"
  }
}`}
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* Summary Section */}
                    <Box>
                        <Typography variant="h5" gutterBottom color="primary">
                            ⚙️ Data Flow Summary
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            - <strong>HiveMQ / Mosquitto Mode:</strong> Sensor values are published as minimal JSON containing only <code>value</code> and automatically mapped to the corresponding sensor based on MQTT topic. Both HiveMQ and Mosquitto brokers are fully supported by the backend.
                            <br />
                            - <strong>TTN Mode:</strong> The Things Network decodes binary payloads using user-defined JavaScript functions and forwards the resulting JSON payloads to your backend via MQTT.
                            <br />
                            Both data streams ultimately create <code>SensorRecord</code> entities in your database.
                        </Typography>

                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DocumentationScreen;
