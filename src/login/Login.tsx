import React, { useState } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

// @ts-ignore
function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ username: '', password: '', login: '' });
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let hasError = false;
        const newError = { username: '', password: '', login: '' };

        if (!username.trim()) {
            newError.username = 'Username is required';
            hasError = true;
        }
        if (!password.trim()) {
            newError.password = 'Password is required';
            hasError = true;
        }

        setError(newError);

        if (hasError) return;

        try {
            const response = await axios.post('http://localhost:8080/api/user/login', null, {
                params: { username, password }
            });

            if (response.status === 204) {
                onLogin();
                navigate('/HomePage');
            } else {
                setError({ ...newError, login: 'Invalid username or password' });
            }

        } catch (err) {
            setError({ ...newError, login: 'Invalid username or password' });
        }
    };

    return (
        <div>
            <Paper elevation={3} style={{ padding: '20px', maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            error={!!error.username}
                            helperText={error.username}
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
                            error={!!error.password}
                            helperText={error.password}
                        />
                    </div>
                    {error.login && (
                        <Typography style={{ color: 'red', marginBottom: '10px' }}>
                            {error.login}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        sx={{
                            backgroundColor: '#D3A1FF',
                            color: '#000',
                            '&:hover': {
                                backgroundColor: '#c28eff'
                            }
                        }}
                    >
                        Login
                    </Button>

                </form>
            </Paper>
        </div>
    );
}

export default Login;
