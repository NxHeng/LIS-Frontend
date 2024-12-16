import React from 'react';
import { useState } from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';

import { useTaskContext } from '../../../context/TaskContext';

const TaskItem = ({ task, index, onStatusChange, newStatus }) => {
    // console.log(task);
    const { setTask, updateTask, updateTaskStatus, updateTaskInDatabase } = useTaskContext();

    const { id, description, dueDate, status } = task;
    // const [completed, setCompleted] = useState(status === 'Completed');

    const caseId = JSON.parse(localStorage.getItem('caseItem'))._id;
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    const handleCheckboxChange = () => {
        const newStatus = status === 'Completed' ? 'Pending' : 'Completed';
        // setCompleted(true);
        // updateTask(task._id, { status: newStatus });
        // updateTaskInDatabase(caseId, task._id, { status: newStatus });
        console.log('status:', status);
        console.log('newStatus:', newStatus);
        updateTaskStatus(caseId, task._id, newStatus);
        // onStatusChange(newStatus);
    };

    const handleClick = () => {
        setTask(task);
    };

    const formatDate = (date) => {
        return format(new Date(date), "yyyy-MM-dd");
    };

    return (
        <Draggable key={id} draggableId={task._id.toString()} index={index}>
            {(provided) => (
                <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    divider
                    sx={{ justifyContent: 'flex-start', alignItems: 'center', cursor: "pointer" }}
                    onClick={handleClick}
                >
                    <Checkbox
                        edge="start"
                        checked={status === 'Completed' ? true : false}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': id }}
                        onChange={handleCheckboxChange}
                        {...caseItem?.status === 'active' || caseItem?.status === 'Active' ? { disabled: false } : { disabled: true }}
                    />
                    <ListItemText
                        edge="start"
                        id={id}
                        primary={description}
                        style={{ textDecoration: status === 'Completed' ? true : false ? 'line-through' : 'none' }}
                    />
                    <ListItemText
                        edge="end"
                        primary={dueDate !== null ? formatDate(dueDate) : ''}
                        sx={{ textAlign: 'right', mr: 2 }}
                        style={{ textDecoration: status === 'Completed' ? true : false ? 'line-through' : 'none' }}
                    />
                </ListItem>
            )}
        </Draggable>
    );
};

export default TaskItem;
