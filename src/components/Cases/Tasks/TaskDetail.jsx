import React from 'react';
import { Box, Typography, Container, Stack, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

import { useTaskContext } from '../../../context/TaskContext';

const TaskDetail = () => {

    const { task } = useTaskContext();

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
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6'>Description:</Typography>
                <Typography>{task.description}</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6'>Initiation Date:</Typography>
                <Typography>{task.initiationDate}</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6'>Due Date:</Typography>
                <Typography>{task.dueDate}</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6'>Reminder:</Typography>
                <Typography>{task.reminder}</Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6'>Remark:</Typography>
                <Typography>{task.remark}</Typography>
            </Box>
            <Stack spacing={1} direction="column">
                <Button
                    variant='contained'
                    color='primary'
                    endIcon={<InfoIcon />}
                    sx={{ borderRadius: 3 }}
                >
                    {task.status}
                </Button>
                <Button
                    variant='contained'
                    color='error'
                    endIcon={<DeleteIcon />}
                    sx={{ borderRadius: 3 }}
                >
                    Delete
                </Button>
            </Stack>


        </Container>
    );
}

export default TaskDetail;