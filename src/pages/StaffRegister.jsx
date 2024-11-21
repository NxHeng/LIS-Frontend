import React, { useState, useContext } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Stack } from '@mui/material';

const StaffRegister = () => {
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
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/geometric-wallpaper-1.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(10px)',
                    zIndex: -1,
                    backdropFilter: 'blur(8px)'
                }}
            />
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
                            Create a Staff Account
                        </Typography>
                        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={3}>
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
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{
                                        padding: '10px',
                                        fontSize: '16px',
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        '&:hover': {
                                            backgroundColor: '#1976d2',
                                        },
                                    }}>
                                    Register
                                </Button>
                                <Box>
                                    <Typography variant="body2" align="center">
                                        Already have an account?{' '}
                                        <Box
                                            component={Link}
                                            to='/login'
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
                                            Login here
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2" align="center" sx={{ mt: 1 }}>
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
                                            Register here for a client account
                                        </Box>
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default StaffRegister;
