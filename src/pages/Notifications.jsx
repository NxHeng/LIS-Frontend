import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Stack, Typography, Card, CardContent, Snackbar, Alert, Pagination } from '@mui/material';
import { format, formatDistanceStrict } from 'date-fns';
import { Link } from 'react-router-dom';
import muiStyles from '../styles/muiStyles';
import Background from '../components/Background';
import CategoryIcon from '@mui/icons-material/Category';

import { useSocketContext } from '../context/SocketContext';
import { useAuthContext } from '../context/AuthContext';
import { useCaseContext } from '../context/CaseContext';

const API_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {

    // const [notifications, setNotifications] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { notifications, setNotifications } = useSocketContext();
    const { user } = useAuthContext();
    const { toTasks, toCaseDetails, toMatterDetails, setFromNotificationsToTasks, setFromNotificationsToCaseDetails } = useCaseContext();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!user) {
            <Navigate to="/login" />
        }
        else {
            setUserId(JSON.parse(localStorage.getItem('user'))._id);
        }
    }, [user]);

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
                console.log('Notifications:', data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    const handleClick = async (notification) => {
        switch (notification.type) {
            case 'deadline':
                setFromNotificationsToTasks(true);
                break;
            case 'reminder':
                setFromNotificationsToTasks(true);
                break;
            case 'detail_update':
                setFromNotificationsToCaseDetails(true);
                break;
        }
        localStorage.setItem('caseItem', JSON.stringify(notification.caseId));
    };

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

    const filteredNotificationsForCurrentPage = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const formatDate = (date) => {
        return format(new Date(date), "yyyy-MM-dd");
    };

    const capitalizeWord = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    // Render different card designs for each category
    const renderNotificationCard = (notification) => {
        return (
            <Card key={notification._id} sx={{
                marginBottom: 2,
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',  // Changes cursor to pointer on hover
                transition: 'transform 0.3s ease',  // Smooth transition for zoom effect
                '&:hover': {
                    transform: 'scale(1.05)',  // Slightly scales up the card on hover
                    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)' // Optional: enhance shadow on hover for extra depth
                }
            }}>
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
                                {formatDistanceStrict(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                            </Typography>
                        </Box>

                        <Box sx={{ px: 1 }}>
                            |
                        </Box>

                        {/* Middle Section (taskTitle + caseTitle) */}
                        <Box sx={{ flexBasis: '45%', textAlign: 'left' }}>

                            <Typography sx={{ fontWeight: 'bold' }}>{notification.caseId && notification.caseId.matterName}
                            </Typography>

                            <Typography>
                                {notification.taskId && notification.caseId.tasks.find(task => task._id === notification.taskId).description}
                            </Typography>

                            {/* <Typography sx={{ fontWeight: 'bold' }}>{notification.caseId && notification.caseId.matterName}
                            </Typography> */}

                        </Box>

                        {/* Right Section (date/status) */}
                        <Box sx={{ flexBasis: '20%', textAlign: 'right' }}>
                            {notification.type === 'deadline' && (
                                <Typography color="error" sx={{ fontWeight: 'bold' }}>{formatDate(notification.caseId.tasks.find(task => task._id === notification.taskId).dueDate)}</Typography>
                            )}
                            {notification.type === 'reminder' && (
                                <Typography color="error" sx={{ fontWeight: 'bold' }}>{formatDate(notification.caseId.tasks.find(task => task._id === notification.taskId).reminder)}</Typography>
                            )}
                            {notification.type === 'new_case' && (
                                <Typography color="green" sx={{ fontWeight: 'bold' }}>New</Typography>
                            )}
                            {notification.type === 'detail_update' && (
                                <Typography color="dodgerblue" sx={{ fontWeight: 'bold' }}>Updated</Typography>
                            )}
                            {notification.type === 'status_change' && (
                                <Typography color="darkorange" sx={{ fontWeight: 'bold' }}>{capitalizeWord(notification.caseId.status)}</Typography>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        );
    };


    return (
        <>
            {/* Snackbar for displaying new notifications */}
            <Background />
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

            <Container maxWidth="lg" sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1, mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Side Navigation */}
                        <Grid item xs={3}>
                            <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            px: 2,
                                            pt: 1,
                                            pb: .5,
                                        }}>
                                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                Notifications
                                            </Typography>
                                        </Box>
                                        <Box sx={muiStyles.sideNavTitleStyle}>
                                            <CategoryIcon fontSize="medium" sx={{ ml: 0 }} />
                                            <Typography variant="subtitle1">
                                                Categories
                                            </Typography>
                                        </Box>
                                        <Button onClick={() => handleStatusFilter("All")} variant={statusFilter === "All" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            All
                                        </Button>
                                        <Button onClick={() => handleStatusFilter("deadline")} variant={statusFilter === "deadline" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Deadlines
                                        </Button>
                                        <Button onClick={() => handleStatusFilter("reminder")} variant={statusFilter === "reminder" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Reminders
                                        </Button>
                                        <Button onClick={() => handleStatusFilter("new_case")} variant={statusFilter === "new_case" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            New Cases
                                        </Button>
                                        <Button onClick={() => handleStatusFilter("detail_update")} variant={statusFilter === "detail_update" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Details Updates
                                        </Button>
                                        <Button onClick={() => handleStatusFilter("status_change")} variant={statusFilter === "status_change" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Status Changes
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Notification List */}
                        <Grid item xs={9}>
                            <Stack direction="column" spacing={2}>
                                <Card sx={{ ...muiStyles.cardStyle, p: 2, pb: 0 }}>
                                    <CardContent>
                                        {filteredNotificationsForCurrentPage && filteredNotificationsForCurrentPage.length > 0 ? (
                                            filteredNotificationsForCurrentPage.map((notification) => (
                                                <Grid item xs={12} key={notification._id}>
                                                    {notification.caseId ? (
                                                        <Link
                                                            to={`/cases/details/${notification.caseId._id}`}
                                                            onClick={() => handleClick(notification)}
                                                            style={{ textDecoration: 'none' }}
                                                        >
                                                            {renderNotificationCard(notification)}
                                                        </Link>
                                                    ) : null}
                                                </Grid>
                                            ))
                                        ) : (
                                            <Typography variant="h5">No Notifications</Typography>
                                        )}
                                    </CardContent>
                                </Card>
                                {/* Pagination */}
                                <Card sx={{
                                    ...muiStyles.cardStyle, p: 0,
                                    pb: 1,
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                            <Pagination
                                                count={Math.ceil(filteredNotifications.length / itemsPerPage)}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default Notifications;
