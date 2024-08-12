import React from 'react';
import MainPage from "./layout/MainPage";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <MainPage />
            {/*<Footer/>*/}
        </QueryClientProvider>
    );
}

export default App;
