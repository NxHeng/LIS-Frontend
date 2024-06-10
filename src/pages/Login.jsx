import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Login = () => {
    const { login } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result.success) {
                console.log('Login successful!');
                navigate('/home');
            } else {
                console.error('Login failed:', result.message);
            }

        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };


    return (
        <>
            <Container sx={{ mt: 10 }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
                </Box>
            </Container>
        </>

    );
};

export default Login;
