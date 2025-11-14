// @ts-nocheck
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
                        It supports both <strong>HiveMQ / Mosquitto (Custom MQTT)</strong> for general IoT use and <strong>TTN (The Things Network)</strong> for LoRaWAN-based integrations.
                    </Typography>

                    <Divider sx={{ marginY: 3 }} />

                    {/* ===== MQTT GENERAL SUPPORT ===== */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                            ⚙️ MQTT Connection Capabilities
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            The system fully supports <strong>topic wildcards</strong> (<code>+</code> and <code>#</code>), multiple brokers, and secure communication.
                            This enables subscribing to multiple devices or hierarchical topics efficiently — e.g.:
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
                            {`# Subscribe to all sensors
sensors/#

# Subscribe to all devices' temperature data
sensors/+/temperature`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ mt: 2 }}>
                            Each MQTT client connection supports:
                        </Typography>
                        <ul style={{ color: 'gray' }}>
                            <li>✅ <strong>Topic wildcards</strong> (<code>+</code> and <code>#</code>)</li>
                            <li>✅ <strong>QoS 0 and 1</strong> message delivery</li>
                            <li>✅ <strong>Username / Password</strong> authentication</li>
                            <li>✅ <strong>Optional SSL/TLS</strong> (port <code>8883</code>)</li>
                            <li>✅ <strong>Dynamic broker switching</strong> between HiveMQ, Mosquitto, and TTN</li>
                        </ul>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* ===== HIVE SECTION ===== */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                            🐝 HiveMQ / 🐙 Mosquitto Local MQTT Implementation
                        </Typography>

                        <Typography paragraph color="text.secondary">
                            The <strong>HiveMQ and Mosquitto implementation</strong> provides a lightweight and low-power way to transmit IoT data.
                            Each sensor sends a minimal JSON payload such as <code>{"{ \"value\": 28.5 }"}</code>.
                            The backend enriches it with metadata like <code>sensorId</code>, <code>type</code>, and timestamps for storage and analytics.
                        </Typography>

                        <Typography paragraph color="text.secondary">
                            Each instance provides the following connection parameters:
                        </Typography>
                        <ul style={{ color: 'gray' }}>
                            <li><strong>Server URI:</strong> e.g. <code>m20.cloudmqtt.com:1883</code></li>
                            <li><strong>Username / Password</strong> credentials</li>
                            <li><strong>Optional SSL connection</strong> via port <code>8883</code></li>
                        </ul>

                        <Typography paragraph color="text.secondary">
                            Example publish:
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
                            The backend automatically matches the topic to a registered sensor and stores:
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

                        {/* Academic Insight Box */}
                        <Box
                            sx={{
                                bgcolor: '#e8f0fe',
                                borderLeft: '4px solid #1976d2',
                                padding: 2,
                                borderRadius: 2,
                                marginY: 2,
                            }}
                        >
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                💡 Academic Insight:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                By minimizing payload size and offloading metadata enrichment to the backend, the system achieves energy efficiency and scalability — ideal for LoRa-based and low-power IoT devices.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* ===== TTN SECTION ===== */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" gutterBottom color="primary">
                            🛰️ The Things Network (TTN) Integration
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            TTN integration enables LoRaWAN devices to send uplinks to your backend via the TTN MQTT broker.
                            The backend subscribes using the topic pattern <code>v3/&lt;appId&gt;@ttn/devices/+/up</code> — the <code>+</code> wildcard receives messages from all devices automatically.
                        </Typography>

                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Connection Requirements:</strong>
                        </Typography>
                        <ul style={{ color: 'gray' }}>
                            <li><strong>App ID</strong></li>
                            <li><strong>Access Key</strong></li>
                            <li><strong>Region</strong> (determines MQTT host)</li>
                        </ul>

                        <Typography paragraph color="text.secondary">
                            No need to manually configure:
                        </Typography>
                        <ul style={{ color: 'gray' }}>
                            <li>❌ Device ID (received automatically via topic)</li>
                            <li>❌ MQTT host (derived from region)</li>
                            <li>❌ Port (always <code>8883</code>)</li>
                        </ul>

                        <Typography paragraph color="text.secondary">
                            Example TTN MQTT connection:
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
                            {`Host: eu1.cloud.thethings.network
Port: 8883
Username: <AppID>
Password: <Access Key>
Topic: v3/<AppID>@ttn/devices/+/up`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ mt: 2 }}>
                            TTN sends Base64-encoded payloads (<code>frm_payload</code>) which are decoded using a JavaScript Payload Formatter:
                        </Typography>

                        <Typography
                            sx={{
                                backgroundColor: '#f5f5f5',
                                color: '#000',
                                padding: 2,
                                borderRadius: 2,
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                            }}
                        >
                            {`function decodeUplink(input) {
  const bytes = input.bytes;
  const data = {};

  if (!bytes || bytes.length === 0) {
    return { data };
  }

  if (bytes.length >= 1) data.valueOne = (bytes[0] << 24 >> 24) / 10.0;
  if (bytes.length >= 2) data.valueTwo = bytes[1];

  if (bytes.length >= 6) {
    const latRaw = (bytes[2] << 24) | (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
    data.latitude = latRaw / 1e7;
  }

  if (bytes.length >= 10) {
    const lonRaw = (bytes[6] << 24) | (bytes[7] << 16) | (bytes[8] << 8) | bytes[9];
    data.longitude = lonRaw / 1e7;
  }

  if (bytes.length >= 11) data.valueThree = bytes[10];
  if (bytes.length >= 13) data.valueFour = ((bytes[11] << 8) | bytes[12] << 16 >> 16) / 10.0;
  if (bytes.length >= 15) data.valueFive = ((bytes[13] << 8) | bytes[14] << 16 >> 16) / 10.0;
  if (bytes.length >= 16) data.valueSix = bytes[15];

  return { data };
}`}
                        </Typography>

                        <Typography paragraph color="text.secondary" sx={{ marginTop: 2 }}>
                            After decoding, the backend stores structured TTN data and maps it to <code>TtnSensorRecord</code> entities with all relevant fields like latitude, longitude, values, RSSI, SNR, etc.
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: 3 }} />

                    {/* ===== SUMMARY SECTION ===== */}
                    <Box>
                        <Typography variant="h5" gutterBottom color="primary">
                            📦 Data Flow Summary
                        </Typography>
                        <Typography paragraph color="text.secondary">
                            - <strong>HiveMQ / Mosquitto Mode:</strong> Publishes minimal JSON payloads containing only <code>value</code>. The backend enriches and stores full records.<br />
                            - <strong>TTN Mode:</strong> Receives structured uplink data decoded from LoRaWAN payloads. Automatically maps to correct device and stores data.<br />
                            Both pathways ultimately create <code>SensorRecord</code> entities in your database.
                        </Typography>

                        <Typography variant="h6" gutterBottom color="primary">
                            🔍 Summary Table
                        </Typography>

                        <Box sx={{
                            overflowX: 'auto',
                            backgroundColor: '#fafafa',
                            borderRadius: 2,
                            padding: 2,
                            mt: 1
                        }}>
                            <Typography
                                component="pre"
                                sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                }}
                            >
                                {`| Integration         | Broker Type   | Auth Method          | SSL | Wildcards | Notes |
|----------------------|---------------|---------------------|-----|------------|-------|
| HiveMQ / Mosquitto   | Custom MQTT   | Username / Password | ✅  | ✅ (+, #)  | Ideal for general IoT sensors |
| TTN (LoRaWAN)        | TTN MQTT      | AppID / Access Key  | ✅  | ✅ (+)     | Auto-subscribes to all devices |
| HiveMQ Public Broker | Public MQTT   | None (Open Access)  | ❌  | ✅ (+, #)  | For testing; rate limited |
| EMQX / CloudMQTT     | Cloud MQTT    | Optional Username / Password | ✅ | ✅ (+, #) | Fully compatible with your backend |`}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DocumentationScreen;
