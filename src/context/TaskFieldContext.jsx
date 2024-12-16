import React, { createContext, useState, useContext } from 'react';

// Create a context for fields
const TaskFieldContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

// Create a provider component
export const TaskFieldContextProvider = ({ children }) => {
    const [taskFields, setTaskFields] = useState([]);
    const [taskFieldsLoaded, setTaskFieldsLoaded] = useState(false);

    // Fetch all fields from the server
    const fetchTaskFields = async () => {
        try {
            const response = await fetch(`${API_URL}/task/getAllTasks`);
            if (response.ok) {
                const data = await response.json();
                setTaskFields(data);
                setTaskFieldsLoaded(true);
                console.log('Task fields:', data);
            } else {
                console.error('Failed to fetch task fields');
            }
        } catch (error) {
            console.error('Error fetching task fields:', error);
        }
    };

    const createTaskField = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/task/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const newTaskField = await response.json();
                // Add the new field to the current list of fields
                setTaskFields([...taskFields, newTaskField]);
            } else {
                console.error('Failed to create task field');
            }
        } catch (error) {
            console.error('Error creating task field:', error);
        }
    };

    // Delete a field by ID
    const deleteTaskField = async (fieldId) => {
        try {
            const response = await fetch(`${API_URL}/task/deleteTask/${fieldId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTaskFields(taskFields.filter(field => field._id !== fieldId));
            } else {
                console.error('Failed to delete field');
            }
        } catch (error) {
            console.error('Error deleting field:', error);
        }
    };

    return (
        <TaskFieldContext.Provider value={{
            taskFields,
            taskFieldsLoaded,
            fetchTaskFields,
            createTaskField,
            deleteTaskField
        }}>
            {children}
        </TaskFieldContext.Provider>
    );
};

// Custom hook to use field context
export const useTaskFieldContext = () => useContext(TaskFieldContext);
