import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

// @ts-ignore
function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/user/login', null, {
                params: {
                    username,
                    password
                }
            });
            onLogin(); // Call the onLogin function passed from the parent component
            navigate('/HomePage'); // Redirect to home page after successful login

        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div>
            <Paper elevation={3} style={{ padding: '20px', maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                        />
                    </div>
                    {error && <Typography style={{ color: 'red', marginBottom: '10px' }}>{error}</Typography>}
                    <Button variant="contained" type="submit">Login</Button>
                </form>
            </Paper>
        </div>
    );
}

export default Login;
