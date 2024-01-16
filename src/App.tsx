import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
    // Mock data for the bar chart
    const barChartData = [5, 7, 11, 14, 19, 25, 28, 32,25,19,12,10];
    const barChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September','October', 'November','December'];

// Mock data for the line chart
    const lineChartData = [5, 6, 8, 10, 10, 11, 12, 13, 14, 15,16,13,12, 12,11,10,10,9,8,7,7,6,4,5,7,9];
    const lineChartLabels = ['00:00','01:00','02:00','03:00', '00:04','05:00','06:00','07:00','08:00',
        '09:00','10:00','11:00','12:00','13:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00',
        '20:00','21:00','22:00','23:00', ];


    return (
        <div>
            <ButtonAppBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sensors" element={<SensorsListView />} />
                <Route path="/sensors/:sensorId" element={<SensorDetailsView />} />
                {/*<Route path="/charts" element={<BarChart data={barChartData} labels={barChartLabels} />} />*/}
                {/*<Route path="/charts" element={<LineChart data={lineChartData} labels={lineChartLabels} />} />*/}
                <Route path="/bar-chart" element={<BarChart data={barChartData} labels={barChartLabels} />} />
                <Route path="/line-chart" element={<LineChart data={lineChartData} labels={lineChartLabels} />} />
                <Route path="/information" element={<InformationScreen />} />
                <Route path="/add-sensor" element={<AddSensorPage />} /> {/* Add this line for the new page */}
                <Route path="/*" element={<HomePage />} />
                {/*<Route path="/*" element={<PageNotFound />} />*/}
            </Routes>
            <Footer />
        </div>
    );
}
export default App;