import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const DocumentationScreen = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={6} sx={{ padding: 2 }}>
                    <Typography variant="h4" gutterBottom color="text.secondary">
                        MQTT Broker and Data Transmission
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        The MQTT (Message Queuing Telemetry Transport) protocol is used for sending data between devices
                        in IoT systems. In this application, the MQTT broker used is Mosquitto, which allows for the
                        transmission of sensor data to the Spring Boot application.
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        It's important to note that for this setup, no username and password are required for broker access.
                        Detailed configurations of the broker, including connection settings, are provided in the text of the thesis.
                        You can refer to those sections for a deeper understanding of the broker settings and security mechanisms.
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        To send data without a username or password, use the following command:
                    </Typography>
                    <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`mosquitto_pub -h "broker-ip-address" -p 1883 -t "sensors/topic1" -m "{\\"value\\":29.5}"`}
                    </pre>
                    <Typography paragraph color="text.secondary">
                        This command publishes a message to the topic <strong>"sensors/topic1"</strong> on the MQTT broker with the
                        following JSON payload:
                    </Typography>
                    <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`{
    "value": 20.5
}`}
</pre>

                    <Typography paragraph color="text.secondary">
                        The Spring Boot application listens to this topic and processes the data, recording sensor
                        measurements based on the messages sent through the <strong>mosquitto_pub</strong> command.
                    </Typography>
                    <Typography paragraph color="text.secondary">
                        If your broker requires authentication (username and password), you can use the following command:
                    </Typography>
                    <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`mosquitto_pub -h "broker-ip-address" -p 1883 -u "your-username" -P "your-password" -t "sensors/topic1" -m '{ "value": 29.5}'`}
</pre>
                    <Typography paragraph color="text.secondary">
                        In this case, you would specify your username using the <strong>-u</strong> option and your password with the <strong>-P</strong> option. This command is required when connecting to a secured MQTT broker.
                    </Typography>

                    <Typography paragraph color="text.secondary">
                        Additionally, the application allows you to dynamically connect to different MQTT brokers by specifying the broker URL and optional credentials through the user interface or REST API. By providing the broker URI, username, and password (if required), the system will automatically establish a connection, subscribe to all sensor topics, and process incoming messages. This ensures flexibility in connecting to different environments and simplifies testing with multiple brokers.
                    </Typography>

                    <Typography paragraph color="text.secondary">
                        This system allows for efficient data exchange between IoT sensors and the backend application,
                        ensuring that sensor readings are processed and stored appropriately. Further details on the
                        broker configuration and example code for the Spring Boot listener are also provided in the thesis.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default DocumentationScreen;
