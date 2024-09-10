import React, { createContext, useContext, useState } from 'react';

const TaskContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const TaskContextProvider = ({ children }) => {
    // Tasks for one case at a time
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState();
    const [tasksLoaded, setTasksLoaded] = useState(false);
    // For Central Tasks Page only
    const [statusFilter, setStatusFilter] = useState("Pending");

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

    const updateTasksOrder = async (caseId, tasksData) => {
        try {
            const response = await fetch(`${API_URL}/case/updateTasksOrder/${caseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tasksData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

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
            // console.log(data);
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
                body: JSON.stringify({ description: taskData, order: tasks.length }),
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

    // Central Tasks Page
    const getTasksByStaff = async (staffId) => {
        try {
            const response = await fetch(`${API_URL}/case/getTasksByStaff/${staffId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTasks(data);
            setTasksLoaded(true);
        } catch (error) {
            console.error(error);
        }
    }

    const filterStatus = (status) => {
        //filter tasks by status
        setTask(null);
        setStatusFilter(status);
        const filteredTasks = tasks?.filter((task) => task.status === status);
        console.log(status, " ", filteredTasks);
        return filteredTasks;
    }


    return (
        <TaskContext.Provider value={{
            task,
            tasks,
            setTasks,
            setTask,
            updateTask,
            tasksLoaded,
            setTasksLoaded,
            updateTaskInDatabase,
            updateTasksOrder,
            addTaskToDatabase,
            deleteTask,
            deleteTaskFromDatabase,
            fetchTasks,
            updateTaskStatus,
            statusFilter,
            filterStatus,
            getTasksByStaff,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
