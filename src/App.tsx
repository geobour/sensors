import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ButtonAppBar from './layout/NavBar';
import Footer from './layout/Footer';
import HomePage from './layout/HomePage';
import InformationScreen from "./information/InformationScreen";
import SensorsListView from "./sensors/SensorsListView";
import PageNotFound from "./layout/PageNotFound";
import AddSensorPage from "./sensors/AddSensorPage";
import SensorDetailsView from "./sensors/SensorDetailsView";
import BarChartMin from "./charts/BarChartMin";
import BarChartMax from "./charts/BarChartMax";
import LineChart from "./charts/LineChart";
import { lineChartData, lineChartLabels, barChartLabels, barChartData } from 'src/AppApi';
import Login from "./Login";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to handle login
    const handleLogin = () => {
        // Perform your login logic here
        // For example, set isLoggedIn to true upon successful login
        setIsLoggedIn(true);
    };

    // If not logged in, render a login page or redirect to a login route
    if (!isLoggedIn) {
        // You can render a login component or redirect to a login route here
        // For simplicity, let's assume there's a Login component
        return <Login onLogin={handleLogin} />;
    }

    // If logged in, render the main application
    return (
        <div>
            <ButtonAppBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sensors" element={<SensorsListView />} />
                <Route path="/sensors/:sensorId" element={<SensorDetailsView />} />
                <Route path="/bar-chart-min" element={<BarChartMin data={barChartData} labels={barChartLabels} />} />
                <Route path="/bar-chart-max" element={<BarChartMax data={barChartData} labels={barChartLabels} />} />
                <Route path="/line-chart" element={<LineChart data={lineChartData} labels={lineChartLabels} />} />
                <Route path="/information" element={<InformationScreen />} />
                <Route path="/add-sensor" element={<AddSensorPage />} />
                <Route path="/*" element={<PageNotFound />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
