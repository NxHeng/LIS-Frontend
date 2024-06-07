import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const CategoryContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);

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



    return (
        <CategoryContext.Provider value={{ category, setCategory, categories, setCategories, createCategory, fetchCategories, categoriesLoaded }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
