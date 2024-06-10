import React, { useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);


import { useDashboardContext } from '../context/DashboardContext';

const Home = () => {
    const { statistics, loading, fetchStatistics } = useDashboardContext();

    useEffect(() => {
        fetchStatistics();
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

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2' sx={{ mb: 1 }}>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper elevation={4} >
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
                            <Paper elevation={4}>
                                <Box p={3}>
                                    <Typography variant="h6">Total Cases</Typography>
                                    <Typography variant="h4">{statistics.totalCases}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Paper elevation={4}>
                                <Box p={3}>
                                    <Typography variant="h6">Active Cases</Typography>
                                    <Typography variant="h4">{statistics.activeCases}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Paper elevation={4}>
                                <Box p={3}>
                                    <Typography variant="h6">Closed Cases</Typography>
                                    <Typography variant="h4">{statistics.closedCases}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Paper elevation={4}>
                                <Box p={3}>
                                    <Typography variant="h6">Total Tasks</Typography>
                                    <Typography variant="h4">{statistics.totalTasks}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
        </Container>
    );
};

export default Home;