import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Paper, Box, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { alpha } from '@mui/system';
import Background from '../components/Background';
import TasksLinearProgress from '../components/Dashboard/TasksLinearProgress';
import muiStyles from '../styles/muiStyles';
import { exportAnalysis } from '../utils/exportPDF';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

import { BorderColor, FilterAlt } from '@mui/icons-material';

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
import { use } from 'react';

const Home = () => {
    const theme = useTheme();
    const user = jwtDecode(localStorage.getItem('token'));
    const { statistics, loading, fetchStatistics, overallStatus, fetchOverallStatus, monthlyStatus, fetchMonthlyStatus, yearlyStatus, fetchYearlyStatus } = useDashboardContext();
    const { fetchCategories, categories } = useCategoryContext();
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1); // Default to current month (1-based index)

    const [dateTime, setDateTime] = useState(new Date());
    const [homeView, setHomeView] = useState(user?.role === 'admin' ? 'overall' : 'overview');
    const backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6633', '#FF33FF', '#33FF33', '#FF3333', '#33FFFF', '#FFFF33'];
    const backgroundColorTransparent = backgroundColor.map((color) => alpha(color, 0.5));

    useEffect(() => {
        fetchCategories();
        if (user?.role === 'admin') {
            fetchOverallStatus();
            fetchMonthlyStatus({
                category: categoryFilter === 'All' ? '' : categoryFilter,
                year: yearFilter,
                month: monthFilter
            });
            fetchYearlyStatus({
                category: categoryFilter === 'All' ? '' : categoryFilter,
                year: yearFilter
            });
            // console.log('First useEffect month:', monthFilter);
        } else {
            fetchStatistics();
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchCategories();
            fetchMonthlyStatus({
                category: categoryFilter === 'All' ? '' : categoryFilter,
                year: yearFilter,
                month: monthFilter
            });
            fetchYearlyStatus({
                category: categoryFilter === 'All' ? '' : categoryFilter,
                year: yearFilter,
            });
            
            // console.log('Second useEffect monthFilter:', monthFilter);
        } else {
            fetchStatistics();
        }
        // const timer = setInterval(() => {
        //     setDateTime(new Date());
        // }, 1000);
        // return () => clearInterval(timer); // Cleanup the interval on unmount
    }, [categoryFilter, yearFilter, monthFilter]);

    if (loading || !monthFilter || !yearFilter) {
        return <Typography>Loading...</Typography>;
    }

    if (!statistics && user?.role !== 'admin') {
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
        responsive: true,
        maintainAspectRatio: false, // Allow chart to resize
        plugins: {
            legend: {
                position: 'left', // Position legend on the right
                align: 'center',  // Align legend items vertically
                labels: {
                    boxWidth: 20,   // Size of the color box
                    padding: 10,    // Spacing between legend items
                },
            },
            title: {
                display: true,
                text: 'Cases by Category',

            },
        },
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

    const formatMonthToText = (month) => {
        const date = new Date(2024, month - 1, 1); // Month is 0-indexed, so subtract 1 from the input month
        return date.toLocaleDateString([], {
            month: 'long',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // const boxPlotData = {
    //     labels: caseAnalysis?.casesTurnaroundTime.map(
    //         (entry) => `${entry.month}-${entry.year}`
    //     ), // Use month-year as labels
    //     datasets: [
    //         {
    //             label: 'Cases Turnaround Time',
    //             data: caseAnalysis?.casesTurnaroundTime.map((entry) => ({
    //                 min: entry.min,
    //                 q1: entry.q1,
    //                 median: entry.median,
    //                 q3: entry.q3,
    //                 max: entry.max,
    //                 outliers: entry.turnaroundTimes.filter(
    //                     (value) => value < entry.q1 || value > entry.q3
    //                 ), // Outliers outside the whiskers
    //             })),
    //             borderColor: 'rgba(75, 192, 192, 1)',
    //             backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //         },
    //     ],
    // };

    if (user?.role === 'admin' && (!overallStatus || !monthlyStatus || !yearlyStatus)) {
        return <Typography>Loading...</Typography>;
    } else if (user?.role !== 'admin' && !statistics) {
        <Typography>Loading...</Typography>;
    }

    // Data for bar chart (Active Cases by Category)
    const overallBarData = {
        labels: overallStatus?.charts.activeCasesByCategory.map((item) => item.categoryName),
        datasets: [
            {
                label: "Active Cases",
                data: overallStatus?.charts.activeCasesByCategory.map((item) => item.count),
                backgroundColor: [...backgroundColor],
                BorderColor: [...backgroundColor],
                borderWidth: 1,
            },
        ],
    };
    // Options for bar chart
    const overallBarOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index" },
        },
        scales: {
            x: { title: { display: true, text: "Categories" } },
            y: { title: { display: true, text: "Number of Cases" }, beginAtZero: true },
        },
    };
    // Data for line chart (Cases Initiated Over Time)
    const overallLineData = {
        labels: overallStatus?.charts.casesInitiatedOvertime.map(
            (item) => `${item.month}/${item.year}`
        ),
        datasets: [
            {
                label: "Cases Initiated",
                data: overallStatus?.charts.casesInitiatedOvertime.map((item) => item.count),
                backgroundColor: [...backgroundColor],
                BorderColor: [...backgroundColor],
                borderWidth: 2,
                fill: false,
            },
        ],
    };
    const overallLineOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { mode: "index" },
        },
        scales: {
            x: { title: { display: true, text: "Time (Month/Year)" } },
            y: { title: { display: true, text: "Number of Cases" }, beginAtZero: true },
        },
    };


    // Bar chart for Cases by Category
    const monthlyBarDataCategory = {
        labels: monthlyStatus?.barChart.map(item => item.categoryName),
        datasets: [{
            label: 'Number of Cases',
            data: monthlyStatus?.barChart.map(item => item.count),
            backgroundColor: [...backgroundColor],
            borderColor: [...backgroundColor],
            borderWidth: 1
        }]
    };

    const monthlyBarOptionsCategory = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { display: false } },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
            },
        },
    };

    // Box Plot Data for Turnaround Time
    const monthlyBoxPlotData = {
        labels: [monthlyStatus?.boxPlot.monthYear],
        datasets: [
            {
                label: 'Cases Turnaround Time',
                data: [
                    {
                        min: monthlyStatus?.boxPlot.min || 0,
                        q1: monthlyStatus?.boxPlot.q1 || 0,
                        median: monthlyStatus?.boxPlot.median || 0,
                        q3: monthlyStatus?.boxPlot.q3 || 0,
                        max: monthlyStatus?.boxPlot.max || 0,
                        outliers: (monthlyStatus?.boxPlot.outliers || []).filter(
                            (value) => value < monthlyStatus?.boxPlot.q1 || value > monthlyStatus?.boxPlot.q3
                        ) || [0],
                    },
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const monthlyboxPlotOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { title: { display: true, text: "Month-Year" } },
            y: { title: { display: true, text: "Turnaround Time (days)" } },
        },
    };


    const yearlyLineChartData = {
        labels: yearlyStatus?.lineChart.map(item => `${item._id.month}/${item._id.year}`), // MM/YYYY
        datasets: [
            {
                label: 'Cases Initiated',
                data: yearlyStatus?.lineChart.map(item => item.count),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            }
        ]
    }

    const yearlyLineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Cases Initiated Throughout the Year',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            legend: {
                display: false,
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month/Year',
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Cases',
                },
                beginAtZero: true,
            }
        }
    }

    const yearlyBarChartData = {
        labels: yearlyStatus?.barChart.map(item => item.categoryName),
        datasets: [
            {
                label: 'Cases by Category',
                data: yearlyStatus?.barChart.map(item => item.count),
                backgroundColor: [...backgroundColor],
                borderColor: [...backgroundColor],
                borderWidth: 1,
            }
        ]
    }

    const yearlyBarChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Cases by Category',
            },
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Number of Cases',
                },
                beginAtZero: true,
            }
        }
    }

    const yearlyBoxPlotData = {
        labels: yearlyStatus?.boxPlot.monthlyStats.map(item => `${item.month}/${yearFilter}`),
        datasets: [
            {
                label: 'Turnaround Time',
                data: yearlyStatus?.boxPlot.monthlyStats.map(item => [
                    item.min,
                    item.q1,
                    item.median,
                    item.q3,
                    item.max,
                ]),
                backgroundColor: [...backgroundColorTransparent],
                borderColor: [...backgroundColor],
                borderWidth: 1,
            }
        ]
    }

    const yearlyBoxPlotOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Cases Turnaround Time Distribution',
            },
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Turnaround Time (Days)',
                },
                beginAtZero: true,
            }
        }
    }

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
                        {user?.role !== 'admin' && (
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
                        )}
                        {user?.role === 'admin' && (
                            <>
                                <Button variant={homeView === 'overall' ? 'contained' : 'outlined'} onClick={() => setHomeView('overall')} sx={{
                                    ...muiStyles.buttonStyle,
                                    mt: 2, mb: 0, mr: 2,
                                    pb: 1.1, pt: 0, px: 2,
                                    backgroundColor: homeView === 'overall' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: homeView === 'overall' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.primary.main, 0.1),
                                        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
                                    }
                                }}>
                                    <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                                        Overview
                                    </Typography>
                                </Button>

                                <Button variant={homeView === 'monthly' ? 'contained' : 'outlined'} onClick={() => setHomeView('monthly')} sx={{
                                    ...muiStyles.buttonStyle,
                                    mt: 2, mb: 0, mr: 2,
                                    pb: 1.1, pt: 0, px: 2,
                                    backgroundColor: homeView === 'monthly' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: homeView === 'monthly' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.primary.main, 0.1),
                                        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
                                    }
                                }}>
                                    <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                                        Monthly
                                    </Typography>
                                </Button>
                                <Button variant={homeView === 'yearly' ? 'contained' : 'outlined'} onClick={() => setHomeView('yearly')} sx={{
                                    ...muiStyles.buttonStyle,
                                    mt: 2, mb: 0, mr: 2,
                                    pb: 1.1, pt: 0, px: 2,
                                    backgroundColor: homeView === 'yearly' ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                                    color: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: homeView === 'yearly' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.primary.main, 0.1),
                                        boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
                                    }
                                }}>
                                    <Typography variant='h6' sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
                                        Yearly
                                    </Typography>
                                </Button>
                            </>
                        )}
                    </Box>

                    {(homeView === 'monthly' || homeView === 'yearly') && user?.role === 'admin' && (
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
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
                            {/* Only show month filter for monthly view */}
                            {homeView === 'monthly' && (
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
                                            <MenuItem key={index} value={index + 1}>
                                                {month}
                                            </MenuItem> // 1-based month (January = 1)
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    const selectedCategory = categories.find((category) => category._id === categoryFilter);
                                    const categoryName = selectedCategory ? selectedCategory.categoryName : "All";
                                    exportAnalysis(monthlyStatus, yearlyStatus, monthFilter, yearFilter, categoryName, homeView);
                                }}
                                sx={{ ...muiStyles.detailsButtonStyle, mt: 2 }}
                            >
                                Export
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Other Staff Overview */}
                {user?.role !== 'admin' && (
                    <Grid container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={8}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box p={2} px={3}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Active Cases</Typography>
                                    <Box sx={{ minHeight: 300, m: 'auto', p: 1 }}>
                                        <Pie data={pieData} options={pieOptions} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Paper elevation={4} sx={muiStyles.paperStyle}>
                                        <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {user?.role !== 'admin' ? <Typography component={Link} to='/cases' variant="h6" style={{ textDecoration: 'none', color: 'black' }}>My Total Cases</Typography> : <Typography variant="h6">Total Cases</Typography>}
                                            <Typography variant="h4">{statistics?.totalCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Paper elevation={4} sx={muiStyles.paperStyle}>
                                        <Box p={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography component={Link} to='/cases' variant="h6" style={{ textDecoration: 'none', color: 'black' }}>Active Cases</Typography>
                                            <Typography variant="h4">{statistics?.activeCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    <Paper elevation={4} sx={muiStyles.paperStyle}>
                                        <Box p={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="h6" component={Link} to='/cases' style={{ textDecoration: 'none', color: 'black' }} state={{ target: 'closed' }}>Closed Cases</Typography>
                                            <Typography variant="h4">{statistics?.closedCases}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography component={Link} to='/tasks' variant="body1" style={{ textDecoration: 'none', color: 'black' }}>Pending Tasks</Typography>
                                            <Typography variant="h5">{statistics?.pendingTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                        <Box p={2} px={3}>
                                            <Typography
                                                component={Link}
                                                to='/tasks'
                                                variant="body1"
                                                style={{ textDecoration: 'none', color: 'black' }} state={{ target: 'Overdue' }}>
                                                Due Tasks
                                            </Typography>
                                            <Typography variant="h5">{statistics?.dueTasks}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {/* Admin Overview */}
                {homeView === 'overall' && user?.role === 'admin' && (
                    <Grid id='chartContainer' container spacing={3} sx={{ pt: 2 }}>
                        {/* KPIs */}
                        <Grid className='exclude' item xs={12} sm={6} md={4}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color='black' component={Link} to='/cases' variant="h6" style={{ textDecoration: 'none' }}>Current Active Cases</Typography>
                                    <Typography variant="h4" color="primary">{overallStatus?.overview.totalActiveCases}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid className='exclude' item xs={12} sm={6} md={4}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color='black' component={Link} to='/tasks' variant="h6" style={{ textDecoration: 'none' }}>Pending Tasks</Typography>
                                    <Typography variant="h4" color='primary'>
                                        {overallStatus?.overview.totalPendingTasks}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid className='exclude' item xs={12} sm={6} md={4}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color='black' component={Link} to='/tasks' variant="h6" style={{ textDecoration: 'none' }} state={{ target: 'Overdue' }}>Due Tasks</Typography>
                                    <Typography variant='h4' color='primary'>
                                        {overallStatus?.overview.totalDueTasks}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>


                        {/* Bar Chart for Active Cases by Category */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart' py={2} px={3}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        Active Cases by Category
                                    </Typography>
                                    <Box sx={{ minHeight: 250, m: "auto", p: 1 }}>
                                        <Bar data={overallBarData} options={overallBarOptions} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>


                        {/* Line Chart for Cases Initiated Over Time */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart' py={2} px={3}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        Cases Initiated Over Time
                                    </Typography>
                                    <Box sx={{ minHeight: 250, m: "auto", p: 1 }}>
                                        <Line data={overallLineData} options={overallLineOptions} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )
                }

                {/* Monthly Overview */}
                {homeView === 'monthly' && user?.role === 'admin' && (
                    <Grid id='chartContainer' container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h4">
                                        {formatMonthToText(monthFilter)}, {yearFilter}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h5">Cases Initiated</Typography>
                                    <Typography variant="h4" color="primary">{monthlyStatus?.kpis.casesInitiatedCurrentMonth}</Typography>
                                </Box>
                            </Paper>
                        </Grid>


                        {/* Cases by Category */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart month' py={2} px={3}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>Cases by Category</Typography>
                                    <Box sx={{ height: 290, m: "auto" }}>
                                        <Bar data={monthlyBarDataCategory} options={monthlyBarOptionsCategory} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases Turnaround Time */}
                        <Grid item xs={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart month' py={2} px={3}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}  >Cases Turnaround Time</Typography>
                                    <Box sx={{ width: '100%', height: 300, m: 'auto' }}>
                                        <Chart
                                            type="boxplot"
                                            data={monthlyBoxPlotData}
                                            options={monthlyboxPlotOptions}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases by Staff */}
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className="chart" py={2} px={3}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>Cases by Staff</Typography>
                                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Cases Handled</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cases by Category</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Turnaround Time (Days)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {monthlyStatus?.table.map((staff) => (
                                                    <TableRow key={staff.staffName}>
                                                        <TableCell align="center">{staff.staffName}</TableCell>
                                                        <TableCell align="center">{staff.casesHandled}</TableCell>
                                                        <TableCell>
                                                            <Table>
                                                                <TableBody>
                                                                    {staff.categories.map((category, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{category.categoryName}</TableCell>
                                                                            <TableCell align="center">{category.count}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {Math.round((staff.avgTurnaroundTime / (1000 * 60 * 60 * 24)) * 10) / 10} {/* Convert ms to days, round to 1 decimal */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {homeView === 'yearly' && user?.role === 'admin' && (
                    <Grid id='chartContainer' container spacing={3} sx={{ pt: 2 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h4">
                                        {yearFilter}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={8}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box py={2} px={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h5">Cases Initiated</Typography>
                                    <Typography variant="h4" color="primary">{yearlyStatus?.kpis.casesInitiatedCurrentYear}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        {/* Bar Chart for Cases by Category */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart year' py={2} px={3}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>Cases by Category</Typography>
                                    <Box sx={{ height: 290, m: "auto" }}>
                                        <Bar
                                            data={yearlyBarChartData}
                                            options={yearlyBarChartOptions}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* BoxPlot for Cases Turnaround Time */}
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart year' py={2} px={3}>
                                    <Typography variant="h6" sx={{ textAlign: "center" }}>Cases Turnaround Time</Typography>
                                    <Box sx={{ width: '100%', height: 300, m: 'auto' }}>
                                        <Chart
                                            type="boxplot"
                                            data={yearlyBoxPlotData}
                                            options={yearlyBoxPlotOptions}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Cases Initiated Line Chart */}
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart year' py={2} px={3}>
                                    <Typography variant="h5" sx={{ textAlign: "center" }}>Cases Initiated</Typography>
                                    <Box sx={{ width: '100%', height: 400, p: 1 }}>
                                        <Line
                                            data={yearlyLineChartData}
                                            options={yearlyLineChartOptions}
                                            height={400} // Fix height for the chart
                                            width={'100%'} // Ensure the chart takes up 100% of its container
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Staff Table */}
                        <Grid item xs={12}>
                            <Paper elevation={4} sx={{ ...muiStyles.paperStyle, display: 'flex', flexDirection: 'column' }}>
                                <Box className='chart' py={2} px={3}>
                                    <Typography variant="h5" sx={{ textAlign: "center" }}>Cases by Staff</Typography>
                                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Cases Handled</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cases by Category</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Turnaround Time (Days)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {yearlyStatus?.table.map((staff) => (
                                                    <TableRow key={staff.staffName}>
                                                        <TableCell align="center">{staff.staffName}</TableCell>
                                                        <TableCell align="center">{staff.casesHandled}</TableCell>
                                                        <TableCell>
                                                            <Table>
                                                                <TableBody>
                                                                    {staff.categories.map((category, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{category.categoryName}</TableCell>
                                                                            <TableCell align="center">{category.count}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {Math.round((staff.avgTurnaroundTime / (1000 * 60 * 60 * 24)) * 10) / 10} {/* Convert ms to days, round to 1 decimal */}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}


            </Container >
        </>

    );
};

export default Home;