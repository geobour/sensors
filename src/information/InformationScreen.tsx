import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const InformationScreen = () => {
    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Paper elevation={6} style={{padding: 16}}>
                    <h1>MQTT Broker and Data Transmission</h1>
                    <p>
                        The MQTT (Message Queuing Telemetry Transport) protocol is used for sending data between devices
                        in IoT systems. In this application, the MQTT broker used is Mosquitto, which allows for the
                        transmission of sensor data to the Spring Boot application.
                    </p>
                    <p>
                        It's important to note that for this setup, no username and password are required for broker access.
                        Detailed configurations of the broker, including connection settings, are provided in the text of the thesis.
                        You can refer to those sections for a deeper understanding of the broker settings and security mechanisms.
                    </p>
                    <p>
                        To send data without a username or password, use the following command:
                    </p>
                    <pre style={{textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
{`mosquitto_pub -h "broker-ip-address" -p 1883 -t "sensors/topic1" -m "{\"id\":523,\"value\":99.5,\"time\":\"2024-06-14 10:24:55\"}"`}
                    </pre>
                    <p>
                        This command publishes a message to the topic <strong>"sensors/topic1"</strong> on the MQTT broker with the
                        following JSON payload:
                    </p>
                    <pre style={{textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
{`{
    "id": 523,
    "value": 99.5,
    "time": "2024-06-14 10:24:55"
}`}
                    </pre>
                    <p>
                        The Spring Boot application listens to this topic and processes the data, recording sensor
                        measurements based on the messages sent through the <strong>mosquitto_pub</strong> command.
                    </p>

                    <p>
                        If your broker requires authentication (username and password), you can use the following command:
                    </p>
                    <pre style={{textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
{`mosquitto_pub -h "broker-ip-address" -p 1883 -u "your-username" -P "your-password" -t "sensors/topic1" -m "{\"id\":523,\"value\":99.5,\"time\":\"2024-06-14 10:24:55\"}"`}
                    </pre>
                    <p>
                        In this case, you would specify your username using the <strong>-u</strong> option and your password with the <strong>-P</strong> option. This command is required when connecting to a secured MQTT broker.
                    </p>

                    <p>
                        This system allows for efficient data exchange between IoT sensors and the backend application,
                        ensuring that sensor readings are processed and stored appropriately. Further details on the
                        broker configuration and example code for the Spring Boot listener are also provided in the thesis.
                    </p>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default InformationScreen;
