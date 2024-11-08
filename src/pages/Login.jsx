import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useAuthContext } from '../context/AuthContext';
import { set } from 'lodash';

const Login = () => {
    const { login, setMessage } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const processLogin = async () => {
            try {
                const result = await login(email, password);
                console.log('Login Result:', result.message);
                if (result.success) {
                    console.log('Login successful!');
                    navigate('/home');
                } else {
                    // Handle unsuccessful login
                    console.log('Login failed:', result.message);
                    setMessage(result.message);
                }
            } catch (error) {
                // Handle unexpected errors
                console.error('Login error:', error);
                setMessage('An error occurred. Please try again.');
            }
        }
        processLogin();
    };

    return (
        <Container>
            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
                </Box>
            </Container>
        </Container>
    );
};

export default Login;
