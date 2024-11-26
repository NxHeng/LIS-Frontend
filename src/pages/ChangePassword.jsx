import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Card, CardContent, Stack } from '@mui/material';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { changePassword } = useAuthContext(); // Function to call API
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (event) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        const result = await changePassword({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        });
        if (result.success) {
            alert('Password changed successfully!');
            //clear form
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            // navigate to profile page
            navigate('/profile');
        } else {
            alert(result.message); // Display the error message from the backend
        }
    };


    return (
        <>
            <Background />
            <Container component="main" maxWidth="md" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                position: 'relative',
            }}>
                <Card sx={{ width: '60%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
                            Change Password
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack direction="column" spacing={2}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="oldPassword"
                                    label="Old Password"
                                    type="password"
                                    value={passwords.oldPassword}
                                    onChange={handleChange}
                                    autoComplete="old-password"
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ ...muiStyles.detailsButtonStyle, }}
                                >
                                    Change Password
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default ChangePassword;
