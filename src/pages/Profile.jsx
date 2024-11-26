import React, { useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    Stack,
    Grid,
    Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthContext } from '../context/AuthContext';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

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

    // const handleEditProfile = () => {
    //     navigate('/editprofile');
    // };

    return (

        <>
            <Background />
            <Container maxWidth="md" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                position: 'relative',
            }}>
                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            color: '#fff',
                            textAlign: 'center',
                            py: 3,
                            borderRadius: 5
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                margin: 'auto',
                                bgcolor: '#ffffff',
                                color: 'primary.main',
                                fontSize: 50,
                                mb: 2,
                            }}
                        >
                            {user?.username?.charAt(0).toUpperCase() || "?"}
                        </Avatar>
                        <Typography variant="h4">{user?.username || 'Loading...'}</Typography>
                        {/* <Typography variant="subtitle1">
                            Role: {user?.role || 'N/A'}
                        </Typography> */}
                    </Box>
                    <CardContent>
                        {user ? (
                            <Grid container spacing={3} sx={{ px: 5, py: 2 }}>
                                {/* Email */}
                                <Grid item xs={12} sm={6}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <EmailIcon fontSize="medium" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Email
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Grid>

                                {/* Phone */}
                                <Grid item xs={12} sm={6}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <PhoneIcon fontSize="medium" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Phone
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {user.phone || 'Not available'}
                                    </Typography>
                                </Grid>

                                {/* Role */}
                                <Grid item xs={12} sm={6}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <PersonIcon fontSize="medium" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" color="textSecondary">
                                            Role
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">
                                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "N/A"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography variant="body1" align="center">
                                Loading...
                            </Typography>
                        )}

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="end"
                            sx={{ mt: 2 }}
                        >
                            {/* <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={handleEditProfile}
                            >
                                Edit Profile
                            </Button> */}
                            <Button
                                variant="text"
                                color="primary"
                                startIcon={<LockResetIcon />}
                                onClick={handleChangePassword}
                                sx={muiStyles.buttonStyle}
                            >
                                Change Password
                            </Button>
                            <Button
                                variant="text"
                                color="primary"
                                startIcon={<ExitToAppIcon />}
                                onClick={handleLogout}
                                sx={muiStyles.buttonStyle}
                            >
                                Logout
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default Profile;
