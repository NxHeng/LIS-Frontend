import React from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';

import { useTaskContext } from '../../context/TaskContext';

const CentralTaskItem = ({ task, onStatusChange, newStatus }) => {
    const { setTask, updateTaskStatus } = useTaskContext();

    const { id, description, due, status, caseId } = task;

    // const caseId = JSON.parse(localStorage.getItem('caseItem'))._id;
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    const handleCheckboxChange = () => {
        const newStatus = status !== 'Completed' ? 'Completed' : 'Pending';
        updateTaskStatus(caseId, task._id, newStatus);
    };

    const handleClick = () => {
        setTask(task);
    };

    return (
        <ListItem
            divider
            sx={{ justifyContent: 'flex-start', alignItems: 'center', cursor: "pointer" }}
            onClick={handleClick}
        >
            <Checkbox
                edge="start"
                checked={status === 'Completed'}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': id }}
                onChange={handleCheckboxChange}
                // disabled={caseItem.status !== 'Active' && caseItem.status !== 'active'}
            />
            <ListItemText
                edge="start"
                id={id}
                primary={description}
                style={{ textDecoration: status === 'Completed' ? 'line-through' : 'none' }}
            />
            <ListItemText
                edge="end"
                primary={due !== null ? 'Due Date' : 'No Due Date'}
                sx={{ textAlign: 'right', mr: 2 }}
                style={{ textDecoration: status === 'Completed' ? 'line-through' : 'none' }}
            />
        </ListItem>
    );
};

export default CentralTaskItem;
