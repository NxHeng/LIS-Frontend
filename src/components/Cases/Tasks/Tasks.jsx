import React from 'react';
import { Container, Typography, List } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import TaskItem from './TaskItem';

import { useTaskContext } from '../../../context/TaskContext';

const Tasks = () => {

    const { tasks, setTasks } = useTaskContext();

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        setTasks(reorderedTasks);
    };

    return (
        <Container>
            <Typography variant='h4'>Tasks</Typography>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            {tasks.map((task, index) => (
                                <TaskItem key={task.id} task={task} index={index} />
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