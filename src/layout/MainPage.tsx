import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ButtonAppBar from './../layout/NavBar';
import HomePage from './../layout/HomePage';
import DocumentationScreen from "../documentation/documentationScreen";
import SensorsListView from "./../sensors/SensorsListView";
import AddSensorPage from "./../sensors/AddSensorPage";
import SensorDetailsView from "./../sensors/SensorDetailsView";
import BarChartMin from "./../charts/BarChartMin";
import BarChartMax from "./../charts/BarChartMax";
import LineChart from "./../charts/LineChart";
import Login from "../login/Login";
import EditSensorPage from "../../src/sensors/EditSensorPage";
import BarChartAvg from "../charts/BarChartAvg";
import Dashboard from "../charts/Dashboard";
import PageNotFound from '../layout/PageNotFound';
import MapPage from "../map/MapPage";

function MainPage() {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {

        const userLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
        if (userLoggedIn) {
            setLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isLoggedIn');
    };

    return (
        <div>
            {loggedIn ? (
                <>
                    <ButtonAppBar handleLogout={handleLogout} isLoggedIn={loggedIn}/>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/HomePage" element={<HomePage />} />
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/sensors" element={<SensorsListView/>}/>
                        <Route path="/sensors/:sensorId" element={<SensorDetailsView/>}/>
                        <Route path="/sensors/:sensorId/edit" element={<EditSensorPage/>}/>
                        <Route path="/sensors/add" element={<AddSensorPage/>}/>
                        <Route path="/sensors/:sensorId/bar-chart-max" element={<BarChartMax/>}/>
                        <Route path="/sensors/:sensorId/bar-chart-avg" element={<BarChartAvg/>}/>
                        <Route path="/sensors/:sensorId/bar-chart-min" element={<BarChartMin/>}/>
                        <Route path="/sensors/:sensorId/line-chart" element={<LineChart/>}/>
                        <Route path="/Documentation" element={<DocumentationScreen/>}/>
                        <Route path="/sensors/:sensorId/map" element={<MapPage/>}/>
                        <Route path="/logout" element={<Navigate to="/" replace/>}/>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </>
            ) : (
                <Login onLogin={handleLogin}/>
            )}
        </div>
    );
}

export default MainPage;
