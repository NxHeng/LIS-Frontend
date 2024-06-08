import React, { useState } from 'react';
import { TextField, Button, AppBar, Toolbar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useTaskContext } from '../../../context/TaskContext';
import { useCaseContext } from '../../../context/CaseContext';

// Styled components for custom styling
const StyledAppBar = styled(AppBar)({
    top: 'auto',
    bottom: 0,
    backgroundColor: 'lightgrey', // Light background
    boxShadow: 'none', // No shadow for a flatter design
    borderTop: '1px solid #ccc', // Add a subtle border
});

const StyledTextField = styled(TextField)({
    marginRight: 8,
    marginLeft: "30vh",
    backgroundColor: 'white',
    flexGrow: 1,
    '& .MuiInputBase-input': {
        color: '#000', // Text color
    },
});

const StyledButton = styled(Button)({
    marginRight: "30vh",
    backgroundColor: 'primary', // Teal color for the button
    color: '#fff',
    '&:hover': {
        backgroundColor: '#00796b', // Darken the button on hover
    },
});

const StickyBottomBar = () => {

    const caseId = JSON.parse(localStorage.getItem('caseItem'))._id;

    const [taskName, setTaskName] = useState(''); 
    const { addTaskToDatabase } = useTaskContext();
    const { fetchCase } = useCaseContext();

    const handleAddTask = () => {
        if (taskName.trim()) {
            addTaskToDatabase(caseId, taskName); // Add the task to the database
            setTaskName(''); // Reset the field after adding
        }
        fetchCase(caseId); // Fetch the case to update the tasks list
    };

    return (
        <StyledAppBar position="fixed">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', padding: 2 }}>
                    <StyledTextField
                        placeholder="New Task..."
                        variant="outlined"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <StyledButton onClick={handleAddTask} variant="contained">
                        Add Task +
                    </StyledButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default StickyBottomBar;
