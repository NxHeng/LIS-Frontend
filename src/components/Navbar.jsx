import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Card, CardContent, Stack } from '@mui/material';

import { Link, useLocation } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useCreateContext } from '../context/CreateContext';
import { useSocketContext } from '../context/SocketContext';

const pages = ['Home', 'Cases', 'Tasks', 'Notifications', 'Announcement'];
const settings = ['Profile', 'Account'];

const Navbar = () => {
    const { user, logout, loading } = useAuthContext();
    const { toNewCase } = useCreateContext();
    const { notifications } = useSocketContext();
    // const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        if (notifications.length > 0) {
            setSnackbarMessage(`${notifications[0].message}`);
            setSnackbarOpen(true);
        }
    }, [notifications]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        logout();
        handleCloseUserMenu();
    };

    const handleCreateButton = () => {
        handleCloseNavMenu();
        toNewCase();
    };

    // Close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Prevent closing if clicked away
        }
        setSnackbarOpen(false);
    };

    // Render different card designs for each category
    const renderNotificationCard = (notification) => {
        return (
            <Card key={notification._id} sx={{ mb: 2, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        {/* Left Section (icon + time) */}
                        <Box sx={{ flexBasis: '30%', pl: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {notification.type === 'deadline' && 'Task Deadline Approaching'}
                                {notification.type === 'reminder' && 'Task Reminder'}
                                {notification.type === 'new_case' && 'New Case Created'}
                                {notification.type === 'detail_update' && 'Detail Updated'}
                                {notification.type === 'status_change' && 'Case Status Changed'}
                            </Typography>
                            <Typography variant='body2'>
                                2 minutes ago
                            </Typography>
                        </Box>

                        <Box sx={{ px: 1 }}>
                            |
                        </Box>

                        {/* Middle Section (taskTitle + caseTitle) */}
                        <Box sx={{ flexBasis: '45%', textAlign: 'left' }}>

                            <Typography sx={{ fontWeight: 'bold' }}>{notification.taskId && notification.taskId.description && notification.caseId.matterName}
                            </Typography>
                            <Typography>
                                {notification.taskId && notification.caseId.matterName
                                }
                            </Typography>

                            <Typography sx={{ fontWeight: 'bold' }}>{notification.caseId && notification.caseId.matterName}
                            </Typography>

                        </Box>

                        {/* Right Section (date/status) */}
                        <Box sx={{ flexBasis: '20%', textAlign: 'right' }}>
                            {notification.type === 'deadline' && (
                                <Typography color="error" sx={{ fontWeight: 'bold' }}>{notification.date}</Typography>
                            )}
                            {notification.type === 'reminder' && (
                                <Typography color="error" sx={{ fontWeight: 'bold' }}>{notification.date}</Typography>
                            )}
                            {notification.type === 'new_case' && (
                                <Typography color="green" sx={{ fontWeight: 'bold' }}>New</Typography>
                            )}
                            {notification.type === 'detail_update' && (
                                <Typography color="dodgerblue" sx={{ fontWeight: 'bold' }}>Updated</Typography>
                            )}
                            {notification.type === 'status_change' && (
                                <Typography color="darkorange" sx={{ fontWeight: 'bold' }}>{notification.status}</Typography>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return null; // Don't render anything while loading
    }

    return (
        <>
            {/* Snackbar for displaying new notifications */}
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

            <AppBar elevation={0} position="static" sx={{ backgroundColor: '#f8f9fa', color: 'black' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Legal Information System
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="open navigation menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography
                                            component={Link}
                                            to={`/${page.toLowerCase()}`}
                                            sx={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {page}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LIS
                        </Typography>
                        <Box sx={{ ml: 35, mr: 3, flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
                            <Box>
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        component={Link}
                                        to={`/${page.toLowerCase()}`}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: location.pathname === `/${page.toLowerCase()}` ? 'primary.main' : 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </Box>
                            <Box>
                                <Button
                                    key="create"
                                    component={Link}
                                    to={`/create`}
                                    onClick={handleCreateButton}
                                    variant={location.pathname === '/create' ? 'outlined' : 'contained'}
                                    sx={{
                                        my: 2,
                                        color: location.pathname === `/create` ? 'primary.main' : 'white',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Create
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={user.username.toUpperCase()} src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography
                                            textAlign="center"
                                            component={Link}
                                            to={`/${setting.toLowerCase()}`}
                                            sx={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                                <MenuItem key='logout' onClick={handleLogout}>
                                    <Typography
                                        textAlign="center"
                                        component={Link}
                                        to={`/login`}
                                        sx={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Navbar;
