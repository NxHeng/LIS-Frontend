import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const CategoryContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [categoryLoaded, setCategoryLoaded] = useState(false);

    //create new category to database
    const createCategory = async (category) => {
        try {
            const response = await fetch(`${API_URL}/create/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            // setCategories([...categories, data]);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    //update categories state
    const deleteCategoriesState = (category) => {
        const newCategories = categories.filter((c) => c._id !== category._id);
        setCategories(newCategories);
    };

    //update category in database
    const updateCategory = async (category) => {
        try {
            const response = await fetch(`${API_URL}/create/updateCategory/${category.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateFields = async (category, fields, categoryName) => {
        try {
            const response = await fetch(`${API_URL}/create/updateCategory/${category._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryName: categoryName,
                    fields: fields
                }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateTasks = async (category, tasks) => {
        try {
            const response = await fetch(`${API_URL}/create/updateCategory/${category._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks: tasks }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }


    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/create/getCategories`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategories(data);
            setCategoriesLoaded(true);
        } catch (error) {
            console.error('There was a problem fetching the categories:', error);
        }
    };

    const fetchCategory = async (id) => {
        try {
            const response = await fetch(`${API_URL}/create/getCategory/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategory(data);
            setCategoryLoaded(true);
        } catch (error) {
            console.error('There was a problem fetching the category:', error);
        }
    }

    const deleteCategory = async (category) => {
        try {
            const response = await fetch(`${API_URL}/create/deleteCategory/${category._id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
        deleteCategoriesState(category);
    }

    return (
        <CategoryContext.Provider value={{
            category,
            setCategory,
            categories,
            setCategories,
            createCategory,
            updateCategory,
            updateFields,
            updateTasks,
            deleteCategory,
            deleteCategoriesState,
            fetchCategory,
            fetchCategories,
            categoryLoaded,
            categoriesLoaded,
            selectedCategoryId,
            setSelectedCategoryId,
        }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
