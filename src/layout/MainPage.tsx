import React from 'react';
import {Routes, Route} from 'react-router-dom';
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

function MainPage() {

    return (
        <div>
            <ButtonAppBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/sensors" element={<SensorsListView/>}/>
                <Route path="sensors/:sensorId" element={<SensorDetailsView/>}/>
                <Route path="sensors/:sensorId/edit" element={<EditSensorPage/>}/>
                <Route path="sensors/add" element={<AddSensorPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="sensors/:sensorId/bar-chart-max" element={<BarChartMax/>}/>
                <Route path="sensors/:sensorId/bar-chart-avg" element={<BarChartAvg/>}/>
                <Route path="sensors/:sensorId/bar-chart-min" element={<BarChartMin/>}/>
                <Route path="sensors/:sensorId/line-chart" element={<LineChart/>}/>
                <Route path="information" element={<InformationScreen/>}/>
            </Routes>
        </div>
    );
}

export default MainPage;
