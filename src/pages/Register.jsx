import React, { useState, useContext } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Register = () => {
    const { register, setMessage } = useAuthContext();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const result = await register(username, email, password);
            if (result.success) {
                setMessage(result.message);
                navigate('/login');
            }
            else {
                setMessage(result.message);
            }
        } catch (error) {
            console.error('Register error:', error);
            setMessage('An error occurred. Please try again.');
        }

    };

    return (
        <Container sx={{ mt: 10 }}>
            <Typography variant="h4" gutterBottom>Register</Typography>
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
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
                <Button type="submit" variant="contained" color="primary">Register</Button>
            </Box>
        </Container>
    );
};

export default Register;
