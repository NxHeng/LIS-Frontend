import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/system';
import Background from '../components/Background';
import TasksLinearProgress from '../components/Dashboard/TasksLinearProgress';
import muiStyles from '../styles/muiStyles';
import { exportAnalysis } from '../utils/exportPDF';

import { FilterAlt } from '@mui/icons-material';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
} from 'chart.js';

import { Chart, Pie, Bar, Line } from 'react-chartjs-2';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

// Register the components with Chart.js
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    BoxPlotController,
    BoxAndWiskers
);


import { useDashboardContext } from '../context/DashboardContext';
import { useCategoryContext } from '../context/CategoryContext';

const Home = () => {
    const theme = useTheme();
    const { statistics, loading, fetchStatistics, fetchCaseAnalysis, caseAnalysis } = useDashboardContext();
    const { fetchCategories, categories } = useCategoryContext();
    const [categoryFilter, setCategoryFilter] = useState('');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1); // Default to current month (1-based index)

    const [dateTime, setDateTime] = useState(new Date());
    const [homeView, setHomeView] = useState('overview');
    const backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6633', '#FF33FF', '#33FF33', '#FF3333', '#33FFFF', '#FFFF33'];

    useEffect(() => {
        console.log(monthFilter)
        fetchCategories();
        fetchCaseAnalysis({
            category: categoryFilter === 'All' ? '' : categoryFilter,
            year: yearFilter,
            month: monthFilter
        });
        fetchStatistics();
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer); // Cleanup the interval on unmount
    }, [categoryFilter, yearFilter, monthFilter]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!statistics && !caseAnalysis) {
        return <Typography>No Data available.</Typography>;
    }

    const pieData = {
        labels: statistics?.casesByCategory.map(item => item.categoryName),
        datasets: [{
            data: statistics?.casesByCategory.map(item => item.count),
            backgroundColor: [...backgroundColor]
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

    const formatMonth = (date) => {
        return date.toLocaleDateString([], {
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const boxPlotData = {
        labels: caseAnalysis?.casesTurnaroundTime.map(
            (entry) => `${entry.month}-${entry.year}`
        ), // Use month-year as labels
        datasets: [
            {
                label: 'Cases Turnaround Time',
                data: caseAnalysis?.casesTurnaroundTime.map((entry) => ({
                    min: entry.min,
                    q1: entry.q1,
                    median: entry.median,
                    q3: entry.q3,
                    max: entry.max,
                    outliers: entry.turnaroundTimes.filter(
                        (value) => value < entry.q1 || value > entry.q3
                    ), // Outliers outside the whiskers
                })),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <>
            <Background />
            <Container maxWidth='lg' sx={{ p: 4 }}>
                <Paper sx={{
                    ...muiStyles.paperStyle,
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'inline-flex' }}>
                        <Button variant={homeView === 'overview' ? 'contained' : 'outlined'} onClick={() => setHomeView('overview')} sx={{
                            ...muiStyles.buttonStyle,
                            mt: 2, mb: 0, mr: 2,
                            pb: 1.1, pt: 0, px: 2,
                            backgroundColor: homeView === 'overview' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: homeView === 'overview' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.primary.main, 0.1),
                                boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
                            }
                        }}>
                            <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                                Overview
                            </Typography>
                        </Button>
                        <Button variant={homeView === 'analysis' ? 'contained' : 'outlined'} onClick={() => setHomeView('analysis')} sx={{
                            ...muiStyles.buttonStyle,
                            mt: 2, mb: 0, mr: 2,
                            pb: 1.1, pt: 0, px: 2,
                            backgroundColor: homeView === 'analysis' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: homeView === 'analysis' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.primary.main, 0.1),
                                boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
                            }
                        }}>
                            <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                                Analysis
                            </Typography>
                        </Button>
                    </Box>
                    {homeView === 'analysis' && (
                        <Box sx={{ display: 'flex' }}>
                            <Paper sx={{
                                ...muiStyles.paperStyle,
                                mt: 2, display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: 2,
                                mx: 2
                            }}>
                                <FilterAlt sx={{ mr: 1 }} />
                                <Typography variant='body1'>
                                    Filter
                                </Typography>
                            </Paper>
                            <FormControl sx={{ mt: 2, minWidth: 120, mr: 2 }}>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    id="category-select"
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)} // Update the filter state
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>{category.categoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120, mr: 2, mt: 2 }}>
                                <InputLabel id="year-select-label">Year</InputLabel>
                                <Select
                                    labelId="year-select-label"
                                    id="year-select"
                                    value={yearFilter}
                                    label="Year"
                                    onChange={(e) => setYearFilter(e.target.value)} // Update year filter state
                                >
                                    {/* Dynamic Year current year - 5 years */}
                                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120, mt: 2, mr: 2 }}>
                                <InputLabel id="month-select-label">Month</InputLabel>
                                <Select
                                    labelId="month-select-label"
                                    id="month-select"
                                    value={monthFilter}
                                    label="Month"
                                    onChange={(e) => setMonthFilter(e.target.value)} // Update month filter state
                                >
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem> // 1-based month (January = 1)
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => exportAnalysis(caseAnalysis)}
                                sx={{ ...muiStyles.detailsButtonStyle, mt: 2 }}
                            >
                                Export as PDF
                            </Button>
                        </Box>
                    )}
                </Box>


                {homeView === 'overview' && (
                    <Grid container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
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
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box py={2} px={3}>
                                            <Typography variant="body1">My Total Cases</Typography>
                                            <Typography variant="h5">{statistics?.totalCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">Active Cases</Typography>
                                            <Typography variant="h5">{statistics?.activeCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">Closed Cases</Typography>
                                            <Typography variant="h5">{statistics?.closedCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">New Tasks</Typography>
                                            <Typography variant="h5">{statistics?.newTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">Pending Tasks</Typography>
                                            <Typography variant="h5">{statistics?.pendingTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">Completed Tasks</Typography>
                                            <Typography variant="h5">{statistics?.completedTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography variant="body1">Due<br />Tasks</Typography>
                                            <Typography variant="h5">{statistics?.dueTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box pt={2} pb={4} px={4}>
                                            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1">Tasks Completion</Typography>
                                            <Typography variant="subtitle1">
                                                {statistics?.progress}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={statistics?.progress}
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
                                                completedPercentage={statistics?.completedPercentage}
                                                pendingPercentage={statistics?.pendingPercentage}
                                                newTasksPercentage={statistics?.newTasksPercentage}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {homeView === 'analysis' && (
                    <Grid id='chartContainer' container spacing={3} sx={{ pt: 2 }}>

                        {/* Active Cases */}
                        <Grid className='exclude' item xs={12} sm={6} md={3}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Current Active Cases</Typography>
                                    <Typography variant="h4" color='primary'>{caseAnalysis?.activeCases}</Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases Created This Month */}
                        <Grid className='exclude' item xs={12} sm={6} md={3}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Cases Initiated</Typography>
                                    <Typography variant="h4" color='primary'>{caseAnalysis?.casesThisMonth}</Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases Closed This Month */}
                        <Grid className='exclude' item xs={12} sm={6} md={3}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Cases Closed</Typography>
                                    <Typography variant="h4" color='primary'>{caseAnalysis?.casesClosedThisMonth}</Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Tasks Completed This Month */}
                        <Grid className='exclude' item xs={12} sm={6} md={3}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Tasks Completed</Typography>
                                    <Typography variant="h4" color='primary'>{caseAnalysis?.tasksCompletedThisMonth}</Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases by Staff */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3}>
                                    <Typography variant="body1" sx={{ pb: 1 }}>Cases by Staff</Typography>
                                    <TableContainer
                                        component={Paper}
                                        sx={{
                                            ...muiStyles.paperStyle,
                                            height: 284,  // Adjust height as needed
                                            overflowY: 'auto',  // Enable vertical scrolling
                                            '&:hover': {
                                                transform: 'scale(1)',
                                            }
                                        }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Cases Handled</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {caseAnalysis?.casesByStaff.map((staff) => (
                                                    <TableRow key={staff.staffName}>
                                                        <TableCell>{staff.staffName}</TableCell>
                                                        <TableCell align="right">{staff.count}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases by Category */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3}>
                                    <Typography variant="body1">Cases by Category</Typography>
                                    <Box sx={{ height: 290, m: 'auto' }}>
                                        <Chart
                                            type="bar"
                                            data={{
                                                labels: caseAnalysis?.casesByCategory.map(item => item.categoryName),
                                                datasets: [
                                                    {
                                                        data: caseAnalysis?.casesByCategory.map(item => item.count),
                                                        backgroundColor: [...backgroundColor],
                                                        hoverBackgroundColor: [...backgroundColor],
                                                    },
                                                ],
                                                borderWidth: 1
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false, // Hide the grid lines on the x-axis
                                                        },
                                                    },
                                                    y: {
                                                        beginAtZero: true,

                                                        ticks: {
                                                            callback: function (value) {
                                                                return value.toFixed(0);
                                                            },
                                                            stepSize: 1,
                                                        },
                                                    },
                                                },
                                            }}
                                        />

                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases Over Time */}
                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3}>
                                    <Typography variant="body1">Cases Over Time</Typography>
                                    <Box sx={{ width: '100%', height: 290, m: 'auto' }}>
                                        <Line
                                            data={{
                                                labels: caseAnalysis?.casesOverTime.map(item => `${item._id.month}-${item._id.year}`),
                                                datasets: [
                                                    {
                                                        label: 'Cases',
                                                        data: caseAnalysis?.casesOverTime.map(item => item.count),
                                                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                        borderColor: 'rgba(75, 192, 192, 1)',
                                                        borderWidth: 2,
                                                        tension: 0.3,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: { display: false },
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: function (value) {
                                                                return value.toFixed(0);
                                                            },
                                                            stepSize: 2,
                                                        },
                                                        suggestedMax: 10,
                                                    },

                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3}>
                                    <Typography variant="body1">Cases Turnaround Time</Typography>
                                    <Box sx={{ width: '100%', height: 290, m: 'auto' }}>
                                        <Chart
                                            type="boxplot"
                                            data={boxPlotData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Box Plot for Case Turnaround Time',
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        title: {
                                                            display: true,
                                                            text: 'Month-Year',
                                                        },
                                                    },
                                                    y: {
                                                        title: {
                                                            display: true,
                                                            text: 'Turnaround Time',
                                                        },
                                                    },
                                                },
                                            }}
                                        />

                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}



            </Container>
        </>

    );
};

export default Home;