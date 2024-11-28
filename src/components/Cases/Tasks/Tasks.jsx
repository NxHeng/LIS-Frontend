import React, { useEffect, useMemo } from 'react';
import { Container, Typography, List, Card, CardContent, Box } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import muiStyles from '../../../styles/muiStyles';

import TaskItem from './TaskItem';

import { useTaskContext } from '../../../context/TaskContext';

const Tasks = () => {

    const { tasks, setTasks, tasksLoaded, setTasksLoaded, fetchTasks, updateTasksOrder } = useTaskContext();

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

    // temp
    useEffect(() => {
        if (tasksLoaded) {
            console.log(tasks);
        }
    }, [tasksLoaded, tasks]);

    const handleOnDragEnd = (result) => {
        console.log("something happened");
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);
        const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order: index, // Update the order to match the new index
        }));

        setTasks(updatedTasks);
        updateTasksOrder(caseItem._id, updatedTasks);
        console.log("this is reordered tasks: ", updatedTasks);
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
                <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2, display: "flex", justifyContent: "start" }}>
                    <Box sx={{
                        px: 2,
                        pt: .5,
                        pb: .5,
                    }}>
                        <Typography variant="h6">
                            Tasks
                        </Typography>
                    </Box>
                </Card>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography variant='h5' color='grey'>No Tasks Available</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2, display: "flex", justifyContent: "start" }}>
                <Box sx={{
                    px: 2,
                    pt: .5,
                    pb: .5,
                }}>
                    <Typography variant="h6">
                        Tasks
                    </Typography>
                </Box>
            </Card>
            <Card sx={{ ...muiStyles.cardStyle, p: 0, mb: 10, backdropFilter: 'unset' }}>
                <CardContent>
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
                </CardContent>
            </Card>
        </Container>
    );
}

export default Tasks;