import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

const initialTasks = [
    {
        id: 1,
        description: 'Task 1',
        status: 'Pending',
        due: '2024-6-31'
    },
    {
        id: 2,
        description: 'Task 2',
        status: 'Completed',
        due: '2024-6-31'
    },
    {
        id: 3,
        description: 'Task 3',
        status: 'Pending',
        due: '2024-6-31'
    },
    {
        id: 4,
        description: 'Task 4',
        status: 'Completed',
        due: '2024-6-31'
    },
    {
        id: 5,
        description: 'Task 5',
        status: 'Pending',
        due: '2024-6-31'
    }
]

export const TaskContextProvider = ({ children }) => {
    // Tasks for one case at a time
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState(initialTasks);

    //Find a task by id and set it to the task state
    const updateTask = (id) => {
        const task = tasks.find(task => task.id === id);
        setTask(task);
    }

    return (
        <TaskContext.Provider value={{ task, tasks, setTasks, setTask, updateTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
