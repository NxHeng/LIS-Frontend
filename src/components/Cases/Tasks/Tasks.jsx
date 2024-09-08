import React, { useEffect, useMemo } from 'react';
import { Container, Typography, List } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import TaskItem from './TaskItem';

import { useTaskContext } from '../../../context/TaskContext';

const Tasks = () => {

    const { tasks, setTasks, tasksLoaded, setTasksLoaded, fetchTasks } = useTaskContext();

    const caseItem = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('caseItem'));
        } catch (error) {
            console.error('Failed to parse case item from localStorage:', error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (caseItem?.tasks) {
            fetchTasks(caseItem._id);
        } else {
            setTasksLoaded(false);
        }
    }, [caseItem?.tasks]);

    useEffect(() => {
        if (tasksLoaded) {
            console.log(tasks);
        }
    }, [tasksLoaded, tasks]);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        setTasks(reorderedTasks);
    };

    // const handleTaskStatusChange = (taskId, newStatus) => {
    //     // Find the task in the tasks array and update its status
    //     const updatedTasks = tasks.map(task => {
    //         if (task.id === taskId) {
    //             return { ...task, status: newStatus };
    //         }
    //         return task;
    //     });
    //     setTasks(updatedTasks);
    // };

    if (!tasksLoaded) {
        return (
            <Container>
                <Typography variant='h4'>No Tasks</Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant='h4'>Tasks</Typography>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.map((task, index) => (
                                <TaskItem key={task._id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Container>
    );
}

export default Tasks;