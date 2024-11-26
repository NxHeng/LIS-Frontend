import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert, Card, CardContent, Stack } from '@mui/material';
import Background from '../components/Background';
import { useAuthContext } from '../context/AuthContext';

const Login = () => {
    const { login, setMessage } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result.success) {
                console.log('Login successful!');
                navigate(result.role === 'client' ? '/client/mycases' : '/home');
            } else {
                setMessage(result.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Background/>
            <Container component="main"
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    position: 'relative',
                }}>

                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Welcome Back!
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                            <Stack direction="column" spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <Typography variant="body2" sx={{ml:.2}}>
                                        <Box
                                            component={Link}
                                            to='/forgot-password'
                                            sx={{
                                                textDecoration: 'none',
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: 'primary.dark',
                                                },
                                            }}
                                        >
                                            Forgot password?
                                        </Box>
                                    </Typography>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        p: '10px',
                                        fontSize: '16px',
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        '&:hover': {
                                            backgroundColor: '#1976d2',
                                        },
                                    }}
                                >
                                    Login
                                </Button>

                                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                    No account?{' '}
                                    <Box
                                        component={Link}
                                        to='/register-client'
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'primary.main',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                                color: 'primary.dark',
                                            },
                                        }}
                                    >
                                        Create an account
                                    </Box>
                                </Typography>

                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default Login;
