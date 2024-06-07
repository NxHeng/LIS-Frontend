import React from 'react';
import { useState } from 'react';
import { ListItem, ListItemText, Checkbox, Box } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

import { useTaskContext } from '../../../context/TaskContext';

const TaskItem = ({ task, index }) => {

    const { setTask, updateTask } = useTaskContext();

    const { id, description, due, status } = task;
    const [completed, setCompleted] = useState(status === 'Completed');

    const handleCheckboxChange = () => {
        setCompleted(!completed); 
        updateTask(id);
    };

    const handleClick = () => {
        setTask(task);
    }

    return (
        <Draggable key={id} draggableId={task.id.toString()} index={index} >
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