import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Grid, Box, Stack, Button, Card, CardContent } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';

import { useTaskContext } from '../context/TaskContext';
import { useCaseContext } from '../context/CaseContext';
import CentralTaskItem from '../components/Tasks/CentralTaskItem';
import CentralTaskDetail from '../components/Tasks/CentralTaskDetail';
import muiStyles from '../styles/muiStyles';
import Background from '../components/Background';

const Tasks = () => {

    const { statusFilter, filterStatus, getTasksByStaff, tasks, filteredTasks, setFilteredTasks, getAllTasks, tasksLoaded, setTasksLoaded } = useTaskContext();
    const { setFromTasks } = useCaseContext();
    // const [filteredTasks, setFilteredTasks] = useState([]);
    const didRunEffect = useRef(false);
    // const [tasksLoaded, setTasksLoaded] = useState(false);
    const location = useLocation();
    
    const fetchTasks = async () => {
        try {
            // Ensure setFromTasks is called before fetching tasks
            setFromTasks(false);

            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?._id;

            let result = null;
            if (user?.role === 'admin') {
                // Fetch all tasks
                result = await getAllTasks();
            } else {
                result = await getTasksByStaff(userId);
                // Wait for tasks to be fetched
            }

            if (result) setTasksLoaded(true);

            // console.log("Tasks successfully fetched!", result);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const initializeTasks = async () => {
            try {  
                // After tasks are fetched, filter based on location state
                // console.log("Tasks: ", Object.keys(tasks).length);
                console.log("Location state:", location);
    
                // Apply the filtering logic only when tasks are available
                if (tasks && Object.keys(tasks).length > 0 && tasksLoaded) {
                    if (location.state?.target) {
                        handleStatusFilter(location.state.target);
                    } else {
                        handleStatusFilter("Pending");
                    }
                } else {
                    console.warn("Tasks are still loading");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
    
        initializeTasks();
    }, [tasks, tasksLoaded]);  // Runs whenever location.state or tasks changes
    

    // useEffect(() => {
    //     // if tasks is not object or empty, return
    //     if (!tasks || Object.keys(tasks).length === 0) return;

    //     if (tasksLoaded && tasks && Object.keys(tasks).length > 0 && !didRunEffect.current) {
    //         handleStatusFilter("Pending");
    //         didRunEffect.current = true; // Set to true after first run
    //     }
    // }, [tasks, tasksLoaded]);

    const handleStatusFilter = (status) => {
        // Get filtered tasks by status
        const filtered = filterStatus(status);
        console.log("Filtered: ", filtered);

        // Initialize an empty object to store grouped tasks
        const groupedTasks = {};

        // Iterate through the filtered object
        Object.entries(filtered).forEach(([caseId, { matterName, tasks: taskList }]) => {
            // If the task list exists and has items, add to groupedTasks
            if (taskList && taskList.length > 0) {
                groupedTasks[caseId] = {
                    matterName, // Retain the matterName
                    tasks: taskList // Include the filtered tasks
                };
            }
        });

        // Set the grouped tasks in the state
        setFilteredTasks(groupedTasks);
    };



    // const handleStatusFilter = (status) => {
    //     //filter tasks by status
    //     console.log("Running filter");
    //     const result = filterStatus(status);
    //     // const result = tasks?.filter((task) => task.status === status);
    //     setFilteredTasks(result);
    //     console.log(status, " ", filteredTasks);
    // }

    return (
        <>
            <Background />
            {/* Main Task List Section */}
            <Container maxWidth='xl' sx={{ p: 2 }}>
                <Box sx={{ flexGrow: 1, mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Side Navigation */}
                        <Grid item xs={2}>
                            <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            px: 2,
                                            pt: 1,
                                            pb: .5,
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                Tasks
                                            </Typography>
                                        </Box>
                                        <Box sx={muiStyles.sideNavTitleStyle}>
                                            <QuizIcon fontSize="medium" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">
                                                Status
                                            </Typography>
                                        </Box>

                                        <Button onClick={() => handleStatusFilter("Pending")} variant={statusFilter === "Pending" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Pending
                                        </Button>

                                        <Button onClick={() => handleStatusFilter("Overdue")} variant={statusFilter === "Overdue" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Overdue
                                        </Button>

                                        <Button onClick={() => handleStatusFilter("On Hold")} variant={statusFilter === "On Hold" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            On Hold
                                        </Button>

                                        <Button onClick={() => handleStatusFilter("Completed")} variant={statusFilter === "Completed" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Completed
                                        </Button>

                                        <Button onClick={() => handleStatusFilter("Awaiting Initiation")} variant={statusFilter === "Awaiting Initiation" ? "contained" : "text"} sx={muiStyles.buttonStyle}>
                                            Awaiting Initiation
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Task List */}
                        <Grid item xs={7}>
                            <Container>
                                <Stack spacing={2}>
                                    <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2 }}>
                                        <Box sx={{
                                            px: 2,
                                            pt: .5,
                                            pb: .5,
                                        }}>
                                            <Typography variant="h6">
                                                Task List
                                            </Typography>
                                        </Box>
                                    </Card>
                                    {/* <Grid>
                                        <Card sx={{ ...muiStyles.cardStyle, p: 1, mb: 10, backdropFilter: 'unset' }}>
                                            <CardContent>
                                                {filteredTasks?.length > 0 ? (
                                                    filteredTasks.map((task, index) => (
                                                        <CentralTaskItem key={task._id} task={task} index={index} />
                                                    ))
                                                ) : (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Typography variant='h5' color='grey'>No Tasks Available</Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid> */}
                                    <Grid>
                                        <Card sx={{ ...muiStyles.cardStyle, p: 1, mb: 10, backdropFilter: 'unset' }}>
                                            <CardContent>
                                                {filteredTasks && Object.keys(filteredTasks).length > 0 ? (
                                                    Object.entries(filteredTasks).map(([caseId, { matterName, tasks }]) => (
                                                        <Box key={caseId} sx={{ mb: 3 }}>
                                                            <Typography variant="h6" sx={{ mb: 1, px: 2, fontWeight: 'bold' }}>
                                                                {matterName}
                                                            </Typography>
                                                            {tasks.map((task, index) => (
                                                                <CentralTaskItem key={task._id} task={task} index={index} />
                                                            ))}
                                                        </Box>
                                                    ))
                                                ) : (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Typography variant='h5' color='grey'>No Tasks Available</Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Stack>
                            </Container>
                        </Grid>

                        {/* Task Detail Section */}
                        <Grid item xs={3}>
                            <Box sx={{}}>
                                <CentralTaskDetail />
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Container>

            {/* Task Detail Section outside Container */}
            {/* <Box
                sx={{
                    width: '25%',
                    backgroundColor: "#f8f9fa",
                    height: 'calc(100vh - 64px)', // Adjust this height according to the top app bar height
                    position: 'fixed',
                    right: 0,
                    top: 64, // Adjust this value according to the top app bar height
                    boxShadow: "-2px 0 5px rgba(0,0,0,0.1)", // Optional: adds a shadow effect to the right sidebar
                    overflowY: 'auto', // Adds a scrollbar if the content overflows
                }}
            >
                <CentralTaskDetail />
            </Box> */}
        </>
    );


};

export default Tasks;
