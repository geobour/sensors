import React from 'react';
import './App.css';
import ButtonAppBar from "./ButtonAppBar";
import Footer from "./Footer";
import SensorsScreen from "./sensors/SensorsScreen";

function App() {
    return (
        <div className="App">
            <ButtonAppBar />
            <SensorsScreen/>
            <Footer/>
        </div>
    );
}

export default App;
