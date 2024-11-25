import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Container, Stack, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Card, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { debounce } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { parseISO, isValid } from 'date-fns';
import { useTaskContext } from '../../../context/TaskContext';
import { jwtDecode } from 'jwt-decode';
import muiStyles from '../../../styles/muiStyles';

const TaskDetail = () => {

    const user = jwtDecode(localStorage.getItem('token'));
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
        reminder: null,
        remark: '',
        status: '',
    });

    useEffect(() => {
        if (task) {
            console.log("Task: ", task);
            // console.log('Task initiationDate:', task.initiationDate);
            // console.log('Parsed initiationDate:', isValid(parseISO(task.initiationDate)) ? parseISO(task.initiationDate) : null);

            setFormData({
                description: task.description || '',
                initiationDate: task.initiationDate || null,
                dueDate: task.dueDate || null,
                reminder: task.reminder || null,
                remark: task.remark || '',
                status: task.status || '',
            });
        }
    }, [task]);


    const debouncedSave = debounce((value) => {
        updateTaskInDatabase(caseId, task._id, formData);
        updateTask(task._id, formData);
    }, 1000);

    useEffect(() => {
        if (formData && (formData.description || formData.initiationDate || formData.dueDate || formData.reminder || formData.remark || formData.status)) {
            // console.log("trigger debounce???");
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
        console.log('Date:', date);
        setFormData(prevData => ({
            ...prevData,
            [name]: date ? date.toISOString() : null // Convert back to ISO string
        }));
    };

    const handleDeleteTask = () => {
        deleteTaskFromDatabase(caseId, task._id);
        deleteTask(task._id);
        setTask(null);
    };

    if (!task) {
        return (
            <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                <CardContent>
                    <Stack direction='column' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "auto", p: 2 }}>
                        <Typography variant='h5'>Task Detail</Typography>
                        <Typography>No task selected</Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Container sx={{ ...muiStyles.cardStyle, height: 'auto', py: 1 }}>
            <Typography variant='h5' sx={{ py: 3, px: 1 }}>Task Detail</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <Stack spacing={2} component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}> */}
                <Stack spacing={2} component="form">
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
                        value={formData.initiationDate ? new Date(formData.initiationDate) : null}
                        onChange={(date) => handleDateChange('initiationDate', date)}
                        slots={{ textField: TextField }}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <DatePicker
                        label="Due Date"
                        value={formData.dueDate ? new Date(formData.dueDate) : null}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        slots={{ textField: TextField }}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <DatePicker
                        label="Reminder"
                        value={formData.reminder ? new Date(formData.reminder) : null}
                        onChange={(date) => handleDateChange('reminder', date)}
                        slots={{ textField: TextField }}
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
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <FormControl fullWidth>
                                        <InputLabel id="task-status-label">Status</InputLabel>
                                        <Select
                                            labelId="task-status-label"
                                            id="task-status-select"
                                            value={formData.status}
                                            name="status"
                                            onChange={handleChange}
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
                                </Stack>
                                {user.role === 'admin' || user.role === 'solicitor' && (
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
                                )}
                            </Stack> : null
                    }
                </Stack>
            </LocalizationProvider>
        </Container>
    );
};

export default TaskDetail;
