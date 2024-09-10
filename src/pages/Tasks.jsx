import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Stack, Button } from '@mui/material';

import { useTaskContext } from '../context/TaskContext';
import CentralTaskItem from '../components/Tasks/CentralTaskItem';
import CentralTaskDetail from '../components/Tasks/CentralTaskDetail';

const Tasks = () => {

    const { statusFilter, filterStatus, getTasksByStaff, tasks } = useTaskContext();
    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        getTasksByStaff(JSON.parse(localStorage.getItem('user'))._id);
    }, []);

    // temp
    useEffect(() => {
        console.log(tasks);
    }, [tasks]);

    const handleStatusFilter = (status) => {
        //filter tasks by status
        filterStatus(status);
        const result = tasks?.filter((task) => task.status === status);
        setFilteredTasks(result);
        console.log(status, " ", filteredTasks);
    }

    return (
        <>
            {/* Main Task List Section */}
            <Container sx={{ p: 2 }}>
                <Typography variant='h2'>Tasks</Typography>
                <Box sx={{ flexGrow: 1, mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Side Navigation */}
                        <Grid item xs={3}>
                            <Stack>
                                <Typography variant='h4' color='grey'>Status</Typography>
    
                                <Button onClick={() => handleStatusFilter("Pending")} variant={statusFilter === "Pending" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                    Pending
                                </Button>
    
                                <Button onClick={() => handleStatusFilter("Overdue")} variant={statusFilter === "Overdue" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                    Overdue
                                </Button>
    
                                <Button onClick={() => handleStatusFilter("On Hold")} variant={statusFilter === "On Hold" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                    On Hold
                                </Button>
    
                                <Button onClick={() => handleStatusFilter("Completed")} variant={statusFilter === "Completed" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                    Completed
                                </Button>
    
                                <Button onClick={() => handleStatusFilter("Awaiting Initiation")} variant={statusFilter === "Awaiting Initiation" ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }}>
                                    Awaiting Initiation
                                </Button>
                            </Stack>
                        </Grid>
    
                        {/* Task List */}
                        <Grid item xs={9}>
                            <Container maxWidth="md">
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant='h4'>Task List</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Grid container spacing={2}>
                                            {filteredTasks?.length > 0 ? (
                                                filteredTasks.map((task, index) => (
                                                    <Grid item xs={9} key={task._id}>
                                                        <CentralTaskItem task={task} index={index} />
                                                    </Grid>
                                                ))
                                            ) : (
                                                <Grid item xs={12}>
                                                    <Typography variant='h5' color='grey'>No Tasks Available</Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Box>
                                </Box>
                            </Container>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    
            {/* Task Detail Section outside Container */}
            <Box
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
            </Box>
        </>
    );
    
    
};

export default Tasks;
