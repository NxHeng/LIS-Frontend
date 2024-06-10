import React, { useContext, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, token, fetchProfile, logout } = useAuthContext();
    const navigate = useNavigate();


    useEffect(() => {
        if (token) {
            fetchProfile(token);
        } else {
            navigate('/login');
        }
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChangePassword = () => {
        navigate('/changepassword');
    };

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant="h2" gutterBottom>Profile</Typography>
            {user ? (
                <>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="h6" color="grey">
                                Username
                            </Typography>
                            <Typography variant="h5">
                                {user.username}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" color="grey">
                                Email
                            </Typography>
                            <Typography variant="h5">
                                {user.email}
                            </Typography>
                        </Box>
                    </Stack>
                    <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mt: 3, mr: 3 }}>
                        Logout
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleChangePassword} sx={{ mt: 3 }}>
                        Change Password
                    </Button>
                </>
            ) : (
                <Typography variant="body1">Loading...</Typography>
            )}
        </Container>
    );
};

export default Profile;
