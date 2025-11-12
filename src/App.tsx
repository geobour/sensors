import React from 'react';
import MainPage from "./layout/MainPage";
import { QueryClient, QueryClientProvider } from 'react-query';
import Footer from "./layout/Footer";
import { Box } from '@mui/material';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <MainPage />
            <Box sx={{ pt: 4 }}>
                <Footer />
            </Box>
        </QueryClientProvider>
    );
}

export default App;
