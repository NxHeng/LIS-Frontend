import React from 'react';
import { ListItem, ListItemText, Checkbox } from '@mui/material';
import { format } from 'date-fns';

import { useTaskContext } from '../../context/TaskContext';

const CentralTaskItem = ({ task, onStatusChange, newStatus }) => {
    const { setTask, updateTaskStatusGroupedByCase } = useTaskContext();

    const { id, description, dueDate, status, caseId } = task;

    // const caseId = JSON.parse(localStorage.getItem('caseItem'))._id;
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    const handleCheckboxChange = () => {
        const newStatus = status === 'Completed' ? 'Pending' : 'Completed';
        console.log(caseId, task._id, newStatus);
        updateTaskStatusGroupedByCase(caseId, task._id, newStatus);
    };

    const handleClick = () => {
        setTask(task);
    };

    const formatDate = (date) => {
        return format(new Date(date), "yyyy-MM-dd");
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
                // disabled={caseItem?.status !== 'Active' && caseItem?.status !== 'active'}
            />
            <ListItemText
                edge="start"
                id={id}
                primary={description}
                style={{ textDecoration: status === 'Completed' ? 'line-through' : 'none' }}
            />
            <ListItemText
                edge="end"
                primary={dueDate !== null ? formatDate(dueDate) : ''}
                sx={{ textAlign: 'right', mr: 2 }}
                style={{ textDecoration: status === 'Completed' ? 'line-through' : 'none' }}
            />
        </ListItem>
    );
};

export default CentralTaskItem;
