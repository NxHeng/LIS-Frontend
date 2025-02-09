import React, { useEffect, useState } from 'react';
import { Container, Stack, Typography, CircularProgress, Card, CardContent, Box, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';
import muiStyles from '../../../styles/muiStyles';

import TaskCard from './TaskCard';
import { useTaskFieldContext } from '../../../context/TaskFieldContext';
import { useCaseContext } from '../../../context/CaseContext';

const TaskList = () => {
    const { taskFields, taskFieldsLoaded, fetchTaskFields, deleteTaskField, createTaskField } = useTaskFieldContext();

    const [openModal, setOpenModal] = useState(false);
    const [taskFieldName, setTaskFieldName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTaskFields();
    }, []);

    const handleDelete = (fieldId) => {
        deleteTaskField(fieldId);
    };

    // Open the modal for creating a new field
    const handleNewFieldClick = () => {
        setOpenModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setTaskFieldName('');
    };

    // Handle form submission to create a new field
    const handleSubmit = async () => {
        if (!taskFieldName) {
            return; // Optional: handle validation errors
        }
        setLoading(true);
        try {
            await createTaskField({ description: taskFieldName });
            handleCloseModal();
        } catch (error) {
            console.error('Error creating field:', error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 7;

    // Calculate total pages
    const totalPages = Math.ceil(taskFields.length / tasksPerPage);

    // Get task fields for the current page
    const startIndex = (currentPage - 1) * tasksPerPage;
    const sortedTaskFields = taskFields.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentTaskFields = sortedTaskFields.slice(startIndex, startIndex + tasksPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (!taskFieldsLoaded) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={2}>
                <Card sx={{ ...muiStyles.cardStyle, p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
                        <Typography variant="h6">Tasks Fields</Typography>
                    </Box>
                    <Button onClick={handleNewFieldClick} variant="contained" sx={muiStyles.detailsButtonStyle}>
                        New Task Field
                    </Button>
                </Card>

                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                    {currentTaskFields.map((taskField) => (
                        <TaskCard key={taskField._id} taskField={taskField} onDelete={handleDelete} />
                    ))}
                </Card>
                <Card sx={muiStyles.cardStyle}>
                    <CardContent>
                        {/* Pagination Component */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Stack>

            {/* Modal for creating a new field */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="new-field-modal-title"
                aria-describedby="new-field-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,  // Set a fixed width to make it smaller
                    bgcolor: 'white',  // White background
                    borderRadius: 2,  // Rounded corners
                    boxShadow: 24,  // Shadow for a nice lift effect
                    p: 3,  // Padding inside the modal
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Create New Task
                    </Typography>

                    <TextField
                        label="Task Name"
                        value={taskFieldName}
                        onChange={(e) => setTaskFieldName(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseModal} color='error' variant='outlined' sx={{ ...muiStyles.detailsButtonStyle, mr: 1 }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            sx={muiStyles.detailsButtonStyle}
                        >
                            {loading ? 'Creating...' : 'Create Task'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

export default TaskList;
