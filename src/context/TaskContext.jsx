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
    const [filteredTasks, setFilteredTasks] = useState([]);

    //Find a task by id and set it with new task data
    const updateTask = (taskId, taskData) => {
        setTasks(tasks?.map((task) => (task._id === taskId ? { ...task, ...taskData } : task)));
    }

    const updateFilteredTasks = (taskId, taskData) => {
        setFilteredTasks((prevFilteredTasks) => {
            // Create a new object to avoid mutation of the previous state
            const updatedFilteredTasks = Object.entries(prevFilteredTasks).reduce((acc, [caseId, caseGroup]) => {
                // For each case, map through its tasks to find the one that needs to be updated
                const updatedTasks = caseGroup.tasks.map((task) =>
                    task._id === taskId ? { ...task, ...taskData } : task // Update the task if it matches the taskId
                );

                // Add the updated caseGroup to the accumulator with the updated tasks
                acc[caseId] = { ...caseGroup, tasks: updatedTasks };

                return acc;
            }, {});

            // Return the updated state to trigger re-render
            return updatedFilteredTasks;
        });

        setTasks((prevTasks) => {
            // Create a new object to avoid mutation of the previous state
            const updatedTasks = Object.entries(prevTasks).reduce((acc, [caseId, caseGroup]) => {
                // For each case, map through its tasks to find the one that needs to be updated
                const updatedTasks = caseGroup.tasks.map((task) =>
                    task._id === taskId ? { ...task, ...taskData } : task // Update the task if it matches the taskId
                );

                // Add the updated caseGroup to the accumulator with the updated tasks
                acc[caseId] = { ...caseGroup, tasks: updatedTasks };

                return acc;
            }, {});

            // Return the updated state to trigger re-render
            return updatedTasks;
        });
    };


    const updateTaskStatus = (caseId, taskId, newStatus) => {
        const updatedTask = tasks?.find(task => task._id === taskId);
        if (updatedTask) {
            updatedTask.status = newStatus;
            setTasks([...tasks]);  // Or however you manage the tasks state
            updateTaskInDatabase(caseId, taskId, { status: newStatus });
        }
    };

    const updateTaskStatusGroupedByCase = (caseId, taskId, newStatus) => {
        // Update in filteredTasks
        const caseGroupFiltered = filteredTasks[caseId];
        if (caseGroupFiltered) {
            // Find the task in the filtered tasks
            const updatedTaskInFiltered = caseGroupFiltered.tasks.find(task => task._id === taskId);

            if (updatedTaskInFiltered) {
                // Update the status in filteredTasks
                updatedTaskInFiltered.status = newStatus;

                // Update the filteredTasks state to reflect the change
                setFilteredTasks({
                    ...filteredTasks,
                    [caseId]: {
                        ...caseGroupFiltered,
                        tasks: [...caseGroupFiltered.tasks] // Trigger re-render with updated task
                    }
                });
            }
        }

        // Update in original tasks (the format is similar to filteredTasks, grouped by caseId)
        const caseGroupOriginal = tasks[caseId];
        if (caseGroupOriginal) {
            // Find the task in the original tasks
            const updatedTaskInOriginal = caseGroupOriginal.tasks.find(task => task._id === taskId);

            if (updatedTaskInOriginal) {
                // Update the status in the original tasks
                updatedTaskInOriginal.status = newStatus;

                // Update the tasks state to reflect the change
                setTasks({
                    ...tasks,
                    [caseId]: {
                        ...caseGroupOriginal,
                        tasks: [...caseGroupOriginal.tasks] // Trigger re-render with updated task
                    }
                });

                // Optionally, update the database with the new status
                updateTaskInDatabase(caseId, taskId, { status: newStatus });
            }
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
            // console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const updateTaskInDatabase = async (caseId, taskId, taskData) => {
        try {
            // console.log("update task in database");
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

    const addTaskToDatabase = async (caseId, taskData) => {
        try {
            const response = await fetch(`${API_URL}/case/addTask/${caseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: taskData, order: tasks?.length }),
            });
            const data = await response.json();
            fetchTasks(caseId);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteTask = (id) => {
        setTasks(tasks?.filter((task) => task._id !== id));
    }

    const deleteTaskFromDatabase = async (caseId, taskId) => {
        try {
            const response = await fetch(`${API_URL}/case/deleteTask/${caseId}/${taskId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
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
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    // const filterStatus = (status) => {
    //     //filter tasks by status
    //     setTask(null);
    //     setStatusFilter(status);
    //     const filteredTasks = tasks?.filter((task) => task.status === status);
    //     // console.log(status, " ", filteredTasks);
    //     return filteredTasks;
    // }

    const filterStatus = (status) => {
        // Reset task and update status filter
        setTask(null);
        setStatusFilter(status);

        // Iterate over tasks grouped by caseId
        const filteredTasks = Object.entries(tasks).reduce((acc, [caseId, { matterName, tasks: taskList }]) => {
            if (Array.isArray(taskList)) {
                // Filter tasks by status
                const filtered = taskList.filter((task) => task.status === status);
                if (filtered.length > 0) {
                    // Retain original structure but update tasks with the filtered list
                    acc[caseId] = {
                        matterName,
                        tasks: filtered
                    };
                }
            } else {
                console.warn(`Expected taskList to be an array, but got ${typeof taskList} for caseId ${caseId}`);
            }
            return acc;
        }, {});

        return filteredTasks; // Return the filtered tasks with the original format
    };




    return (
        <TaskContext.Provider value={{
            task,
            tasks,
            setTasks,
            setTask,
            filteredTasks,
            setFilteredTasks,
            updateFilteredTasks,
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
            updateTaskStatusGroupedByCase,
            statusFilter,
            filterStatus,
            getTasksByStaff,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
