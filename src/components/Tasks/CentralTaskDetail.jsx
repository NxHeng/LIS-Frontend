import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Container, Stack, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Info';
import _, { debounce } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { parseISO } from 'date-fns';
import { useTaskContext } from '../../context/TaskContext';
import { useNavigate } from 'react-router-dom';

import { useCaseContext } from '../../context/CaseContext';

const CentralTaskDetail = () => {

    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    // const caseId = useMemo(() => {
    //     try {
    //         return JSON.parse(localStorage.getItem('caseItem'))._id;
    //     } catch (error) {
    //         console.error('Failed to parse case item from localStorage:', error);
    //         return null;
    //     }
    // }, []);
    const { task, updateTaskInDatabase, updateTask, deleteTask, deleteTaskFromDatabase, setTask, updateFilteredTasks } = useTaskContext();

    const [formData, setFormData] = useState({
        description: '',
        initiationDate: null,
        dueDate: null,
        reminder: '',
        remark: '',
        status: null,
        caseId: '',
        clients: [],
        matterName: '',
        _id: '',
    });

    useEffect(() => {
        console.log("Task: ", task);
        if (task) {
            setFormData({
                description: task.description || '',
                initiationDate: task.initiationDate ? parseISO(task.initiationDate) : null,
                dueDate: task.dueDate ? parseISO(task.dueDate) : null,
                reminder: task.reminder ? parseISO(task.reminder) : null,
                remark: task.remark || null,
                status: task.status || '',
                caseId: task.caseId || '',
                clients: task.clients || [],
                matterName: task.matterName || '',
                _id: task._id || '',
            });
        }
    }, [task]);
    
    const debouncedSave = debounce((value) => {
        updateTaskInDatabase(task.caseId, task._id, formData);
        updateFilteredTasks(task._id, formData);
        setTask(formData);
        console.log("formData: ", formData);
    }, 1000);

    useEffect(() => {
        if (formData && task) {
            // Check for actual changes in formData fields
            if (
                formData.description !== task.description ||
                formData.remark !== task.remark ||
                formData.status !== task.status ||
                formData.initiationDate !== task.initiationDate ||
                formData.dueDate !== task.dueDate ||
                formData.reminder !== task.reminder
            ) {
                debouncedSave(formData);
                // console.log(formData.initiationDate === task.initiationDate);
                // console.log(formData.remark === task.remark);
                // console.log(formData.status === task.status);
                // console.log(formData.initiationDate === task.initiationDate);
                // console.log(formData.dueDate === task.dueDate);
                // console.log(formData.reminder === task.reminder);
            }
        }

        // Cleanup on unmount
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
    //     updateTaskInDatabase(task.caseId, task._id, formData);
    //     updateTask(task._id, formData);
    // };

    const handleDeleteTask = () => {
        deleteTaskFromDatabase(task.caseId, task._id);
        deleteTask(task._id);
        setTask(null);
    };

    const { setFromTasks, fromTasks } = useCaseContext();
    const navigate = useNavigate();

    const handleTitleClick = () => {
        setFromTasks(true);
        navigate(`/cases/details/${task.caseId}`);
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
            <Typography variant='h5' sx={{ mt: 3, mb: 2 }}>Task Detail</Typography>
            <Typography variant='h6' color='grey'>Case Title</Typography>
            <Typography onClick={handleTitleClick} sx={{ cursor: "pointer" }} variant='h6'>{task.matterName}</Typography>

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
                    />
                    <DatePicker
                        label="Initiation Date"
                        value={formData.initiationDate}
                        onChange={(date) => handleDateChange('initiationDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <DatePicker
                        label="Due Date"
                        value={formData.dueDate}
                        onChange={(date) => handleDateChange('dueDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <DatePicker
                        label="Reminder"
                        value={formData.reminder}
                        onChange={(date) => handleDateChange('reminder', date)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TextField
                        fullWidth
                        label="Remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        margin="normal"
                    />
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
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </LocalizationProvider>
        </Container>
    );
};

export default CentralTaskDetail;
