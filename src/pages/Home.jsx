import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Stack } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Background from '../components/Background';
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
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
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
            <Container sx={{ p: 3 }}>
                <Paper sx={{
                    ...muiStyle.paperStyle,
                    mb: 3,
                    px: 3,
                    pt: 4,
                    pb: 3,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                        Dashboard
                    </Typography>
                    <Box sx={{
                        alignItems: 'center',
                        textAlign: 'right',
                        justifyContent: 'flex-end',
                        mr: 2,
                        mt: .3
                    }}>
                        <Typography variant="subtitle1">
                            {formatDate(dateTime)}
                        </Typography>
                        <Typography variant="subtitle2">
                            {formatTime(dateTime)}
                        </Typography>
                    </Box>
                </Paper>

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Paper elevation={4} sx={muiStyle.paperStyle} >
                            <Box p={3}>
                                <Typography variant="h6">Active Cases</Typography>
                                <Box sx={{ width: 300, height: 300, margin: '0 auto', p: 2 }}>
                                    <Pie data={pieData} options={pieOptions} />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={4} sx={muiStyle.paperStyle}>
                                    <Box p={3}>
                                        <Typography variant="h6">Total Cases</Typography>
                                        <Typography variant="h4">{statistics.totalCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={4} sx={muiStyle.paperStyle}>
                                    <Box p={3}>
                                        <Typography variant="h6">Active Cases</Typography>
                                        <Typography variant="h4">{statistics.activeCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={4} sx={muiStyle.paperStyle}>
                                    <Box p={3}>
                                        <Typography variant="h6">Closed Cases</Typography>
                                        <Typography variant="h4">{statistics.closedCases}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Paper elevation={4} sx={muiStyle.paperStyle}>
                                    <Box p={3}>
                                        <Typography variant="h6">Total Tasks</Typography>
                                        <Typography variant="h4">{statistics.totalTasks}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Container >
        </>

    );
};

export default Home;