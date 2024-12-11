import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Stack, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import Background from '../components/Background';

const CreateAccount = () => {
    const { registerUser } = useAuthContext(); // `createAccount` handles account creation API call
    const accountRoles = ['client', 'solicitor', 'clerk', 'admin']; // Define account types
    const [accountRole, setAccountRole] = useState('client'); // Default to 'client'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        ic: '',
    });
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        // Basic validation rules
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        if (accountRole === 'client') {
            const phoneRegex = /^\d{10,12}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Phone number must be 10-12 digits';
            }
            const icRegex = /^\d{12}$/;
            if (!icRegex.test(formData.ic)) {
                newErrors.ic = 'NRIC must be a 12-digit number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const result = await registerUser(...Object.values(formData), accountRole);
                if (result.success) {
                    setSnackbarOpen(true);
                    setSnackbarMessage(result.message);
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        phone: '',
                        ic: '',
                    });
                    setAccountRole('client');
                } else {
                    setSnackbarMessage(result.message);
                }
            } catch (error) {
                console.error('Account creation error:', error);
                setSnackbarMessage('An error occurred. Please try again.');
            }
        } else {
            console.log('Validation failed:', errors);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Prevent closing if clicked away
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000} // Closes automatically after 4 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning of the Snackbar
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Background />
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                    position: 'relative',
                }}
            >
                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2 }}>
                            Create Account
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack direction="column" spacing={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Account Role</InputLabel>
                                    <Select
                                        value={accountRole}
                                        onChange={(e) => setAccountRole(e.target.value)}
                                    >
                                        {accountRoles.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                {accountRole === 'client' && (
                                    <>
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
                                    </>
                                )}
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
                                    }}
                                >
                                    Create Account
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default CreateAccount;
