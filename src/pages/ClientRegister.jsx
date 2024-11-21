import React, { useState, useContext } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Stack } from '@mui/material';

const ClientRegister = () => {
    const { clientRegister, setMessage } = useAuthContext();
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        ic: '',
    });

    const validate = () => {
        const newErrors = {};

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        // Validate phone number (e.g., Malaysian format)
        const phoneRegex = /^\d{10,12}$/; // Adjust based on your requirements
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10-12 digits';
        }

        // Validate NRIC (example for Malaysian NRIC: 12 digits)
        const icRegex = /^\d{12}$/;
        if (!icRegex.test(formData.ic)) {
            newErrors.ic = 'NRIC must be a 12-digit number';
        }

        // Validate password length
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        // Validate username
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const result = await clientRegister(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.phone,
                    formData.ic
                );
                if (result.success) {
                    console.log('Registration successful!');
                    setMessage(result.message);
                    navigate('/login');
                } else {
                    setMessage(result.message);
                }
            } catch (error) {
                console.error('Register error:', error);
                setMessage('An error occurred. Please try again.');
            }
        } else {
            console.log('Validation failed:', errors);
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
                    height: '90vh',
                    position: 'relative',
                }}>
                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Create a Client Account
                        </Typography>
                        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                            <Stack direction="column" spacing={3}>
                            <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                                <TextField
                                    fullWidth
                                    label="NRIC"
                                    name="ic"
                                    value={formData.ic}
                                    onChange={handleChange}
                                    error={!!errors.ic}
                                    helperText={errors.ic}
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
                                            to='/register-staff'
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
                                            Register here for a staff account
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

export default ClientRegister;
