import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const InformationScreen = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper elevation={6} style={{padding: 16, textAlign: 'center'}}>
                    <h1>Documentation</h1>
                    {/*<p>*/}
                    {/*    LoRa is a radio modulation technique that is essentially a way of manipulating radio waves to*/}
                    {/*    encode information using a chirped (chirp spread spectrum technology), multi-symbol format. LoRa*/}
                    {/*    as a term can also refer to the systems that support this modulation technique or the*/}
                    {/*    communication network that IoT applications use.*/}
                    {/*</p>*/}
                    {/*<p>*/}
                    {/*    The main advantages of LoRa are its long-range capability and its affordability. A typical use*/}
                    {/*    case for LoRa is in smart cities, where low-powered and inexpensive internet of things devices*/}
                    {/*    (typically sensors or monitors) spread across a large area send small packets of data*/}
                    {/*    sporadically to a central administrator.*/}
                    {/*</p>*/}
                    {/*/!*<h2>Spreading Factor (SF)</h2>*!/*/}
                    {/*/!*<p>*!/*/}
                    {/*/!*    The chirp spread spectrum technology uses so-called “chirps,” which are signals with a frequency*!/*/}
                    {/*/!*    that moves up or down (up-chirp or down-chirp respectively) at different speeds. The spreading*!/*/}
                    {/*/!*    factor (SF) determines the speed of a chirp. A high SF means a broadcast has higher range and*!/*/}
                    {/*/!*    penetration, at the cost of increased power consumption. A lower SF is faster and transmits more*!/*/}
                    {/*/!*    data at the same bandwidth and time.*!/*/}
                    {/*/!*</p>*!/*/}
                    {/*/!*<h2>Low Power Wide Area Networks (LPWAN)</h2>*!/*/}
                    {/*/!*<p>*!/*/}
                    {/*/!*    A low-power wide-area network (LPWAN) is a type of wireless telecommunication network that*!/*/}
                    {/*/!*    allows connected devices to have long-range communications capabilities at a low bit rate.*!/*/}
                    {/*/!*    LPWANs are typically used in asset monitoring and management in smart cities and industrial*!/*/}
                    {/*/!*    internet of things deployments. Examples of LPWAN technology include LoRa/LoRaWAN, Sigfox,*!/*/}
                    {/*/!*    MIoTy, Wi-SUN, LTE-M, and NB-IOT.*!/*/}
                    {/*/!*</p>*!/*/}
                    {/*/!*<p>*!/*/}
                    {/*/!*    LPWAN technology has an operating range of up to ten kilometers, and because it is a relatively*!/*/}
                    {/*/!*    simple and lightweight protocol, the devices and hardware are relatively inexpensive. The*!/*/}
                    {/*/!*    transceivers (small battery-powered devices) also use little power, allowing them to run for up*!/*/}
                    {/*/!*    to twenty years.*!/*/}
                    {/*/!*</p>*!/*/}
                    {/*<h2>LoRaWAN</h2>*/}
                    {/*<p>*/}
                    {/*    LoRaWAN is a low-power, wide area networking protocol built on top of the LoRa radio modulation*/}
                    {/*    technique. It wirelessly connects devices to the internet and manages communication between*/}
                    {/*    end-node devices and network gateways. Usage of LoRaWAN in industrial spaces and smart cities is*/}
                    {/*    growing because it is an affordable long-range, bi-directional communication protocol with very*/}
                    {/*    low power consumption — devices can run for ten years on a small battery. It uses the unlicensed*/}
                    {/*    ISM (Industrial, Scientific, Medical) radio bands for network deployments.*/}
                    {/*</p>*/}
                    <p>
                        An end device can connect to a network with LoRaWAN in two ways:
                    </p>
                    <ul>
                        <li>
                            <strong>Over-the-air Activation (OTAA):</strong> A device has to establish a network key and
                            an application session key to connect with the network.
                        </li>
                        <li>
                            <strong>Activation by Personalization (ABP):</strong> A device is hardcoded with keys needed
                            to communicate with the network, making for a less secure but easier connection.
                        </li>
                    </ul>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper elevation={6} style={{padding: 16, textAlign: 'center'}}>
                    <h1>MQTT Broker and Data Transmission</h1>
                    <p>
                        The MQTT (Message Queuing Telemetry Transport) protocol is used for sending data between devices
                        in IoT systems. In this application, the MQTT broker used is Mosquitto, which allows for the
                        transmission of sensor data to the Spring Boot application.
                    </p>
                    <p>
                        To send data, you can use the following example command:
                    </p>
                    <pre style={{textAlign: 'left', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px'}}>
{`mosquitto_pub -t "sensors/topic1" -m "{\"id\":523,\"value\":99.5,\"time\":\"2024-06-14 10:24:55\"}"`}
                    </pre>
                    <p>
                        This command publishes a message to the topic <strong>"sensors/topic1"</strong> with the
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
                        This system allows for efficient data exchange between IoT sensors and the backend application,
                        ensuring that sensor readings are processed and stored appropriately.
                    </p>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default InformationScreen;
