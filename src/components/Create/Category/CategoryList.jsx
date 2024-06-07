import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, CircularProgress } from '@mui/material';

import CategoryCard from './CategoryCard';

import { useCreateContext } from '../../../context/CreateContext';
import { useCategoryContext } from '../../../context/CategoryContext';

const CategoryList = () => {

    const { toNewCategory } = useCreateContext();
    const { categories, categoriesLoaded, fetchCategories } = useCategoryContext();

    useEffect(() => {
        fetchCategories();
    }, []);

    if (!categoriesLoaded) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Category List
                </Typography>
                <Button onClick={toNewCategory} variant="contained" color="primary">
                    New Category
                </Button>
            </Box>
            {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
            ))}
        </Container>
    );
};

export default CategoryList;