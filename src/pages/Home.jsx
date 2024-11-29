import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Stack, LinearProgress } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Background from '../components/Background';
import TasksLinearProgress from '../components/Dashboard/TasksLinearProgress';
import muiStyle from '../styles/muiStyles';

Chart.register(ArcElement, Tooltip, Legend);


import { useDashboardContext } from '../context/DashboardContext';

const Home = () => {
    const { statistics, loading, fetchStatistics } = useDashboardContext();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        fetchStatistics();
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup the interval on unmount
    }, []);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!statistics) {
        return <Typography>No statistics available.</Typography>;
    }

    const pieData = {
        labels: statistics.casesByCategory.map(item => item.categoryName),
        datasets: [{
            data: statistics.casesByCategory.map(item => item.count),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6633', '#FF33FF', '#33FF33', '#FF3333', '#33FFFF', '#FFFF33'
            ]
        }]
    };

    const pieOptions = {
        maintainAspectRatio: false, // Disable maintain aspect ratio for custom sizing
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <>
            <Background />
            <Container maxWidth='lg' sx={{ p: 4 }}>
                <Paper sx={{
                    ...muiStyle.paperStyle,
                    mb: 0,
                    px: 3,
                    pt: 2,
                    pb: 3,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h4' sx={{ px: 2, pt: 1.3, fontWeight: 'bold' }}>
                        Dashboard
                    </Typography>
                    <Box sx={{
                        alignItems: 'center',
                        textAlign: 'right',
                        justifyContent: 'flex-end',
                        mr: 2
                    }}>
                        <Typography variant="subtitle1">
                            {formatDate(dateTime)}
                        </Typography>
                        <Typography variant="subtitle2">
                            {formatTime(dateTime)}
                        </Typography>
                    </Box>
                </Paper>
                <Paper sx={{
                    ...muiStyle.paperStyle,
                    mt: 2, mb: 0, mr: 2,
                    pb: 1.1, pt: 0, px: 2,
                    display: 'inline-flex',
                    justifyContent: 'center',
                }}>
                    <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                        Overview
                    </Typography>
                </Paper>
                <Paper sx={{
                    ...muiStyle.paperStyle,
                    mt: 2, mb: 0,
                    pb: 1.1, pt: 0, px: 2,
                    display: 'inline-flex',
                    justifyContent: 'center',
                }}>
                    <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                        Analysis
                    </Typography>
                </Paper>


                <Grid container spacing={3} sx={{ pt: 2 }}>
                    <Grid item xs={6}>
                        <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                            <Box p={2} px={3}>
                                <Typography variant="body1">Active Cases</Typography>
                                <Box sx={{ width: 290, height: 290, m: 'auto' }}>
                                    <Pie data={pieData} options={pieOptions} />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box py={2} px={3}>
                                        <Typography variant="body1">My Total Cases</Typography>
                                        <Typography variant="h5">{statistics.totalCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">Active Cases</Typography>
                                        <Typography variant="h5">{statistics.activeCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">Closed Cases</Typography>
                                        <Typography variant="h5">{statistics.closedCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">New Tasks</Typography>
                                        <Typography variant="h5">{statistics.newTasks}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">Pending Tasks</Typography>
                                        <Typography variant="h5">{statistics.pendingTasks}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">Completed Tasks</Typography>
                                        <Typography variant="h5">{statistics.completedTasks}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box p={2} px={3}>
                                        <Typography variant="body1">Due<br />Tasks</Typography>
                                        <Typography variant="h5">{statistics.dueTasks}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={12}>
                                <Paper elevation={4} sx={{ ...muiStyle.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                    <Box pt={2} pb={4} px={4}>
                                        {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1">Tasks Completion</Typography>
                                            <Typography variant="subtitle1">
                                                {statistics.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={statistics.progress}
                                            sx={{
                                                mt: 1,
                                                height: 12, // Change the height of the progress bar
                                                borderRadius: 6,
                                                backgroundColor: '#e0e0e0',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: '#4caf50',
                                                    borderRadius: 6,
                                                },
                                                msTransitionDelay: 2,
                                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                            }}
                                        /> */}
                                        <TasksLinearProgress
                                            completedPercentage={statistics.completedPercentage}
                                            pendingPercentage={statistics.pendingPercentage}
                                            newTasksPercentage={statistics.newTasksPercentage}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>



            </Container>
        </>

    );
};

export default Home;