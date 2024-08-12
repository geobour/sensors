import React from 'react';

import Footer from "./Footer";

const HomePage = () => {
    return (
        <div>
         
            <div style={{
                height: '100vh',
                background: `url("iot.png") center/cover no-repeat`,
                margin: '0px 0',
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: '#333'
            }}></div>
            <Footer />
        </div>
    );
};

export default HomePage;
