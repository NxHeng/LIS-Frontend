import React, { createContext, useState, useContext } from 'react';

// Create a context for fields
const FieldContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

// Create a provider component
export const FieldContextProvider = ({ children }) => {
    const [fields, setFields] = useState([]);
    const [fieldsLoaded, setFieldsLoaded] = useState(false);

    // Fetch all fields from the server
    const fetchFields = async () => {
        try {
            const response = await fetch(`${API_URL}/field/getAllFields`);
            if (response.ok) {
                const data = await response.json();
                setFields(data);
                setFieldsLoaded(true);
            } else {
                console.error('Failed to fetch fields');
            }
        } catch (error) {
            console.error('Error fetching fields:', error);
        }
    };

    const createField = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/field/createField`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const newField = await response.json();
                // Add the new field to the current list of fields
                setFields([...fields, newField]);
            } else {
                console.error('Failed to create field');
            }
        } catch (error) {
            console.error('Error creating field:', error);
        }
    };

    // Delete a field by ID
    const deleteField = async (fieldId) => {
        try {
            const response = await fetch(`${API_URL}/field/deleteField/${fieldId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setFields(fields.filter(field => field._id !== fieldId));
            } else {
                console.error('Failed to delete field');
            }
        } catch (error) {
            console.error('Error deleting field:', error);
        }
    };

    return (
        <FieldContext.Provider value={{
            fields,
            fieldsLoaded,
            fetchFields,
            createField,
            deleteField
        }}>
            {children}
        </FieldContext.Provider>
    );
};

// Custom hook to use field context
export const useFieldContext = () => useContext(FieldContext);
