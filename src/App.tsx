import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ButtonAppBar from './layout/NavBar';
import Footer from './layout/Footer';
import HomePage from './layout/HomePage';

import InformationScreen from "./information/InformationScreen";
import SensorsListView from "./sensors/SensorsListView";
import PageNotFound from "./layout/PageNotFound";
import AddSensorPage from "./sensors/AddSensorPage";
import SensorDetailsView from "./sensors/SensorDetailsView";
import BarChart from "./charts/BarChart";
import LineChart from "./charts/LineChart";
import { lineChartData, lineChartLabels,barChartLabels,barChartData } from 'src/AppApi';
function App() {

    return (
        <div>
            <ButtonAppBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sensors" element={<SensorsListView />} />
                <Route path="/sensors/:sensorId" element={<SensorDetailsView />} />
                <Route path="/bar-chart" element={<BarChart data={barChartData} labels={barChartLabels} />} />
                <Route path="/line-chart" element={<LineChart data={lineChartData} labels={lineChartLabels} />} />
                <Route path="/information" element={<InformationScreen />} />
                <Route path="/add-sensor" element={<AddSensorPage />} />
                <Route path="/*" element={<HomePage />} />
                {/*<Route path="/*" element={<PageNotFound />} />*/}
            </Routes>
            <Footer />
        </div>
    );
}
export default App;