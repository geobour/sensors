import React, {useEffect, useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import ButtonAppBar from './../layout/NavBar';
import HomePage from './../layout/HomePage';
import InformationScreen from "./../information/InformationScreen";
import SensorsListView from "./../sensors/SensorsListView";
import AddSensorPage from "./../sensors/AddSensorPage";
import SensorDetailsView from "./../sensors/SensorDetailsView";
import BarChartMin from "./../charts/BarChartMin";
import BarChartMax from "./../charts/BarChartMax";
import LineChart from "./../charts/LineChart";
import Login from "../../src/Login";
import EditSensorPage from "../../src/sensors/EditSensorPage";
import BarChartAvg from "../charts/BarChartAvg";
import SensorMapComponent from "../map/SensorMapComponent";

function MainPage() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        // Check if user is already logged in (you may need to implement this based on your authentication mechanism)
        const userLoggedIn = localStorage.getItem('isLoggedIn'); // Example: Check if a token is present
        if (userLoggedIn) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
        // You may need to store login state in localStorage or sessionStorage for persistence across page refreshes
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setLoggedIn(false);
        // Clear login state from localStorage or sessionStorage
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <div>
            {loggedIn ? (
                <>
                    <ButtonAppBar handleLogout={handleLogout} isLoggedIn={loggedIn}/>
                    <Routes>
                        <Route path="/HomePage" element={<HomePage/>}/>
                        <Route path="/sensors" element={<SensorsListView/>}/>
                        <Route path="sensors/:sensorId" element={<SensorDetailsView/>}/>
                        <Route path="sensors/:sensorId/edit" element={<EditSensorPage/>}/>
                        <Route path="sensors/add" element={<AddSensorPage/>}/>
                        <Route path="sensors/:sensorId/bar-chart-max" element={<BarChartMax/>}/>
                        <Route path="sensors/:sensorId/bar-chart-avg" element={<BarChartAvg/>}/>
                        <Route path="sensors/:sensorId/bar-chart-min" element={<BarChartMin/>}/>
                        <Route path="sensors/:sensorId/line-chart" element={<LineChart/>}/>
                        <Route path="information" element={<InformationScreen/>}/>
                        <Route path="sensors/:sensorId/map" element={<SensorMapComponent/>}/>
                        <Route path="/logout" element={<Navigate to="/" replace/>}/>
                        <Route path="*" element={<Navigate to="/HomePage" replace/>}/>
                    </Routes>
                </>
            ) : (
                <Login onLogin={handleLogin}/>
            )}
        </div>
    );
}

export default MainPage;
