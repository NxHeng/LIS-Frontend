import React, { useState, useEffect, useMemo } from 'react';
import { AppBar, Toolbar, Box, Typography, Container, Stack, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Info';
import { debounce } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { parseISO } from 'date-fns';
import { useTaskContext } from '../../../context/TaskContext';

const TaskDetail = () => {

    const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const caseId = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('caseItem'))._id;
        } catch (error) {
            console.error('Failed to parse case item from localStorage:', error);
            return null;
        }
    }, []);
    const { task, updateTaskInDatabase, updateTask, deleteTask, deleteTaskFromDatabase, setTask } = useTaskContext();
    
    const [formData, setFormData] = useState({
        description: '',
        initiationDate: null,
        dueDate: null,
        reminder: '',
        remark: '',
        status: '',
    });

    useEffect(() => {
        console.log('Task:', task);
        if (task) {
            setFormData({
                description: task.description || '',
                initiationDate: task.initiationDate ? parseISO(task.initiationDate) : null,
                dueDate: task.dueDate ? parseISO(task.dueDate) : null,
                reminder: task.reminder ? parseISO(task.reminder) : null,
                remark: task.remark || '',
                status: task.status || '',
            });
        }
    }, [task]);

    const debouncedSave = debounce((value) => {
        console.log("triggered");
        updateTaskInDatabase(caseId, task._id, formData);
        updateTask(task._id, formData);
    }, 1000);

    useEffect(() => {
        // console.log("useEffect triggered");
        if (formData && (formData.description || formData.remark || formData.status)) {
            // console.log("after useEffect triggered");
            debouncedSave(formData);
        }

        // Cleanup function to cancel the debounce on unmount
        return () => {
            debouncedSave.cancel();
        };
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prevData => ({ ...prevData, [name]: date || null }));
    };

    // const handleSubmit = () => {
    //     e.preventDefault();
    //     updateTaskInDatabase(caseId, task._id, formData);
    //     updateTask(task._id, formData);
    // };

    const handleDeleteTask = () => {
        deleteTaskFromDatabase(caseId, task._id);
        deleteTask(task._id);
        setTask(null);
    };

    if (!task) {
        return (
            <Container sx={{ pb: 5 }}>
                <Typography variant='h5' sx={{ mt: 3 }}>Task Detail</Typography>
                <Typography>No task selected</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ pb: 5 }}>
            <Typography variant='h5' sx={{ mt: 3 }}>Task Detail</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
                <Stack spacing={2} component="form" sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        margin="normal"
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <DatePicker
                        label="Initiation Date"
                        value={formData.initiationDate}
                        onChange={(date) => handleDateChange('initiationDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <DatePicker
                        label="Due Date"
                        value={formData.dueDate}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <DatePicker
                        label="Reminder"
                        value={formData.reminder}
                        onChange={(date) => handleDateChange('reminder', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <TextField
                        fullWidth
                        label="Remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        margin="normal"
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    {
                        caseItem.status === 'active' || caseItem.status === 'Active' ?
                            <Stack spacing={1} direction="column" sx={{ mt: 2 }}>
                                {/* <Button
                            type="submit"
                            variant='contained'
                            color='primary'
                            endIcon={<InfoIcon />}
                            sx={{ borderRadius: 3 }}
                        >
                            {task.status}
                        </Button> */}
                                <FormControl fullWidth>
                                    <InputLabel id="task-status-label">Status</InputLabel>
                                    <Select
                                        labelId="task-status-label"
                                        id="task-status-select"
                                        value={formData.status}
                                        name="status"
                                        onChange={handleChange}
                                        endIcon={<EditIcon />}
                                        sx={{ mb: 3 }}
                                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Due">Due</MenuItem>
                                        <MenuItem value="On Hold">On Hold</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Awaiting Initiation">Awaiting Initiation</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button
                                    variant='contained'
                                    color='error'
                                    endIcon={<DeleteIcon />}
                                    sx={{ borderRadius: 3 }}
                                    onClick={handleDeleteTask}
                                    {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                                >
                                    Delete
                                </Button>
                            </Stack> : null
                    }
                </Stack>
            </LocalizationProvider>
        </Container>
    );
};

export default TaskDetail;
