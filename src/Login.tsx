import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';

// @ts-ignore
function Login({ onLogin }) {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [password, setPassword] = useState(localStorage.getItem('password') || '');
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if username and password are already stored in localStorage
        const storedUsername = localStorage.getItem('username');
        const storedPassword = localStorage.getItem('password');
        if (storedUsername && storedPassword) {
            // If credentials are found, automatically attempt login
            setUsername(storedUsername);
            setPassword(storedPassword);
            handleLogin();
        }
    }, []); // Empty dependency array to run this effect only once, on component mount

    const handleLogin = () => {
        // Perform your login logic here, for simplicity, let's assume a basic validation
        if (username === 'admin' && password === 'password') {
            // Store the credentials in localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
            onLogin(); // Call the onLogin function passed as a prop from the parent component
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Typography variant="h5">Login</Typography>
            {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
            <form>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <br />
                <TextField
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <br />
                <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
            </form>
        </div>
    );
}

export default Login;
