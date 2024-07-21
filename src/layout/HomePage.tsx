import React from 'react';

import Footer from "./Footer";

const HomePage = () => {
    return (
        <div>
         
            <div style={{
                height: '100vh',
                background: `url("/Sensor1.jpg") center/cover no-repeat`,
                margin: '20px 0',
                paddingLeft: 20,
                paddingRight: 20,
            }}></div>
            <Footer />
        </div>
    );
};

export default HomePage;
