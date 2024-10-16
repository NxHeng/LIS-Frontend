import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Navigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Stack, Typography, Card, CardContent, Snackbar, Alert } from '@mui/material';

import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {
    // Sample notifications data
    // const notifications = [
    //     { id: 1, category: 'Deadlines', taskTitle: 'Prepare and execute an engagement letter', caseTitle: "Turner Investment Properties", date: '2024-09-30' },
    //     { id: 2, category: 'Reminders', taskTitle: 'Prepare and execute an engagement letter', caseTitle: "Turner Investment Properties", date: '2024-10-01' },
    //     { id: 3, category: 'Status Changes', caseTitle: "Turner Investment Properties", status: 'Closed' },
    //     { id: 4, category: 'Details Updates', caseTitle: "Turner Investment Properties", date: '2024-09-29' },
    //     { id: 5, category: 'New Cases', caseTitle: "Turner Investment Properties", date: '2024-09-30' },
    //     // More notifications...
    // ];

    const [notifications, setNotifications] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const { socket, handleNewNotification } = useSocketContext();

    const { user } = useAuthContext();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!user) {
            <Navigate to="/login" />
        }
        else {
            setUserId(JSON.parse(localStorage.getItem('user'))._id);
        }
    }, [user]);

    // useEffect(() => {
    //     console.log("Socket ran");
    //     socket.on('newNotification', (notification) => {
    //         console.log("New notification received", notification); 
    //         handleNewNotification(notification);

    //         // Show notification using Snackbar
    //         setSnackbarMessage(`New notification: ${notification.caseTitle || notification.taskTitle}`);
    //         setSnackbarOpen(true);
    //     });
    // }, [socket]);




    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userId) return; // Ensure userId is not null before making the request

            try {
                const response = await fetch(`${API_URL}/notification/getNotifications?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);


    // Close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Prevent closing if clicked away
        }
        setSnackbarOpen(false);
    };

    // Task Filter Handler
    const handleStatusFilter = (status) => {
        setStatusFilter(status);
    };

    // Filter notifications based on the selected category
    const filteredNotifications = statusFilter === "All"
        ? notifications
        : notifications.filter(notification => notification.type === statusFilter);

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


    return (
        <Container sx={{ p: 2 }}>
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

            <Typography variant='h3'>Notifications</Typography>
            <Box sx={{ flexGrow: 1, mt: 2 }}>
                <Grid container spacing={2}>
                    {/* Side Navigation */}
                    <Grid item xs={3}>
                        <Stack>
                            <Typography variant='h4' color='grey'>Categories</Typography>
                            <Button onClick={() => handleStatusFilter("All")} variant={statusFilter === "All" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                All
                            </Button>
                            <Button onClick={() => handleStatusFilter("deadline")} variant={statusFilter === "deadline" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                Deadlines
                            </Button>
                            <Button onClick={() => handleStatusFilter("reminder")} variant={statusFilter === "reminder" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                Reminders
                            </Button>
                            <Button onClick={() => handleStatusFilter("new_case")} variant={statusFilter === "new_case" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                New Cases
                            </Button>
                            <Button onClick={() => handleStatusFilter("detail_update")} variant={statusFilter === "detail_update" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                Details Updates
                            </Button>
                            <Button onClick={() => handleStatusFilter("status_change")} variant={statusFilter === "status_change" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                Status Changes
                            </Button>
                        </Stack>
                    </Grid>

                    {/* Notification List */}
                    <Grid item xs={9}>
                        <Container maxWidth="md">
                            <Box sx={{ mt: 2 }}>
                                <Grid container>
                                    {filteredNotifications && filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((notification) => (
                                            <Grid item xs={12} key={notification._id}>
                                                {renderNotificationCard(notification)}
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography variant="h5">No Notifications</Typography>
                                    )}
                                </Grid>
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Notifications;
