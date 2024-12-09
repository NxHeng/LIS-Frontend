import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import io from 'socket.io-client';
import muiStyles from '../styles/muiStyles';
import { jwtDecode } from 'jwt-decode';

import { Link, useLocation } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { useCreateContext } from '../context/CreateContext';
import { useSocketContext } from '../context/SocketContext';
import { useAnnouncementContext } from '../context/AnnouncementContext';

import { Home, Assignment, TaskAlt, Notifications, Announcement } from '@mui/icons-material'; // Import specific icons

const pages = [
    { name: 'Home', icon: <Home /> },
    { name: 'Cases', icon: <Assignment /> },
    { name: 'Tasks', icon: <TaskAlt /> },
    { name: 'Notifications', icon: <Notifications /> },
    { name: 'Announcement', icon: <Announcement /> }
];
const settings = ['Profile', 'Manage Users', 'Notification Settings'];

const Navbar = () => {
    const { logout, loading } = useAuthContext();
    const { toNewCase } = useCreateContext();
    const { socket, setSocket, notifications, handleNewNotification, handleNewAnnouncement } = useSocketContext();
    const { announcements } = useAnnouncementContext();
    const user = jwtDecode(localStorage.getItem('token'));

    // const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [initialNotificationLoad, setInitialNotificationLoad] = useState(true);
    const [initialAnnouncementLoad, setInitialAnnouncementLoad] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // const [userId, setUserId] = useState(null);

    useEffect(() => {
        // setUserId(user._id);
        setSocket(io("http://localhost:5000"));
    }, []);

    useEffect(() => {
        socket?.emit("register", user._id.toString());
        console.log(user._id, socket);

        // Listen for new notifications
        socket?.on('newNotification', (notification) => {
            console.log("New notification received", notification);
            handleNewNotification(notification);
        });

        // Listen for new announcements
        socket?.on('newAnnouncement', (announcement) => {
            console.log("New announcement received", announcement);
            handleNewAnnouncement(announcement); // Function to handle announcement
        });

    }, [socket]);

    useEffect(() => {
        if (!initialNotificationLoad && (notifications.length > 0) && (location.pathname !== "/notifications")) {
            // When receive notifications after initial load
            const latestNotification = notifications[0];
            if (latestNotification) {
                setSnackbarMessage(`New Notification '${latestNotification.message}'`);
                setSnackbarOpen(true);
            }
        } else {
            setInitialNotificationLoad(false); // Mark initial load as done
        }
    }, [notifications]);

    // useEffect(() => {
    //     // Only show Snackbar if notifications arrive and you're not on the Notifications page
    //     if ((notifications.length > 0) && (location.pathname !== "/notifications")) {
    //         setSnackbarMessage(`${notifications[0].message}`);
    //         setSnackbarOpen(true);
    //     }
    // }, [notifications]);

    // useEffect(() => {
    //     // Only show Snackbar if announcements arrive and you're not on the Announcement page
    //     if ((announcements.length > 0) && (location.pathname !== "/announcement")) {
    //         console.log("Announcements: ", announcements);
    //         setSnackbarMessage(`New Announcement '${announcements[0].title}'`);
    //         setSnackbarOpen(true);
    //     }
    // }, [announcements]);

    useEffect(() => {
        if (!initialAnnouncementLoad && (announcements.length > 0) && (location.pathname !== "/announcement")) {
            // When receive announcements after initial load
            const latestAnnouncement = announcements[0];
            if (latestAnnouncement) {
                setSnackbarMessage(`New Announcement '${latestAnnouncement.title}'`);
                setSnackbarOpen(true);
            }
        } else {
            setInitialAnnouncementLoad(false); // Mark initial load as done
        }
    }, [announcements]);

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

    if (loading) {
        return null; // Don't render anything while loading
    }

    return (
        <>
            {/* Snackbar for displaying new notifications */}
            {user?.role !== 'client' && (
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
            )}

            <AppBar elevation={0} position="static" sx={{ backgroundColor: '#f8f9fa', color: 'black' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="Logo"
                                style={{ width: '40px', height: 'auto' }}
                            />
                        </Box>
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
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {/* Display icon and label */}
                                            {page.icon}
                                            <Typography
                                                component={Link}
                                                to={`/${page.name.toLowerCase()}`}
                                                sx={{ textDecoration: 'none', color: 'inherit', ml: 1 }} // `ml: 1` for margin between icon and text
                                            >
                                                {page.name}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                            <Box
                                component="img"
                                src="/logo.png"
                                alt="Logo"
                                style={{ width: '40px', height: 'auto' }}
                            />
                        </Box>
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
                        {user.role === 'client' ? (
                            <Box sx={{ ml: '30%', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Tooltip title='My Cases' arrow>
                                    <Button
                                        key="My Cases"
                                        component={Link}
                                        to="/client/mycases"
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2,
                                            color: location.pathname === "/client/mycases" ? 'primary.main' : 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        <Assignment />
                                    </Button>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Box sx={{ ml: 42, mr: 3, flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
                                <Box>
                                    {pages.map((page) => (
                                        <Tooltip key={page.name} title={page.name} arrow>
                                            <Button
                                                component={Link}
                                                to={`/${page.name.toLowerCase()}`}
                                                onClick={handleCloseNavMenu}
                                                sx={{
                                                    my: 2,
                                                    color: location.pathname === `/${page.name.toLowerCase()}` ? 'primary.main' : 'inherit',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                {page.icon}
                                            </Button>
                                        </Tooltip>
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
                                            ...muiStyles.buttonStyle,
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ ml: 'auto', flexGrow: 0 }}>
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
                                    (setting === 'Manage Users' || setting === 'Notification Settings') && user.role !== 'admin' ? null : (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography
                                                textAlign="center"
                                                component={Link}
                                                to={`/${setting.toLowerCase().replace(' ', '')}`}
                                                sx={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {setting}
                                            </Typography>
                                        </MenuItem>
                                    )
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
