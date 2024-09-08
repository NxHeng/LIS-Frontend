import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const TaskContextProvider = ({ children }) => {
    // Tasks for one case at a time
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState();
    const [tasksLoaded, setTasksLoaded] = useState(false);

    //Find a task by id and set it with new task data
    const updateTask = (taskId, taskData) => {
        setTasks(tasks.map((task) => (task._id === taskId ? { ...task, ...taskData } : task)));
    }

    const updateTaskStatus = (caseId, taskId, newStatus) => {
        const updatedTask = tasks.find(task => task._id === taskId);
        if (updatedTask) {
            updatedTask.status = newStatus;
            setTasks([...tasks]);  // Or however you manage the tasks state
            updateTaskInDatabase(caseId, taskId, { status: newStatus });
        }
    };

    const updateTaskInDatabase = async (caseId, taskId, taskData) => {
        try {
            const response = await fetch(`${API_URL}/case/updateTask/${caseId}/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    // const addTask = (taskData) => {
    //     setTasks([...tasks, taskData]);
    // }

    const addTaskToDatabase = async (caseId, taskData) => {
        try {
            const response = await fetch(`${API_URL}/case/addTask/${caseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: taskData }),
            });
            const data = await response.json();
            fetchTasks(caseId);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task._id !== id));
    }

    const deleteTaskFromDatabase = async (caseId, taskId) => {
        try {
            const response = await fetch(`${API_URL}/case/deleteTask/${caseId}/${taskId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTasks = async (id) => {
        try {
            const response = await fetch(`${API_URL}/case/getCase/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTasks(data.tasks);
            setTasksLoaded(true);
            return data;
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <TaskContext.Provider value={{ task, tasks, setTasks, setTask, updateTask, tasksLoaded, setTasksLoaded, updateTaskInDatabase, addTaskToDatabase, deleteTask, deleteTaskFromDatabase, fetchTasks, updateTaskStatus }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
