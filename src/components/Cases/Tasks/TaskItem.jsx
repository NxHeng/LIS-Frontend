import React from 'react';
import { useState } from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

import { useTaskContext } from '../../../context/TaskContext';

const TaskItem = ({ task, index, newStatus, onStatusChange }) => {
    console.log(task)
    const { setTask, updateTask, updateTaskInDatabase } = useTaskContext();

    const { id, description, due, status } = task;
    const [completed, setCompleted] = useState(status === 'Completed');

    const caseId = JSON.parse(localStorage.getItem('caseItem'))._id;
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    const handleCheckboxChange = () => {
        // set task status to completed or pending and updateTask, updateTaskInDatabase
        setCompleted(!completed);
        updateTask(task._id, { status: completed ? 'Pending' : 'Completed' });
        updateTaskInDatabase(caseId, task._id, { status: completed ? 'Pending' : 'Completed' });
        onStatusChange(newStatus);
    };

    const handleClick = () => {
        setTask(task);
    }

    return (
        <Draggable key={id} draggableId={task._id.toString()} index={index} >
            {(provided) => (
                <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    divider
                    sx={{ justifyContent: 'flex-start', alignItems: 'center' }}
                    onClick={handleClick}
                >
                    {/* <Box sx={{p: 1, pr: 3}}>
                        {task.id}
                    </Box> */}
                    <Checkbox
                        edge="start"
                        checked={completed}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': id }}
                        onChange={handleCheckboxChange}
                        {...caseItem.status === 'active' || caseItem.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <ListItemText
                        edge="start"
                        id={id}
                        primary={description}
                        style={{ textDecoration: completed ? 'line-through' : 'none' }}
                    />
                    <ListItemText
                        edge="end"
                        primary={due}
                        style={{ textDecoration: completed ? 'line-through' : 'none' }}
                    />
                </ListItem>
            )}
        </Draggable>
    );
}

export default TaskItem;